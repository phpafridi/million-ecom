<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = ['code','type','value','min_order','max_discount','usage_limit','used_count','per_user_limit','is_active','expires_at','description'];
    protected $casts    = ['is_active'=>'boolean','expires_at'=>'datetime'];

    public function scopeActive($q) { return $q->where('is_active', true); }

    public function isValid(): bool {
        if (!$this->is_active) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) return false;
        return true;
    }

    // How many times this coupon has already been used by a given customer —
    // matched by user_id when logged in, falling back to email for guest
    // checkouts. Only counts orders that weren't cancelled.
    public function timesUsedBy(?int $userId, ?string $email): int
    {
        if (!$userId && !$email) return 0;
        return \App\Models\Order::where('coupon_code', $this->code)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($userId, $email) {
                if ($userId) $q->where('user_id', $userId);
                if ($userId && $email) $q->orWhere('customer_email', $email);
                if (!$userId && $email) $q->where('customer_email', $email);
            })
            ->count();
    }

    public function reachedPerUserLimit(?int $userId, ?string $email): bool
    {
        if (!$this->per_user_limit) return false;
        return $this->timesUsedBy($userId, $email) >= $this->per_user_limit;
    }

    public function calculateDiscount(float $subtotal): float {
        if ($subtotal < $this->min_order) return 0;
        $discount = match($this->type) {
            'percentage'   => $subtotal * ($this->value / 100),
            'fixed'        => $this->value,
            'free_shipping'=> 0,
            default        => 0,
        };
        if ($this->max_discount) $discount = min($discount, $this->max_discount);
        return round($discount, 2);
    }
}
