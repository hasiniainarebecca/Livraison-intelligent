<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class OrderController extends Controller
{
    // GET /api/client/orders
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items.product.category', 'livreur', 'lastLocation'])
            ->where('client_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json($orders);
    }

    // POST /api/client/orders
    // Body: { type, pickup_address, delivery_address, notes?, items: [{product_id, quantity}], payment_intent_id }
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type'                => 'required|in:standard,express',
            'pickup_address'      => 'required|string|max:255',
            'delivery_address'    => 'required|string|max:255',
            'pickup_lat'          => 'nullable|numeric|between:-90,90',
            'pickup_lng'          => 'nullable|numeric|between:-180,180',
            'delivery_lat'        => 'nullable|numeric|between:-90,90',
            'delivery_lng'        => 'nullable|numeric|between:-180,180',
            'notes'               => 'nullable|string|max:500',
            'items'               => 'required|array|min:1',
            'items.*.product_id'  => 'required|exists:products,id',
            'items.*.quantity'    => 'required|integer|min:1|max:100',
            'payment_intent_id'   => 'required|string',
        ]);

        // ── Vérifier le paiement Stripe avant toute écriture ─────────────────
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $intent = PaymentIntent::retrieve($data['payment_intent_id']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Paiement invalide.'], 422);
        }

        if ($intent->status !== 'succeeded') {
            return response()->json(['message' => 'Le paiement n\'a pas été confirmé.'], 422);
        }

        // ── Créer la commande dans une transaction ────────────────────────────
        return DB::transaction(function () use ($data, $request, $intent) {
            $order = Order::create([
                'client_id'                => $request->user()->id,
                'type'                     => $data['type'],
                'status'                   => 'en_attente',
                'pickup_address'           => $data['pickup_address'],
                'delivery_address'         => $data['delivery_address'],
                'pickup_lat'               => $data['pickup_lat'] ?? null,
                'pickup_lng'               => $data['pickup_lng'] ?? null,
                'delivery_lat'             => $data['delivery_lat'] ?? null,
                'delivery_lng'             => $data['delivery_lng'] ?? null,
                'notes'                    => $data['notes'] ?? null,
                'total_price'              => 0,
                'payment_status'           => 'paid',
                'stripe_payment_intent_id' => $intent->id,
            ]);

            $total = 0;

            foreach ($data['items'] as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);

                if (!$product->is_active) {
                    throw new \Exception("Le produit « {$product->name} » n'est plus disponible.");
                }
                if (!$product->isInStock($itemData['quantity'])) {
                    throw new \Exception("Stock insuffisant pour « {$product->name} ».");
                }

                $subtotal = $product->price * $itemData['quantity'];

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'quantity'   => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'subtotal'   => $subtotal,
                ]);

                $product->decrementStock($itemData['quantity'], $request->user()->id, $order->id);
                $total += $subtotal;
            }

            $order->update(['total_price' => $total]);
            $order->load(['items.product.category', 'client']);

            return response()->json($order, 201);
        });
    }

    // GET /api/client/orders/{order}
    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $order->load(['items.product.category', 'livreur', 'lastLocation', 'statusHistory.changedBy']);

        return response()->json($order);
    }

    // PATCH /api/client/orders/{order}/cancel — Annuler une commande en attente
    public function cancel(Request $request, Order $order): JsonResponse
    {
        if ($order->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if ($order->status !== 'en_attente') {
            return response()->json([
                'message' => 'Seules les commandes en attente peuvent être annulées.',
            ], 422);
        }

        // Remettre le stock des produits via le modèle Stock
        foreach ($order->items as $item) {
            $item->product->restoreStock($item->quantity, $request->user()->id, $order->id);
        }

        $order->update(['status' => 'annulée']);

        return response()->json(['message' => 'Commande annulée.']);
    }
}
