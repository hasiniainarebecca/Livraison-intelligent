<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // GET /api/admin/orders
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['client', 'livreur', 'items.product.category']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filtrer par catégorie de produit (via order_items)
        if ($request->filled('category_id')) {
            $query->whereHas('items.product', fn($q) =>
                $q->where('category_id', $request->category_id)
            );
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        return response()->json($query->latest()->paginate(20));
    }

    // PUT /api/admin/orders/{order}/validate
    public function validate(Request $request, Order $order): JsonResponse
    {
        if ($order->status !== 'en_attente') {
            return response()->json(['message' => 'Commande déjà traitée.'], 422);
        }

        $old = $order->status;
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $order->update(['status' => 'validée', 'otp_code' => $otp]);

        OrderStatusHistory::create([
            'order_id'   => $order->id,
            'changed_by' => $request->user()->id,
            'old_status' => $old,
            'new_status' => 'validée',
        ]);

        // Notifier le client
        Notification::create([
            'user_id'  => $order->client_id,
            'order_id' => $order->id,
            'type'     => 'order_validated',
            'title'    => 'Commande validée',
            'message'  => "Votre commande #{$order->id} a été validée. Code OTP : {$otp}",
        ]);

        return response()->json(['message' => 'Commande validée.', 'otp_code' => $otp]);
    }

    // PUT /api/admin/orders/{order}/assign
    public function assign(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'livreur_id'   => 'required|exists:users,id',
            'estimated_at' => 'nullable|date|after:now',
        ]);

        $livreur = User::findOrFail($data['livreur_id']);

        if ($livreur->role !== 'livreur') {
            return response()->json(['message' => "Cet utilisateur n'est pas un livreur."], 422);
        }

        if (!$livreur->is_active) {
            return response()->json(['message' => 'Ce livreur est suspendu.'], 422);
        }

        $order->update([
            'livreur_id'   => $livreur->id,
            'estimated_at' => $data['estimated_at'] ?? null,
        ]);

        // Notifier le client et le livreur
        foreach ([
            $order->client_id => "Un livreur a été affecté à votre commande #{$order->id}.",
            $livreur->id      => "Une nouvelle commande #{$order->id} vous a été assignée.",
        ] as $userId => $message) {
            Notification::create([
                'user_id'  => $userId,
                'order_id' => $order->id,
                'type'     => 'livreur_assigned',
                'title'    => 'Livreur affecté',
                'message'  => $message,
            ]);
        }

        return response()->json([
            'message' => 'Livreur affecté.',
            'order'   => $order->load(['livreur:id,name,phone', 'client:id,name', 'items.product']),
        ]);
    }

    // DELETE /api/admin/orders/{order}/unassign — retirer le livreur d'une mission
    public function unassign(Request $request, Order $order): JsonResponse
    {
        if (!$order->livreur_id) {
            return response()->json(['message' => 'Aucun livreur assigné à cette commande.'], 422);
        }

        if ($order->status === 'en_cours') {
            return response()->json([
                'message' => 'Impossible de retirer un livreur sur une livraison déjà en cours.',
            ], 422);
        }

        $livreurId = $order->livreur_id;
        $order->update(['livreur_id' => null, 'estimated_at' => null]);

        // Notifier le livreur
        Notification::create([
            'user_id'  => $livreurId,
            'order_id' => $order->id,
            'type'     => 'mission_removed',
            'title'    => 'Mission annulée',
            'message'  => "La mission de la commande #{$order->id} vous a été retirée.",
        ]);

        return response()->json(['message' => 'Mission retirée. Commande repassée en file d\'attente.']);
    }

    // GET /api/admin/reports
    public function reports(): JsonResponse
    {
        return response()->json([
            'total_orders'   => Order::count(),
            'en_attente'     => Order::where('status', 'en_attente')->count(),
            'validees'       => Order::where('status', 'validée')->count(),
            'en_cours'       => Order::where('status', 'en_cours')->count(),
            'livrees'        => Order::where('status', 'livré')->count(),
            'annulees'       => Order::where('status', 'annulée')->count(),
            'chiffre_affaires' => Order::where('status', 'livré')->sum('total_price'),

            // Produits les plus commandés
            'top_produits'   => OrderItem::selectRaw('product_id, SUM(quantity) as total_qty, SUM(subtotal) as total_revenue')
                                    ->with('product:id,name,category_id', 'product.category:id,name')
                                    ->groupBy('product_id')
                                    ->orderByDesc('total_qty')
                                    ->limit(10)
                                    ->get(),

            // Commandes par catégorie de produit
            'par_categorie'  => OrderItem::selectRaw('products.category_id, SUM(order_items.quantity) as total_qty')
                                    ->join('products', 'products.id', '=', 'order_items.product_id')
                                    ->with('product.category:id,name')
                                    ->groupBy('products.category_id')
                                    ->get(),
        ]);
    }
}
