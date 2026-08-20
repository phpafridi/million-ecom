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
        // Full URL (http/https) - return as-is (Unsplash demo images)
        if (str_starts_with($this->path, 'http')) return $this->path;
        // Uploaded to uploads/ disk
        if (str_starts_with($this->path, 'products/')) return asset('uploads/' . $this->path);
        // Legacy storage path
        return asset('storage/' . $this->path);
    }
}
