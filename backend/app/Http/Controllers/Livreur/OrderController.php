<?php

namespace App\Http\Controllers\Livreur;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // GET /api/livreur/orders — liste des missions assignées
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with([
                'client:id,name,phone',
                'items.product:id,name,category_id',
                'items.product.category:id,name',
                'lastLocation',
            ])
            ->where('livreur_id', $request->user()->id)
            ->whereIn('status', ['validée', 'en_cours'])
            ->latest()
            ->paginate(20);

        return response()->json($orders);
    }

    // GET /api/livreur/orders/{order} — détail complet d'une mission
    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->livreur_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $order->load([
            'client:id,name,phone,email',
            'items.product.category',
            'statusHistory.changedBy:id,name,role',
            'lastLocation',
        ]);

        return response()->json($order);
    }

    // PUT /api/livreur/orders/{order}/start — démarrer la livraison
    public function start(Request $request, Order $order): JsonResponse
    {
        if ($order->livreur_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($order->status !== 'validée') {
            return response()->json(['message' => 'La commande doit être validée pour démarrer.'], 422);
        }

        $old = $order->status;
        $order->update(['status' => 'en_cours']);

        OrderStatusHistory::create([
            'order_id'   => $order->id,
            'changed_by' => $request->user()->id,
            'old_status' => $old,
            'new_status' => 'en_cours',
        ]);

        return response()->json(['message' => 'Livraison démarrée.', 'order' => $order]);
    }

    // PUT /api/livreur/orders/{order}/deliver — confirmer la livraison via OTP
    public function deliver(Request $request, Order $order): JsonResponse
    {
        if ($order->livreur_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($order->status !== 'en_cours') {
            return response()->json(['message' => 'La livraison doit être en cours pour être confirmée.'], 422);
        }

        $request->validate([
            'otp_code' => 'required|string|size:6',
        ]);

        if ($order->otp_code !== $request->otp_code) {
            return response()->json(['message' => 'Code OTP incorrect.'], 422);
        }

        $old = $order->status;
        $order->update([
            'status'       => 'livré',
            'delivered_at' => now(),
        ]);

        OrderStatusHistory::create([
            'order_id'   => $order->id,
            'changed_by' => $request->user()->id,
            'old_status' => $old,
            'new_status' => 'livré',
        ]);

        return response()->json(['message' => 'Livraison confirmée avec succès.']);
    }
}
