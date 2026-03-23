<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'client_id',
        'livreur_id',
        'type',
        'status',
        'pickup_address',
        'delivery_address',
        'pickup_lat',
        'pickup_lng',
        'delivery_lat',
        'delivery_lng',
        'notes',
        'total_price',
        'otp_code',
        'estimated_at',
        'delivered_at',
        'payment_status',
        'stripe_payment_intent_id',
    ];

    protected $casts = [
        'pickup_lat'    => 'float',
        'pickup_lng'    => 'float',
        'delivery_lat'  => 'float',
        'delivery_lng'  => 'float',
        'total_price'   => 'float',
        'estimated_at'  => 'datetime',
        'delivered_at'  => 'datetime',
    ];

    // ─── Relations ───────────────────────────────────────────────────────────

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function livreur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'livreur_id');
    }

    /** Lignes de commande (produits + quantités) */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function deliveryLocations(): HasMany
    {
        return $this->hasMany(DeliveryLocation::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    /** Dernière position GPS connue du livreur */
    public function lastLocation(): HasOne
    {
        return $this->hasOne(DeliveryLocation::class)->latestOfMany('recorded_at');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeEnAttente($query) { return $query->where('status', 'en_attente'); }
    public function scopeEnCours($query)   { return $query->where('status', 'en_cours'); }
    public function scopeLivre($query)     { return $query->where('status', 'livré'); }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /** Recalcule total_price depuis les lignes */
    public function recalculateTotal(): void
    {
        $this->update(['total_price' => $this->items()->sum('subtotal')]);
    }
}
