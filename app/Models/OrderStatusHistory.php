<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    public $timestamps = false;
    protected $fillable = ['order_id','status','note','created_by'];
    protected $casts    = ['created_at' => 'datetime'];

    public function order() { return $this->belongsTo(Order::class); }
}
