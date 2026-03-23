<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Table principale : niveau de stock actuel par produit ──────────────
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->unique()->constrained('products')->onDelete('cascade');
            $table->integer('quantity')->default(0);   // quantité disponible
            $table->integer('alert_threshold')->default(5); // alerte stock bas
            $table->timestamps();
        });

        // ── Historique des mouvements de stock ─────────────────────────────────
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // qui a fait le mouvement
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete(); // lié à une commande ?
            $table->enum('type', [
                'entrée',     // approvisionnement manuel
                'sortie',     // vente / commande
                'retour',     // retour produit
                'ajustement', // correction inventaire
            ]);
            $table->integer('quantity');  // positif = entrée, négatif = sortie
            $table->integer('stock_before');
            $table->integer('stock_after');
            $table->string('note', 255)->nullable();
            $table->timestamp('moved_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stocks');
    }
};
