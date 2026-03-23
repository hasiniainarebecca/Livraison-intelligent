<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stock extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
        'alert_threshold',
    ];

    protected $casts = [
        'quantity'        => 'integer',
        'alert_threshold' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'product_id', 'product_id');
    }

    public function isLow(): bool
    {
        return $this->quantity <= $this->alert_threshold;
    }

    public function isAvailable(int $qty = 1): bool
    {
        return $this->quantity >= $qty;
    }

    /**
     * Applique un mouvement de stock et enregistre l'historique.
     */
    public function applyMovement(
        int    $qty,
        string $type,
        int    $userId,
        ?int   $orderId = null,
        ?string $note   = null
    ): StockMovement {
        $before = $this->quantity;
        $after  = $before + $qty; // qty négatif = sortie

        $this->update(['quantity' => $after]);

        return StockMovement::create([
            'product_id'   => $this->product_id,
            'user_id'      => $userId,
            'order_id'     => $orderId,
            'type'         => $type,
            'quantity'     => $qty,
            'stock_before' => $before,
            'stock_after'  => $after,
            'note'         => $note,
        ]);
    }
}
