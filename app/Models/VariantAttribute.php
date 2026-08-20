<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{
    protected $fillable = ['product_id','name','sort_order'];
    public function values()  { return $this->hasMany(VariantValue::class)->orderBy('sort_order'); }
    public function product() { return $this->belongsTo(Product::class); }
}
