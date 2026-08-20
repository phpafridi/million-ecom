<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'name','slug','description','type','image','banner_image','icon','color',
        'parent_id','sort_order','is_active','show_in_nav','nav_order'
    ];
    protected $casts = ['is_active' => 'boolean', 'show_in_nav' => 'boolean'];

    public function products()          { return $this->hasMany(Product::class); }
    public function parent()            { return $this->belongsTo(Category::class, 'parent_id'); }
    public function children()          { return $this->hasMany(Category::class, 'parent_id'); }
    public function activeChildren()    { return $this->children()->where('is_active', true)->orderBy('sort_order'); }
    public function allDescendants()    { return $this->children()->with('allDescendants'); }
    public function scopeActive($q)     { return $q->where('is_active', true); }
    public function scopeTopLevel($q)   { return $q->whereNull('parent_id'); }
    public function scopeNavVisible($q) { return $q->where('show_in_nav', true); }

    /** Full breadcrumb path: [grandparent, parent, self] */
    public function getBreadcrumbAttribute(): array
    {
        $crumbs = [$this];
        $cat = $this;
        while ($cat->parent_id) {
            $cat = $cat->parent;
            array_unshift($crumbs, $cat);
        }
        return $crumbs;
    }
}
