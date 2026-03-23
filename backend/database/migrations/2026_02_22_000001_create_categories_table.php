<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);            // ex: Technologie, Culinaire, Médical
            $table->string('slug', 120)->unique();  // ex: technologie, culinaire
            $table->text('description')->nullable();
            $table->string('icon', 50)->nullable(); // nom d'icône (ex: lucide-icon)
            $table->string('color', 7)->nullable();  // couleur hex (ex: #FF5733)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
