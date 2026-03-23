<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('livreur_id')->constrained('users')->onDelete('cascade');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->float('speed')->nullable();    // Vitesse en km/h
            $table->float('heading')->nullable();  // Direction en degrés
            $table->timestamp('recorded_at');
            // Pas de timestamps() car recorded_at remplace created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_locations');
    }
};
