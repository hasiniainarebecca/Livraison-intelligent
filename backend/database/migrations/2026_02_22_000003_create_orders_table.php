<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('livreur_id')->nullable()->constrained('users')->nullOnDelete();
            // Pas de category_id ici : la catégorie appartient aux produits (order_items)
            $table->enum('type', ['standard', 'express'])->default('standard');
            $table->enum('status', [
                'en_attente',  // client vient de créer
                'validée',     // admin a validé
                'en_cours',    // livreur a démarré
                'livré',       // livraison confirmée OTP
                'annulée',     // annulée par client ou admin
            ])->default('en_attente');
            $table->string('pickup_address', 255);
            $table->string('delivery_address', 255);
            $table->decimal('pickup_lat', 10, 8)->nullable();
            $table->decimal('pickup_lng', 11, 8)->nullable();
            $table->decimal('delivery_lat', 10, 8)->nullable();
            $table->decimal('delivery_lng', 11, 8)->nullable();
            $table->text('notes')->nullable();                   // note optionnelle du client
            $table->decimal('total_price', 10, 2)->default(0);  // calculé depuis order_items
            $table->string('otp_code', 6)->nullable();
            $table->timestamp('estimated_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            // Paiement Stripe
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('stripe_payment_intent_id')->nullable();

            $table->index('status');
            $table->index('client_id');
            $table->index('livreur_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
