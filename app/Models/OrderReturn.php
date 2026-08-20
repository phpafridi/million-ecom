<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OrderReturn extends Model
{
    protected $fillable = [
        'order_id','order_item_id','quantity','reason','notes',
        'status','refund_method','refund_amount','restock',
        'processed_by','processed_at'
    ];
    protected $casts = ['restock'=>'boolean','processed_at'=>'datetime'];

    public function order()      { return $this->belongsTo(Order::class); }
    public function orderItem()  { return $this->belongsTo(OrderItem::class); }
    public function processor()  { return $this->belongsTo(User::class, 'processed_by'); }
}
