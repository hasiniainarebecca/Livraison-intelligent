<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active'         => 'boolean',
        'password'          => 'hashed',
    ];

    // Relations
    public function ordersAsClient(): HasMany
    {
        return $this->hasMany(Order::class, 'client_id');
    }

    public function ordersAsLivreur(): HasMany
    {
        return $this->hasMany(Order::class, 'livreur_id');
    }

    public function deliveryLocations(): HasMany
    {
        return $this->hasMany(DeliveryLocation::class, 'livreur_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function statusChanges(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class, 'changed_by');
    }

    // Helpers de rôle
    public function isAdmin(): bool    { return $this->role === 'admin'; }
    public function isLivreur(): bool  { return $this->role === 'livreur'; }
    public function isClient(): bool   { return $this->role === 'client'; }
}
