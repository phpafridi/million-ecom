<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    // variant_label was missing from fillable — meaning even though
    // checkout code explicitly tried to save it on every order item,
    // Eloquent's mass-assignment protection silently dropped it every
    // single time. The column existed; nothing was ever actually stored
    // in it. This is the real root cause of variant/size/color details
    // never appearing anywhere on the bill.
    protected $fillable = ['order_id','product_id','product_name','variant_label','price','quantity','subtotal'];
    public function product() { return $this->belongsTo(Product::class); }
}
