<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories — public
    public function index(): JsonResponse
    {
        $categories = Category::active()->orderBy('name')->get();
        return response()->json($categories);
    }

    // POST /api/admin/categories — admin seulement
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = \Illuminate\Support\Str::slug($data['name']);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:100|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active'   => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
        }

        $category->update($data);

        return response()->json($category);
    }

    // DELETE /api/admin/categories/{id}
    public function destroy(Category $category): JsonResponse
    {
        if ($category->orders()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une catégorie utilisée par des commandes.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée.']);
    }
}
