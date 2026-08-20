<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'tracking_token',
        'user_id','customer_name','customer_phone','customer_email',
        'customer_address','city','payment_method','payment_status','status',
        'return_status','notes','coupon_code','discount',
        'subtotal','shipping','total','payment_proof','tracking_history',
    ];

    protected $casts = [
        'tracking_history' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            // Auto-generate unique tracking token
            do {
                $token = strtoupper(Str::random(10));
            } while (static::where('tracking_token', $token)->exists());
            $model->tracking_token = $token;
        });
    }

    // ── Relations ────────────────────────────────────────────────────
    public function items()         { return $this->hasMany(OrderItem::class); }
    public function user()          { return $this->belongsTo(User::class); }
    public function returns()       { return $this->hasMany(OrderReturn::class); }
    public function statusHistory() { return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at'); }

    // ── Helpers ──────────────────────────────────────────────────────
    public function addStatusHistory(string $status, ?string $note = null, string $by = 'system'): void
    {
        OrderStatusHistory::create([
            'order_id'   => $this->id,
            'status'     => $status,
            'note'       => $note,
            'created_by' => $by,
        ]);
    }

    public function reduceStock(): void
    {
        foreach ($this->items as $item) {
            if ($item->product) {
                $item->product->decrement('stock', $item->quantity);
                $item->product->increment('stock_sold', $item->quantity);
            }
        }
    }

    public function restoreStock(): void
    {
        foreach ($this->items as $item) {
            if ($item->product) {
                $item->product->increment('stock', $item->quantity);
                $item->product->decrement('stock_sold', max(0, $item->quantity));
            }
        }
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending'    => 'Order Placed',
            'processing' => 'Processing',
            'shipped'    => 'Shipped',
            'delivered'  => 'Delivered',
            'cancelled'  => 'Cancelled',
            default      => ucfirst($this->status),
        };
    }

    public function getStatusStepAttribute(): int
    {
        return match($this->status) {
            'pending'    => 1,
            'processing' => 2,
            'shipped'    => 3,
            'delivered'  => 4,
            default      => 0,
        };
    }
}
