<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /** Produits de cette catégorie */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /** Scope : catégories actives uniquement */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
