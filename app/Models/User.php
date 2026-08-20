<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone',
        'avatar', 'date_of_birth', 'gender', 'address', 'city',
        'loyalty_points', 'total_points_earned',
        'newsletter_subscribed', 'newsletter_subscribed_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at'          => 'datetime',
        'password'                   => 'hashed',
        'newsletter_subscribed'      => 'boolean',
        'newsletter_subscribed_at'   => 'datetime',
        'date_of_birth'              => 'date',
    ];

    // ── Relations ────────────────────────────────────────────────────
    public function orders()             { return $this->hasMany(Order::class); }
    public function wishlists()          { return $this->hasMany(Wishlist::class); }
    public function loyaltyTransactions(){ return $this->hasMany(LoyaltyTransaction::class); }
    public function addresses()          { return $this->hasMany(UserAddress::class); }

    // ── Helpers ──────────────────────────────────────────────────────
    public function isAdmin(): bool { return $this->role === 'admin'; }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) return asset('storage/' . $this->avatar);
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random&color=fff&size=128';
    }

    // ── Loyalty helpers ──────────────────────────────────────────────
    public function addPoints(int $points, string $description, ?int $orderId = null): void
    {
        $this->increment('loyalty_points', $points);
        $this->increment('total_points_earned', $points);
        LoyaltyTransaction::create([
            'user_id'     => $this->id,
            'order_id'    => $orderId,
            'type'        => 'earned',
            'points'      => $points,
            'description' => $description,
        ]);
    }

    public function redeemPoints(int $points, string $description, ?int $orderId = null): bool
    {
        if ($this->loyalty_points < $points) return false;
        $this->decrement('loyalty_points', $points);
        LoyaltyTransaction::create([
            'user_id'     => $this->id,
            'order_id'    => $orderId,
            'type'        => 'redeemed',
            'points'      => -$points,
            'description' => $description,
        ]);
        return true;
    }

    public function getPointsValueAttribute(): float
    {
        // 100 points = Rs 10
        return round($this->loyalty_points / 100 * 10, 2);
    }

    public function getLevelAttribute(): array
    {
        $earned = $this->total_points_earned;
        if ($earned >= 5000) return ['name' => 'Platinum', 'color' => '#8B5CF6', 'next' => null, 'progress' => 100];
        if ($earned >= 2000) return ['name' => 'Gold',     'color' => '#F59E0B', 'next' => 5000, 'progress' => round(($earned - 2000) / 30)];
        if ($earned >= 500)  return ['name' => 'Silver',   'color' => '#6B7280', 'next' => 2000, 'progress' => round(($earned - 500)  / 15)];
        return                      ['name' => 'Bronze',   'color' => '#CD7F32', 'next' => 500,  'progress' => round($earned / 5)];
    }
}
