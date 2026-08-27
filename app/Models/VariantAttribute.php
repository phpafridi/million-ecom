<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{
    protected $fillable = ['product_id', 'name', 'display_type', 'is_required', 'sort_order'];

    protected $casts = ['is_required' => 'boolean'];

    public function values()  { return $this->hasMany(VariantValue::class)->orderBy('sort_order'); }
    public function product() { return $this->belongsTo(Product::class); }
}
