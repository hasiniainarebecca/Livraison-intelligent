<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Catégories
        $this->call(CategorySeeder::class);

        // 2. Produits (dépend des catégories)
        $this->call(ProductSeeder::class);

        // 3. Utilisateurs de démonstration
        User::create([
            'name'     => 'Admin Principal',
            'email'    => 'admin@porte-ouverte.mg',
            'password' => 'password',
            'role'     => 'admin',
            'phone'    => '+261 34 00 00 001',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Rakoto Livreur',
            'email'    => 'livreur@porte-ouverte.mg',
            'password' => 'password',
            'role'     => 'livreur',
            'phone'    => '+261 32 00 00 002',
            'is_active' => true,
        ]);

        User::create([
            'name'     => 'Rabe Client',
            'email'    => 'client@porte-ouverte.mg',
            'password' => 'password',
            'role'     => 'client',
            'phone'    => '+261 33 00 00 003',
            'is_active' => true,
        ]);
    }
}
