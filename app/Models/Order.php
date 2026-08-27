<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'order_number','tracking_token',
        'user_id','customer_name','customer_phone','customer_email',
        'customer_address','city','payment_method','payment_status','status',
        'return_status','notes','coupon_code','discount',
        'subtotal','shipping','total','payment_proof','tracking_history',
    ];

    protected $casts = ['tracking_history' => 'array'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            // Unique tracking token
            do { $token = strtoupper(Str::random(10)); }
            while (static::where('tracking_token', $token)->exists());
            $model->tracking_token = $token;

            // Unique order number: MLN-YYMMDD-XXXXX (never sequential)
            do { $number = 'MLN-' . date('ymd') . '-' . strtoupper(Str::random(5)); }
            while (static::where('order_number', $number)->exists());
            $model->order_number = $number;
        });
    }

    public function getDisplayNumberAttribute(): string
    {
        return $this->order_number
            ?? ('MLN-' . str_pad($this->id, 5, '0', STR_PAD_LEFT));
    }

    public function items()         { return $this->hasMany(OrderItem::class); }
    public function user()          { return $this->belongsTo(User::class); }
    public function returns()       { return $this->hasMany(OrderReturn::class); }
    public function statusHistory() { return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at'); }

    public function addStatusHistory(string $status, ?string $note = null, string $by = 'system'): void
    {
        OrderStatusHistory::create([
            'order_id'   => $this->id,
            'status'     => $status,
            'note'       => $note,
            'created_by' => $by,
        ]);
    }

    // ── Atomic stock reduction — MySQL row-level safe ────────────────
    public function reduceStock(): bool
    {
        $this->loadMissing('items');
        foreach ($this->items as $item) {
            if ($item->variant_id) {
                $updated = \App\Models\ProductVariant::where('id', $item->variant_id)
                    ->where('stock', '>=', $item->quantity)
                    ->update(['stock' => \Illuminate\Support\Facades\DB::raw("stock - {$item->quantity}")]);
            } else {
                $updated = \App\Models\Product::where('id', $item->product_id)
                    ->where('stock', '>=', $item->quantity)
                    ->update(['stock' => \Illuminate\Support\Facades\DB::raw("stock - {$item->quantity}")]);
            }
            if (!$updated) {
                \Illuminate\Support\Facades\Log::warning("Stock insufficient: order #{$this->id} product_id={$item->product_id}");
                return false;
            }
        }
        return true;
    }

    // ── Restore stock when order cancelled ───────────────────────────
    public function restoreStock(): void
    {
        $this->loadMissing('items');
        foreach ($this->items as $item) {
            if ($item->variant_id) {
                \App\Models\ProductVariant::where('id', $item->variant_id)
                    ->update(['stock' => \Illuminate\Support\Facades\DB::raw("stock + {$item->quantity}")]);
            } else {
                \App\Models\Product::where('id', $item->product_id)
                    ->update(['stock' => \Illuminate\Support\Facades\DB::raw("stock + {$item->quantity}")]);
            }
        }
    }

    // ── Check stock availability before placing order ────────────────
    public function hasStock(): bool
    {
        $this->loadMissing('items.product');
        foreach ($this->items as $item) {
            $stock = $item->variant_id
                ? (\App\Models\ProductVariant::where('id', $item->variant_id)->value('stock') ?? 0)
                : ($item->product->stock ?? 0);
            if ($stock < $item->quantity) return false;
        }
        return true;
    }
}
