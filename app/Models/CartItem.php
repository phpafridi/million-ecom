<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['session_id', 'product_id', 'quantity', 'price'];

    public function product() {
        return $this->belongsTo(Product::class)->with('productImages');
    }

    public function getSubtotalAttribute(): float {
        return $this->price * $this->quantity;
    }
}
