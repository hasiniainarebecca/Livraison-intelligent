<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Stock;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'orders_total'    => Order::count(),
            'orders_pending'  => Order::where('status', 'en_attente')->count(),
            'orders_ongoing'  => Order::where('status', 'en_cours')->count(),
            'revenue'         => Order::where('status', 'livré')->sum('total_price'),
            'products'        => Product::count(),
            'low_stock'       => Stock::whereColumn('quantity', '<=', 'alert_threshold')->count(),
            'clients'         => User::where('role', 'client')->count(),
            'livreurs'        => User::where('role', 'livreur')->count(),
        ];
        $recent = Order::with(['client:id,name', 'items'])
            ->latest()->limit(10)->get();
        return view('admin.dashboard', compact('stats', 'recent'));
    }
}
