<?php

namespace App\Http\Controllers\Livreur;

use App\Events\LocationUpdated;
use App\Http\Controllers\Controller;
use App\Models\DeliveryLocation;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    // POST /api/livreur/orders/{order}/location
    public function update(Request $request, Order $order): JsonResponse
    {
        if ($order->livreur_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $data = $request->validate([
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'speed'     => 'nullable|numeric|min:0',
            'heading'   => 'nullable|numeric|between:0,360',
        ]);

        $location = DeliveryLocation::create([
            ...$data,
            'order_id'    => $order->id,
            'livreur_id'  => $request->user()->id,
            'recorded_at' => now(),
        ]);

        // Diffusion en temps réel via Laravel Echo
        broadcast(new LocationUpdated($order->id, $location))->toOthers();

        return response()->json($location, 201);
    }
}
