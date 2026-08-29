<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OrderReturn extends Model
{
    protected $fillable = [
        'return_number','order_id','order_item_id','quantity','reason','notes',
        'status','refund_method','refund_amount','restock',
        'processed_by','processed_at','approved_at','refunded_at','admin_notes'
    ];
    protected $casts = ['restock'=>'boolean','processed_at'=>'datetime','approved_at'=>'datetime','refunded_at'=>'datetime'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->return_number)) {
                do { $number = 'RET-' . date('ymd') . '-' . strtoupper(Str::random(5)); }
                while (static::where('return_number', $number)->exists());
                $model->return_number = $number;
            }
        });
    }

    public function order()      { return $this->belongsTo(Order::class); }
    public function orderItem()  { return $this->belongsTo(OrderItem::class); }
    public function processor()  { return $this->belongsTo(User::class, 'processed_by'); }
}
