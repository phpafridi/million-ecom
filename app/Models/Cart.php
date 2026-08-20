<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['session_id','user_id','product_id','quantity','options'];
    protected $casts = ['options' => 'array'];

    public function product() { return $this->belongsTo(Product::class)->with('productImages'); }

    public static function getItems(): \Illuminate\Database\Eloquent\Collection
    {
        $sid = session()->getId();
        return static::where('session_id', $sid)->with('product.category')->get();
    }

    public static function getCount(): int
    {
        return static::where('session_id', session()->getId())->sum('quantity');
    }

    public static function addItem(int $productId, int $qty = 1): void
    {
        $sid = session()->getId();
        $item = static::where('session_id', $sid)->where('product_id', $productId)->first();
        if ($item) {
            $item->increment('quantity', $qty);
        } else {
            static::create(['session_id' => $sid, 'product_id' => $productId, 'quantity' => $qty]);
        }
    }
}
