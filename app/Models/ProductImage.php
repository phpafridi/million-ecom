<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = ['product_id', 'path', 'sort_order'];

    public function product() { return $this->belongsTo(Product::class); }

    public function getUrlAttribute(): string
    {
        if (!$this->path) return '/images/placeholder.jpg';
        if (str_starts_with($this->path, 'http')) return $this->path; // legacy rows with domain baked in
        if (str_starts_with($this->path, '/'))     return $this->path; // current format — portable
        if (str_starts_with($this->path, 'products/')) return '/uploads/' . $this->path; // old bare-relative
        return asset('storage/' . $this->path);
    }
}
