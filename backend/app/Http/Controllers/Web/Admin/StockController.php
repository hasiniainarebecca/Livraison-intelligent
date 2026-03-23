<?php
namespace App\Http\Controllers\Web\Admin;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    public function index(Request $request) {
        $query = Stock::with(['product.category'])->orderBy('quantity');
        if ($request->boolean('low_stock')) $query->whereColumn('quantity', '<=', 'alert_threshold');
        $stocks = $query->paginate(30)->withQueryString();
        return view('admin.stocks.index', compact('stocks'));
    }
    public function add(Request $request, Product $product) {
        $data = $request->validate(['quantity' => 'required|integer|min:1', 'note' => 'nullable|string|max:255']);
        $stock = Stock::firstOrCreate(['product_id' => $product->id], ['quantity' => 0, 'alert_threshold' => 5]);
        $stock->applyMovement($data['quantity'], 'entrée', Auth::id(), null, $data['note'] ?? 'Approvisionnement (panel)');
        return back()->with('success', "{$data['quantity']} unités ajoutées.");
    }
    public function remove(Request $request, Product $product) {
        $data = $request->validate(['quantity' => 'required|integer|min:1', 'note' => 'nullable|string|max:255']);
        $stock = $product->stock;
        if (!$stock || $stock->quantity < $data['quantity']) return back()->with('error', 'Stock insuffisant.');
        $stock->applyMovement(-$data['quantity'], 'sortie', Auth::id(), null, $data['note'] ?? 'Sortie (panel)');
        return back()->with('success', "{$data['quantity']} unités retirées.");
    }
    public function adjust(Request $request, Product $product) {
        $data = $request->validate(['new_quantity' => 'required|integer|min:0', 'alert_threshold' => 'nullable|integer|min:0', 'note' => 'nullable|string|max:255']);
        $stock = Stock::firstOrCreate(['product_id' => $product->id], ['quantity' => 0, 'alert_threshold' => 5]);
        $diff = $data['new_quantity'] - $stock->quantity;
        $stock->applyMovement($diff, 'ajustement', Auth::id(), null, $data['note'] ?? 'Ajustement (panel)');
        if (isset($data['alert_threshold'])) $stock->update(['alert_threshold' => $data['alert_threshold']]);
        return back()->with('success', "Stock ajusté à {$data['new_quantity']} unités.");
    }
}
