<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Product, Category, HeroSlide, Banner, Setting};
use App\Traits\SeoHelper;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    use SeoHelper;

    public function index()
    {
        $baseUrl  = config('app.url');
        $settings = Setting::allKeyed();

        // The homepage was running 7-10+ separate product queries on every
        // single load (4 separate listings, plus one more per top-level
        // category) — on the highest-traffic page of the whole site. None
        // of this needs to be real-time; a few minutes of staleness after a
        // product change is imperceptible to shoppers and dramatically cuts
        // DB load. Cache is explicitly cleared from Admin/ProductController
        // whenever a product actually changes, so admins don't have to wait
        // out the cache window to see their own edits.
        $homeData = Cache::remember('home_products', 900, function () {
            $topCategories = Category::active()
                ->whereNull('parent_id')
                ->with(['children' => fn($q) => $q->where('is_active', true)])
                ->orderBy('nav_order')
                ->orderBy('sort_order')
                ->get();

            $categoryProducts = [];
            foreach ($topCategories as $cat) {
                $childIds = $cat->children->pluck('id')->toArray();
                $allIds   = array_merge([$cat->id], $childIds);
                $categoryProducts[$cat->slug] = Product::active()
                    ->whereIn('category_id', $allIds)
                    ->with('category', 'productImages')
                    ->orderBy('sort_order')
                    ->take(12)
                    ->get();
            }

            return [
                'topCategories'    => $topCategories,
                'categoryProducts' => $categoryProducts,
                'featuredProducts' => Product::active()->featured()->with('category','productImages')->orderBy('sort_order')->take(12)->get(),
                'onSaleProducts'   => Product::active()->onSale()->with('category','productImages')->take(12)->get(),
                'topRatedProducts' => Product::active()->with('category','productImages')->take(12)->get(),
                'newProducts'      => Product::active()
                    ->with('category','productImages')
                    ->where(function($q) {
                        $q->where('is_new', true)
                          ->orWhere('created_at', '>=', now()->subDays(30));
                    })
                    ->latest()
                    ->take(12)
                    ->get(),
            ];
        });

        $allCategories = Category::active()
            ->withCount('products')
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        $banners = Banner::where('is_active', true)->get()->keyBy('position');

        return Inertia::render('Home', array_merge($homeData, [
            'heroSlides'       => HeroSlide::active()->get(),
            'categories'       => $allCategories,
            'banners'          => $banners,
            'settings'         => $settings,
            'seo'              => $this->homeSeo($settings, $baseUrl),
        ]));
    }
}
