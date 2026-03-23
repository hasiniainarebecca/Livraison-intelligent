<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->string('name', 150);
            $table->string('slug', 160)->unique();
            $table->text('description')->nullable();
            $table->string('image', 255)->nullable();       // chemin ou URL de l'image
            $table->decimal('price', 10, 2);                // prix unitaire HT
            $table->decimal('weight_kg', 8, 3)->default(0); // poids en kg (pour calcul livraison)
            // Pas de champ stock ici — géré dans la table `stocks` dédiée
            $table->boolean('is_active')->default(true);

            $table->index('category_id');
            $table->index('is_active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
