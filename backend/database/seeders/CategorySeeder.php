<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Technologie',   'icon' => 'cpu',        'color' => '#3B82F6'],
            ['name' => 'Culinaire',     'icon' => 'utensils',   'color' => '#F97316'],
            ['name' => 'Médical',       'icon' => 'heart-pulse', 'color' => '#EF4444'],
            ['name' => 'Vêtements',     'icon' => 'shirt',      'color' => '#8B5CF6'],
            ['name' => 'Documents',     'icon' => 'file-text',  'color' => '#6B7280'],
            ['name' => 'Mobilier',      'icon' => 'sofa',       'color' => '#92400E'],
            ['name' => 'Cosmétiques',   'icon' => 'sparkles',   'color' => '#EC4899'],
            ['name' => 'Autre',         'icon' => 'package',    'color' => '#14B8A6'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->insert([
                'name'        => $cat['name'],
                'slug'        => Str::slug($cat['name']),
                'description' => null,
                'icon'        => $cat['icon'],
                'color'       => $cat['color'],
                'is_active'   => true,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}
