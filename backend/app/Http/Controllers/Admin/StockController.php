<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    // GET /api/admin/stocks — liste de tous les stocks
    public function index(Request $request): JsonResponse
    {
        $query = Stock::with(['product:id,name,category_id,is_active', 'product.category:id,name'])
            ->orderBy('quantity');

        // Filtrer les produits en stock bas
        if ($request->boolean('low_stock')) {
            $query->whereColumn('quantity', '<=', 'alert_threshold');
        }

        if ($request->filled('category_id')) {
            $query->whereHas('product', fn($q) => $q->where('category_id', $request->category_id));
        }

        return response()->json($query->paginate(30));
    }

    // GET /api/admin/stocks/{product} — stock d'un produit spécifique
    public function show(Product $product): JsonResponse
    {
        $stock = $product->stock ?? Stock::firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => 0, 'alert_threshold' => 5]
        );

        $stock->load('movements' . '.user:id,name');

        return response()->json([
            'product' => $product->only(['id', 'name', 'category_id']),
            'stock'   => $stock,
        ]);
    }

    // POST /api/admin/stocks/{product}/add — approvisionnement (entrée)
    public function add(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
            'note'     => 'nullable|string|max:255',
        ]);

        $stock = Stock::firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => 0, 'alert_threshold' => 5]
        );

        $movement = $stock->applyMovement(
            $data['quantity'],
            'entrée',
            $request->user()->id,
            null,
            $data['note'] ?? 'Approvisionnement'
        );

        return response()->json([
            'message'         => "{$data['quantity']} unités ajoutées.",
            'stock_actuel'    => $stock->fresh()->quantity,
            'movement'        => $movement,
        ], 201);
    }

    // POST /api/admin/stocks/{product}/remove — sortie manuelle
    public function remove(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
            'note'     => 'nullable|string|max:255',
        ]);

        $stock = $product->stock;
        if (!$stock || $stock->quantity < $data['quantity']) {
            return response()->json(['message' => 'Stock insuffisant.'], 422);
        }

        $movement = $stock->applyMovement(
            -$data['quantity'],
            'sortie',
            $request->user()->id,
            null,
            $data['note'] ?? 'Sortie manuelle'
        );

        return response()->json([
            'message'      => "{$data['quantity']} unités retirées.",
            'stock_actuel' => $stock->fresh()->quantity,
            'movement'     => $movement,
        ]);
    }

    // POST /api/admin/stocks/{product}/adjust — ajustement / correction inventaire
    public function adjust(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'new_quantity'    => 'required|integer|min:0',
            'alert_threshold' => 'nullable|integer|min:0',
            'note'            => 'nullable|string|max:255',
        ]);

        $stock = Stock::firstOrCreate(
            ['product_id' => $product->id],
            ['quantity' => 0, 'alert_threshold' => 5]
        );

        $diff = $data['new_quantity'] - $stock->quantity;

        $movement = $stock->applyMovement(
            $diff,
            'ajustement',
            $request->user()->id,
            null,
            $data['note'] ?? 'Ajustement inventaire'
        );

        if (isset($data['alert_threshold'])) {
            $stock->update(['alert_threshold' => $data['alert_threshold']]);
        }

        return response()->json([
            'message'      => "Stock ajusté à {$data['new_quantity']} unités.",
            'stock_actuel' => $stock->fresh()->quantity,
            'movement'     => $movement,
        ]);
    }

    // GET /api/admin/stocks/movements — historique global des mouvements
    public function movements(Request $request): JsonResponse
    {
        $query = StockMovement::with([
            'product:id,name',
            'user:id,name',
            'order:id,status',
        ]);

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json(
            $query->orderByDesc('moved_at')->paginate(30)
        );
    }

    // GET /api/admin/stocks/alerts — produits en stock bas
    public function alerts(): JsonResponse
    {
        $lowStock = Stock::with(['product:id,name,category_id,is_active', 'product.category:id,name'])
            ->whereColumn('quantity', '<=', 'alert_threshold')
            ->where('quantity', '>=', 0)
            ->orderBy('quantity')
            ->get();

        return response()->json([
            'count'    => $lowStock->count(),
            'products' => $lowStock,
        ]);
    }
}
