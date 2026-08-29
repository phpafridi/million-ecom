<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Product, Category, HeroSlide, Banner, Setting};
use App\Traits\SeoHelper;
use Inertia\Inertia;

class HomeController extends Controller
{
    use SeoHelper;

    public function index()
    {
        $baseUrl  = config('app.url');
        $settings = Setting::allKeyed();

        $topCategories = Category::active()
            ->whereNull('parent_id')
            ->with(['children' => fn($q) => $q->where('is_active', true)])
            ->orderBy('nav_order')
            ->orderBy('sort_order')
            ->get();

        $allCategories = Category::active()
            ->withCount('products')
            ->whereNull('parent_id')
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

        $banners = Banner::where('is_active', true)->get()->keyBy('position');

        return Inertia::render('Home', [
            'heroSlides'       => HeroSlide::active()->get(),
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
            'categories'       => $allCategories,
            'topCategories'    => $topCategories,
            'categoryProducts' => $categoryProducts,
            'banners'          => $banners,
            'settings'         => $settings,
            'seo'              => $this->homeSeo($settings, $baseUrl), // ✅ SEO
        ]);
    }
}
