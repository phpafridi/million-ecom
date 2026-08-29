<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name','slug','description','type','image','mobile_image',
        'banner_image','mobile_banner_image','icon','color',
        'parent_id','sort_order','nav_order','is_active','show_in_nav',
    ];

    protected $casts = ['is_active' => 'boolean', 'show_in_nav' => 'boolean'];

    public function parent(): BelongsTo { return $this->belongsTo(Category::class, 'parent_id'); }
    public function children(): HasMany { return $this->hasMany(Category::class, 'parent_id'); }
    public function products(): HasMany { return $this->hasMany(Product::class); }

    public function scopeActive($q) { return $q->where('is_active', true); }
    public function scopeNavVisible($q) { return $q->where('show_in_nav', true); }
    public function scopeTopLevel($q) { return $q->whereNull('parent_id'); }
}
