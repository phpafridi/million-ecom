<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class VariantValue extends Model
{
    protected $fillable = ['variant_attribute_id','value','color_hex','sort_order'];
    public function attribute() { return $this->belongsTo(VariantAttribute::class, 'variant_attribute_id'); }
    public function variants()  { return $this->belongsToMany(ProductVariant::class, 'product_variant_values'); }
}
