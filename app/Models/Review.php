<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['product_id','order_id','user_id','name','email','ip_address','rating','title','body','is_approved'];
    protected $casts    = ['is_approved'=>'boolean'];
    protected $appends  = ['verified_purchase'];

    public function product() { return $this->belongsTo(Product::class); }
    public function order()   { return $this->belongsTo(Order::class); }
    // ProductController::show() eager-loads 'approvedReviews.user', but this
    // relationship never existed at all — the moment a product had even one
    // approved review, that eager-load would throw "Call to undefined
    // relationship [user] on model [Review]" and crash the whole page. This
    // predates this session's changes; just never surfaced until a product
    // actually had an approved review to trigger the eager-load.
    public function user()    { return $this->belongsTo(User::class); }
    public function scopeApproved($q) { return $q->where('is_approved', true); }

    // Derived from order_id being set (an actual matching delivered order
    // was found at review time) rather than a separate boolean flag — can't
    // go stale independently of the order link it's based on.
    public function getVerifiedPurchaseAttribute(): bool
    {
        return $this->order_id !== null;
    }
}
