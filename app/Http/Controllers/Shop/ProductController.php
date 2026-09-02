<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Product, Category, Setting};
use App\Traits\SeoHelper;
use Inertia\Inertia;

class ProductController extends Controller
{
    use SeoHelper;

    public function index(\Illuminate\Http\Request $request)
    {
        $baseUrl  = config('app.url');
        $settings = Setting::allKeyed();
        $query    = Product::active()->with('category', 'productImages');

        $category = null;
        if ($request->category) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $childIds = $category->children()->where('is_active', true)->pluck('id')->toArray();
                $allIds   = array_merge([$category->id], $childIds);
                $query->whereIn('category_id', $allIds);
            }
        }

        $term = $request->q ?? $request->search ?? '';
        if ($term) {
            // Previously only checked name/description — searching
            // "shirts" or "electronics" (a category name) returned
            // nothing unless that exact word also happened to appear in
            // a product's own name or description.
            $query->where(function($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('description', 'like', "%{$term}%")
                  ->orWhereHas('category', fn($c) => $c->where('name', 'like', "%{$term}%"));
            });
        }

        if ($request->min_price) $query->where('price', '>=', $request->min_price);
        if ($request->max_price) $query->where('price', '<=', $request->max_price);

        $sort = $request->sort ?? 'sort_order';
        match($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'newest'     => $query->latest(),
            'rating'     => $query->orderByDesc('avg_rating'),
            default      => $query->orderBy('sort_order'),
        };

        // Apply attribute filters (attr_size=M, attr_color=Red etc)
        foreach ($request->all() as $key => $val) {
            if (str_starts_with($key, 'attr_') && $val) {
                $attrName = strtoupper(substr($key, 5));
                $query->whereHas('variantAttributes', fn($q) =>
                    $q->where('name', 'LIKE', $attrName . '%')
                      ->whereHas('values', fn($v) => $v->where('value', $val))
                );
            }
        }

        $products = $query->paginate(24)->withQueryString();

        // Available attribute filters for sidebar
        $attributes = \App\Models\VariantAttribute::with('values')
            ->whereHas('product', fn($q) => $q->where('is_active', true)
                ->when($category, fn($q) => $q->whereIn('category_id',
                    array_merge([$category?->id ?? 0],
                        $category ? $category->children()->where('is_active', true)->pluck('id')->toArray() : [])))
            )->get()
            ->groupBy(fn($a) => strtoupper(preg_replace('/\d+$/', '', $a->name)))
            ->map(fn($g, $n) => [
                'name'   => $n,
                'values' => $g->flatMap(fn($a) => $a->values->pluck('value'))->unique()->sort()->values(),
            ])->values();

        // Load categories with children
        $categories = Category::active()->whereNull('parent_id')
            ->with(['children' => fn($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->orderBy('sort_order')->get();

        // Build active filters (including attr_ filters)
        $attrFilters = collect($request->all())
            ->filter(fn($v, $k) => str_starts_with($k, 'attr_') && $v)
            ->toArray();

        $activeFilters = array_filter(array_merge(
            ['category' => $request->category,
             'q'        => $request->q ?? $request->search,
             'max_price'=> $request->max_price,
             'sort'     => $request->sort],
            $attrFilters
        ), fn($v) => $v !== null && $v !== '');

        return Inertia::render('Shop/Index', [
            'products'   => $products,
            'categories' => $categories,
            'attributes' => $attributes,
            'filters'    => (object) $activeFilters,
            'settings'   => $settings,
            'seo'        => $this->categorySeo($category, $baseUrl),
        ]);
    }

    public function show(string $slug)
    {
        $baseUrl  = config('app.url');
        $settings = Setting::allKeyed();

        $product = Product::active()
            ->where('slug', $slug)
            ->with(['productImages', 'category', 'variantAttributes.values', 'variants.variantValues', 'approvedReviews.user'])
            ->firstOrFail();

        $related = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('productImages')
            ->take(8)
            ->get();

        return Inertia::render('Shop/Show', [
            'product'  => $product,
            'related'  => $related,
            'settings' => $settings,
            'seo'      => $this->productSeo($product, $baseUrl), // ✅ SEO
        ]);
    }

    public function newArrivals(\Illuminate\Http\Request $request)
    {
        $products = Product::active()
            ->with('category', 'productImages')
            ->where(function($q) {
                $q->where('is_new', true)
                  ->orWhere('created_at', '>=', now()->subDays(30));
            })
            ->latest()
            ->paginate(24)
            ->withQueryString();

        return \Inertia\Inertia::render('Shop/Index', [
            'products'   => $products,
            'categories' => \App\Models\Category::active()->whereNull('parent_id')->orderBy('sort_order')->get(),
            'filters'    => ['is_new' => '1'],
            'settings'   => \App\Models\Setting::allKeyed(),
            'seo'        => ['title' => 'New Arrivals — MILLIONAIRE', 'description' => 'Latest products from MILLIONAIRE'],
        ]);
    }
}
