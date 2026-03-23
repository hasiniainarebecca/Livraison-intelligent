<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // GET /api/admin/products
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->filled('is_active')) {
            $query->where('is_active', (bool) $request->is_active);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->latest()->paginate(20));
    }

    // POST /api/admin/products
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:150',
            'description' => 'nullable|string',
            'image'       => 'nullable|string|max:255',
            'price'       => 'required|numeric|min:0',
            'weight_kg'   => 'nullable|numeric|min:0',
            'stock'       => 'nullable|integer|min:0',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();

        $product = Product::create($data);
        $product->load('category');

        return response()->json($product, 201);
    }

    // GET /api/admin/products/{product}
    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load('category'));
    }

    // PUT /api/admin/products/{product}
    public function update(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name'        => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'image'       => 'nullable|string|max:255',
            'price'       => 'sometimes|numeric|min:0',
            'weight_kg'   => 'nullable|numeric|min:0',
            'stock'       => 'nullable|integer|min:0',
            'is_active'   => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . $product->id;
        }

        $product->update($data);

        return response()->json($product->load('category'));
    }

    // DELETE /api/admin/products/{product}
    public function destroy(Product $product): JsonResponse
    {
        if ($product->orderItems()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer : ce produit est lié à des commandes existantes.',
            ], 422);
        }

        $product->delete();

        return response()->json(['message' => 'Produit supprimé.']);
    }

    // PATCH /api/admin/products/{product}/toggle
    public function toggle(Product $product): JsonResponse
    {
        $product->update(['is_active' => !$product->is_active]);

        return response()->json([
            'message'   => $product->is_active ? 'Produit activé.' : 'Produit désactivé.',
            'is_active' => $product->is_active,
        ]);
    }
}
