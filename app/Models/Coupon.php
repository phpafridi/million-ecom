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
