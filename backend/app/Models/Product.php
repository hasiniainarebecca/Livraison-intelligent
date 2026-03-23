<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'image',
        'price',
        'weight_kg',
        'is_active',
    ];

    protected $casts = [
        'price'     => 'float',
        'weight_kg' => 'float',
        'is_active' => 'boolean',
    ];

    // ─── Relations ────────────────────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** Fiche stock (1 par produit) */
    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }

    /** Mouvements de stock */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // ─── Helpers stock ────────────────────────────────────────────────────────

    /** Quantité disponible (0 si pas de fiche stock) */
    public function availableQty(): int
    {
        return $this->stock?->quantity ?? 0;
    }

    /** Vérifie si la quantité demandée est disponible */
    public function isInStock(int $qty = 1): bool
    {
        return $this->availableQty() >= $qty;
    }

    /**
     * Décrémente le stock via un mouvement traçable.
     * Appelé lors de la création d'une commande.
     */
    public function decrementStock(int $qty, int $userId, ?int $orderId = null): void
    {
        if ($this->stock) {
            $this->stock->applyMovement(-$qty, 'sortie', $userId, $orderId, 'Vente commande');
        }
    }

    /**
     * Remet le stock lors d'une annulation de commande.
     */
    public function restoreStock(int $qty, int $userId, ?int $orderId = null): void
    {
        if ($this->stock) {
            $this->stock->applyMovement($qty, 'retour', $userId, $orderId, 'Annulation commande');
        }
    }
}
