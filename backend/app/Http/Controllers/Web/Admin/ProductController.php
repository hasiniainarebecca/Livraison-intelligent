<?php
namespace App\Http\Controllers\Web\Admin;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request) {
        $query = Product::with(['category', 'stock'])->latest();
        if ($request->filled('category_id')) $query->where('category_id', $request->category_id);
        if ($request->filled('search'))      $query->where('name', 'like', '%'.$request->search.'%');
        $products   = $query->paginate(20)->withQueryString();
        $categories = Category::orderBy('name')->get();
        return view('admin.products.index', compact('products', 'categories'));
    }
    public function create() {
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        return view('admin.products.form', ['product' => null, 'categories' => $categories]);
    }
    public function store(Request $request) {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'weight_kg'   => 'required|numeric|min:0',
            'is_active'   => 'boolean',
        ]);
        $data['slug']      = Str::slug($data['name']) . '-' . uniqid();
        $data['is_active'] = $request->boolean('is_active', true);
        $product = Product::create($data);
        // Créer la fiche stock si elle n'existe pas
        $product->stock()->firstOrCreate(['product_id' => $product->id], ['quantity' => 0, 'alert_threshold' => 5]);
        return redirect()->route('panel.products.index')->with('success', 'Produit créé.');
    }
    public function edit(Product $product) {
        $categories = Category::orderBy('name')->get();
        return view('admin.products.form', compact('product', 'categories'));
    }
    public function update(Request $request, Product $product) {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'weight_kg'   => 'required|numeric|min:0',
            'is_active'   => 'boolean',
        ]);
        $data['is_active'] = $request->boolean('is_active', true);
        if ($data['name'] !== $product->name) {
            $data['slug'] = Str::slug($data['name']) . '-' . $product->id;
        }
        $product->update($data);
        return redirect()->route('panel.products.index')->with('success', 'Produit mis à jour.');
    }
    public function destroy(Product $product) {
        if ($product->orderItems()->count() > 0) {
            return back()->with('error', 'Impossible : ce produit est lié à des commandes.');
        }
        $product->delete();
        return redirect()->route('panel.products.index')->with('success', 'Produit supprimé.');
    }
    public function toggle(Product $product) {
        $product->update(['is_active' => !$product->is_active]);
        return back()->with('success', 'Statut du produit modifié.');
    }
}
