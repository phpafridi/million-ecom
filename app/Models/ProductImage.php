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

        // Already a full URL — but replace localhost with actual app URL if different
        if (str_starts_with($this->path, 'http')) {
            $appUrl = rtrim(config('app.url'), '/');
            // If stored with localhost but now on real domain, rewrite
            if (str_contains($this->path, '://localhost') && !str_contains($appUrl, 'localhost')) {
                return preg_replace('#https?://localhost(/millionaire)?/public#', $appUrl, $this->path);
            }
            return $this->path;
        }

        // Relative path — build URL
        if (str_starts_with($this->path, 'products/')) return rtrim(config('app.url'),'/') . '/uploads/' . $this->path;
        if (str_starts_with($this->path, '/uploads/'))  return rtrim(config('app.url'),'/') . $this->path;
        return asset('storage/' . $this->path);
    }
}
