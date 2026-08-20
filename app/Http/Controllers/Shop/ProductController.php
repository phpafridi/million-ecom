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
                $childIds = $category->activeChildren?->pluck('id')->toArray() ?? [];
                $allIds   = array_merge([$category->id], $childIds);
                $query->whereIn('category_id', $allIds);
            }
        }

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
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

        return Inertia::render('Shop/Index', [
            'products'   => $query->paginate(24)->withQueryString(),
            'categories' => Category::active()->whereNull('parent_id')->orderBy('sort_order')->get(),
            'filters'    => $request->only(['category','search','min_price','max_price','sort']),
            'settings'   => $settings,
            'seo'        => $this->categorySeo($category, $baseUrl), // ✅ SEO
        ]);
    }

    public function show(string $slug)
    {
        $baseUrl  = config('app.url');
        $settings = Setting::allKeyed();

        $product = Product::active()
            ->where('slug', $slug)
            ->with(['productImages', 'category', 'variantAttributes.values', 'variants', 'approvedReviews.user'])
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
}
