<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * POST /api/client/payment/create-intent
     * Crée un PaymentIntent Stripe et retourne le client_secret.
     */
    public function createIntent(Request $request): JsonResponse
    {
        $data = $request->validate([
            'amount' => 'required|integer|min:50', // montant en centimes (min 0.50€)
        ]);

        $intent = PaymentIntent::create([
            'amount'   => $data['amount'],
            'currency' => 'eur',
            'metadata' => [
                'user_id' => $request->user()->id,
            ],
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
        ]);
    }
}
