<?php
namespace App\Http\Controllers\Web\Admin;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index() {
        $categories = Category::withCount('products')->orderBy('name')->get();
        return view('admin.categories.index', compact('categories'));
    }
    public function create() { return view('admin.categories.form', ['category' => null]); }
    public function store(Request $request) {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'icon'        => 'nullable|string|max:10',
            'color'       => 'nullable|string|max:7',
            'is_active'   => 'boolean',
        ]);
        $data['slug']      = Str::slug($data['name']) . '-' . uniqid();
        $data['is_active'] = $request->boolean('is_active', true);
        Category::create($data);
        return redirect()->route('panel.categories.index')->with('success', 'Catégorie créée.');
    }
    public function edit(Category $category) { return view('admin.categories.form', compact('category')); }
    public function update(Request $request, Category $category) {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'icon'        => 'nullable|string|max:10',
            'color'       => 'nullable|string|max:7',
            'is_active'   => 'boolean',
        ]);
        $data['is_active'] = $request->boolean('is_active', true);
        $category->update($data);
        return redirect()->route('panel.categories.index')->with('success', 'Catégorie mise à jour.');
    }
    public function destroy(Category $category) {
        if ($category->products()->count() > 0) {
            return back()->with('error', 'Impossible : cette catégorie contient des produits.');
        }
        $category->delete();
        return redirect()->route('panel.categories.index')->with('success', 'Catégorie supprimée.');
    }
}
