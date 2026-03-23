<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Notification;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // ── Liste des commandes
    public function index(Request $request)
    {
        $query = Order::with(['client:id,name,phone', 'livreur:id,name', 'items'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->whereHas('client', fn($q) => $q->where('name', 'like', '%' . $request->search . '%'));
        }

        $orders   = $query->paginate(20)->withQueryString();
        $livreurs = User::where('role', 'livreur')->where('is_active', true)->get(['id', 'name']);

        return view('admin.orders.index', compact('orders', 'livreurs'));
    }

    // ── Validation d'une commande
    public function validateOrder(Request $request, Order $order)
    {
        if ($order->status !== 'en_attente') {
            return back()->with('error', 'Commande non éligible.');
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $order->update([
            'status'   => 'validée',
            'otp_code' => $otp,
        ]);

        OrderStatusHistory::create([
            'order_id'   => $order->id,
            'changed_by' => Auth::id(),
            'old_status' => 'en_attente',
            'new_status' => 'validée',
            'comment'    => 'Validé via panel admin',
        ]);

        Notification::create([
            'user_id'  => $order->client_id,
            'order_id' => $order->id,
            'type'     => 'order_validated',
            'title'    => 'Commande validée',
            'message'  => "Votre commande #{$order->id} a été validée. Code OTP : {$otp}",
            'sent_at'  => now(),
        ]);

        return back()->with('success', "Commande #{$order->id} validée. OTP : {$otp}");
    }

    // ── Assignation d'un livreur
    public function assign(Request $request, Order $order)
    {
        $data = $request->validate([
            'livreur_id' => 'required|exists:users,id',
        ]);

        $livreur = User::findOrFail($data['livreur_id']);
        if ($livreur->role !== 'livreur' || !$livreur->is_active) {
            return back()->with('error', 'Livreur invalide.');
        }

        $order->update(['livreur_id' => $livreur->id]);

        Notification::create([
            'user_id'  => $order->client_id,
            'order_id' => $order->id,
            'type'     => 'livreur_assigned',
            'title'    => 'Livreur assigné',
            'message'  => "Un livreur ({$livreur->name}) a été assigné à votre commande.",
            'sent_at'  => now(),
        ]);

        return back()->with('success', "Livreur {$livreur->name} assigné.");
    }

    // ── Retrait d'un livreur
    public function unassign(Request $request, Order $order)
    {
        if ($order->status === 'en_cours') {
            return back()->with('error', 'Livraison en cours, impossible de retirer.');
        }

        if ($order->livreur_id) {
            Notification::create([
                'user_id'  => $order->livreur_id,
                'order_id' => $order->id,
                'type'     => 'mission_removed',
                'title'    => 'Mission retirée',
                'message'  => "La mission #{$order->id} vous a été retirée.",
                'sent_at'  => now(),
            ]);
        }

        $order->update(['livreur_id' => null]);

        return back()->with('success', 'Livreur retiré.');
    }
}
