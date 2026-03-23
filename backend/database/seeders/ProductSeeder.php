<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $cats = DB::table('categories')->pluck('id', 'slug');

        $products = [
            // Technologie
            ['category' => 'technologie', 'name' => 'Smartphone Reconditionné', 'price' => 199.99, 'weight_kg' => 0.2,  'stock' => 50],
            ['category' => 'technologie', 'name' => 'Clavier mécanique',        'price' => 79.00,  'weight_kg' => 0.9,  'stock' => 30],
            ['category' => 'technologie', 'name' => 'Câble USB-C 2m',           'price' => 9.90,   'weight_kg' => 0.1,  'stock' => 200],
            ['category' => 'technologie', 'name' => 'Chargeur rapide 65W',      'price' => 34.99,  'weight_kg' => 0.2,  'stock' => 80],
            // Culinaire
            ['category' => 'culinaire',   'name' => 'Panier petit-déjeuner',    'price' => 25.00,  'weight_kg' => 1.5,  'stock' => 20],
            ['category' => 'culinaire',   'name' => 'Box repas gastronomique',  'price' => 49.00,  'weight_kg' => 2.0,  'stock' => 15],
            ['category' => 'culinaire',   'name' => 'Gâteau anniversaire',      'price' => 35.00,  'weight_kg' => 1.2,  'stock' => 10],
            // Médical
            ['category' => 'medical',     'name' => 'Boîte de masques FFP2',    'price' => 12.99,  'weight_kg' => 0.2,  'stock' => 500],
            ['category' => 'medical',     'name' => 'Tensiomètre numérique',    'price' => 39.90,  'weight_kg' => 0.4,  'stock' => 25],
            ['category' => 'medical',     'name' => 'Thermomètre infrarouge',   'price' => 24.50,  'weight_kg' => 0.1,  'stock' => 40],
            // Vêtements
            ['category' => 'vetements',   'name' => 'T-shirt coton bio (M)',    'price' => 19.90,  'weight_kg' => 0.2,  'stock' => 100],
            ['category' => 'vetements',   'name' => 'Veste imperméable',        'price' => 89.00,  'weight_kg' => 0.7,  'stock' => 35],
            // Documents
            ['category' => 'documents',   'name' => 'Enveloppe sécurisée A4',  'price' => 2.50,   'weight_kg' => 0.05, 'stock' => 999],
            ['category' => 'documents',   'name' => 'Tube de transport plans',  'price' => 5.00,   'weight_kg' => 0.1,  'stock' => 60],
            // Cosmétiques
            ['category' => 'cosmetiques', 'name' => 'Coffret parfum 50ml',     'price' => 59.00,  'weight_kg' => 0.3,  'stock' => 20],
            ['category' => 'cosmetiques', 'name' => 'Crème hydratante bio',    'price' => 18.50,  'weight_kg' => 0.15, 'stock' => 60],
            // Autre
            ['category' => 'autre',       'name' => 'Colis standard (<5kg)',   'price' => 5.00,   'weight_kg' => 1.0,  'stock' => 999],
            ['category' => 'autre',       'name' => 'Colis lourd (5-20kg)',    'price' => 15.00,  'weight_kg' => 10.0, 'stock' => 999],
        ];

        foreach ($products as $p) {
            $categoryId = $cats[$p['category']] ?? null;
            if (!$categoryId) continue;

            // Insérer le produit (sans champ stock)
            $productId = DB::table('products')->insertGetId([
                'category_id' => $categoryId,
                'name'        => $p['name'],
                'slug'        => Str::slug($p['name']) . '-' . uniqid(),
                'description' => null,
                'price'       => $p['price'],
                'weight_kg'   => $p['weight_kg'],
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            // Créer la fiche stock associée
            DB::table('stocks')->insert([
                'product_id'      => $productId,
                'quantity'        => $p['stock'],
                'alert_threshold' => max(5, (int) ($p['stock'] * 0.1)), // alerte à 10% du stock initial
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }
    }
}
