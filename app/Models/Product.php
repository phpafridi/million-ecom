<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','slug','description','price','compare_price',
        'category_id','stock','stock_reserved','stock_sold','track_variant_stock',
        'is_featured','is_new','is_active','sort_order',
        'avg_rating','review_count',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_new'      => 'boolean',
        'is_active'   => 'boolean',
        'track_variant_stock' => 'boolean',
    ];

    protected $appends = ['images','discount_pct','first_image','is_low_stock'];

    // Relations
    public function category()          { return $this->belongsTo(Category::class); }
    public function productImages()     { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function orderItems()        { return $this->hasMany(OrderItem::class); }
    public function variants()          { return $this->hasMany(ProductVariant::class)->orderBy('sort_order'); }
    public function variantAttributes() { return $this->hasMany(VariantAttribute::class)->with('values')->orderBy('sort_order'); }
    public function reviews()           { return $this->hasMany(Review::class); }
    public function approvedReviews()   { return $this->hasMany(Review::class)->where('is_approved', true)->latest(); }

    // Scopes
    public function scopeActive($q)    { return $q->where('is_active', true); }
    public function scopeFeatured($q)  { return $q->where('is_featured', true); }
    public function scopeOnSale($q)
    {
        // The global flash sale (Settings: sale_enabled/sale_discount/
        // sale_ends_at) is a site-wide % discount, not a per-product one —
        // but this scope only ever checked each product's own price vs
        // compare_price. During an active flash sale, the homepage's "On
        // Sale" section would show zero products unless they *also*
        // individually had a compare_price set, which defeats the purpose
        // of a global sale entirely.
        $enabled  = \App\Models\Setting::get('sale_enabled', '0') === '1';
        $discount = (int) \App\Models\Setting::get('sale_discount', '0');
        $endsAt   = \App\Models\Setting::get('sale_ends_at', '');
        $active   = $enabled && $discount > 0
            && (!$endsAt || now()->lt(\Carbon\Carbon::parse($endsAt)));

        if ($active) {
            // Every active product counts as "on sale" during a flash sale.
            return $q;
        }
        return $q->whereColumn('price', '<', 'compare_price');
    }
    public function scopeNew($q)       { return $q->where('is_new', true); }
    public function scopeLowStock($q)  {
        $threshold = (int) (\App\Models\Setting::get('low_stock_threshold', 5) ?? 5);
        return $q->where('stock', '<=', $threshold)->where('stock', '>', 0);
    }

    // Appended attributes
    public function getImagesAttribute(): array {
        return $this->productImages->map(fn($img) => [
            'id'    => $img->id,
            'url'   => $img->url,
            'thumb' => $img->url,
        ])->toArray();
    }

    public function getFirstImageAttribute(): string {
        $img = $this->productImages->first();
        return $img ? $img->url : '/images/placeholder.jpg';
    }

    public function getDiscountPctAttribute(): int {
        if (!$this->compare_price || $this->compare_price <= $this->price) return 0;
        return (int) round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }

    public function getIsLowStockAttribute(): bool {
        $threshold = (int) (\App\Models\Setting::get('low_stock_threshold', 5) ?? 5);
        return $this->stock <= $threshold && $this->stock > 0;
    }

    // Effective stock (total across variants if has variants)
    public function getEffectiveStockAttribute(): int {
        if ($this->variants()->exists()) {
            return $this->variants()->where('is_active', true)->sum('stock');
        }
        return $this->stock;
    }
}
