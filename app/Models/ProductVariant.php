<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id','sku','price','compare_price','stock','image','is_active','sort_order'];
    protected $casts    = ['is_active'=>'boolean'];

    public function product()        { return $this->belongsTo(Product::class); }
    public function variantValues()  { return $this->belongsToMany(VariantValue::class, 'product_variant_values'); }

    public function getLabelAttribute(): string {
        return $this->variantValues->pluck('value')->join(' / ');
    }

    public function getEffectivePriceAttribute(): float {
        return $this->price ?? $this->product->price;
    }
}
