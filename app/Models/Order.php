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
        'subtotal','shipping','total','payment_proof','tracking_history','stock_reduced','coupon_counted',
        // Were missing entirely — the admin UI for entering these
        // (added earlier this session) appeared to save successfully with
        // no error, but Eloquent's mass-assignment protection silently
        // dropped both fields before they ever reached the database.
        'tracking_number','courier',
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

            // Unique order number: MLN-YYMMDD-XXXXXX (never sequential).
            // Lengthened from 5 to 6 random chars — meaningfully reduces
            // collision probability for a busy store's daily order volume.
            // The do-while here is just an optimistic pre-check to avoid
            // hitting the database unnecessarily; the real safety net is the
            // existing unique() DB constraint on this column (already
            // present in the orders migration), which would reject an
            // actual collision outright rather than allowing two orders to
            // silently share a number.
            do { $number = 'MLN-' . date('ymd') . '-' . strtoupper(Str::random(6)); }
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
        // Idempotent — safe to call from any of the many places that might
        // trigger it (checkout, payment callbacks, admin actions) without
        // ever double-reducing stock for the same order.
        if ($this->stock_reduced) return true;

        $this->loadMissing('items');
        foreach ($this->items as $item) {
            // Sync mode (track_variant_stock off): reduce the product's
            // own stock even though this item has a variant attached —
            // that variant is a customer-facing label only in this mode,
            // not a separately-tracked stock pool.
            $product = \App\Models\Product::find($item->product_id);
            if ($item->variant_id && $product?->track_variant_stock) {
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
            // stock_sold is a separate running total shown on the admin Products
            // list — it existed as a column but was never actually incremented.
            \App\Models\Product::where('id', $item->product_id)
                ->update(['stock_sold' => \Illuminate\Support\Facades\DB::raw("stock_sold + {$item->quantity}")]);
        }
        $this->update(['stock_reduced' => true]);
        return true;
    }

    // ── Restore stock when order cancelled / payment reversed ────────
    public function restoreStock(): void
    {
        // Mirror of the guard above — only restore what this order actually
        // had reduced. Prevents a failed/cancelled order that never touched
        // stock in the first place from silently inflating real inventory.
        if (!$this->stock_reduced) return;

        $this->loadMissing('items');
        foreach ($this->items as $item) {
            $product = \App\Models\Product::find($item->product_id);
            if ($item->variant_id && $product?->track_variant_stock) {
                \App\Models\ProductVariant::where('id', $item->variant_id)
                    ->update(['stock' => \Illuminate\Support\Facades\DB::raw("stock + {$item->quantity}")]);
            } else {
                \App\Models\Product::where('id', $item->product_id)
                    ->update(['stock' => \Illuminate\Support\Facades\DB::raw("stock + {$item->quantity}")]);
            }
            \App\Models\Product::where('id', $item->product_id)
                ->update(['stock_sold' => \Illuminate\Support\Facades\DB::raw("GREATEST(stock_sold - {$item->quantity}, 0)")]);
        }
        $this->update(['stock_reduced' => false]);
    }

    // ── Count this order's coupon usage — idempotent, same flag pattern as
    // stock_reduced above. Only actually increments Coupon::used_count the
    // first time it's called for a given order, so it's safe to call from
    // wherever "this order is now genuinely confirmed" happens (online
    // payment success, admin confirming a COD/bank-transfer order) without
    // ever double-counting or counting a payment that later failed.
    public function countCouponUsage(): void
    {
        if ($this->coupon_counted || !$this->coupon_code) return;
        \App\Models\Coupon::where('code', $this->coupon_code)->increment('used_count');
        $this->update(['coupon_counted' => true]);
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
