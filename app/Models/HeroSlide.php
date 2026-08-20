<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'title','subtitle','description','cta_text','cta_url',
        'discount_pct','price','compare_price','image_path','sort_order','is_active'
    ];
    protected $casts   = ['is_active' => 'boolean'];
    protected $appends = ['image'];

    public function getImageAttribute(): ?string
    {
        if (!$this->image_path) return null;
        if (str_starts_with($this->image_path, 'http')) return $this->image_path;
        return asset('uploads/' . $this->image_path);
    }

    public function scopeActive($q) { return $q->where('is_active', true)->orderBy('sort_order'); }
}
