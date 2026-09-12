<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Category, Product, HeroSlide, Setting};
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

        $homeData = Cache::remember('home_data_v2', 900, function () {
            $heroSlides = HeroSlide::where('is_active', true)->orderBy('sort_order')->get();

            $topCategories = Category::active()
                ->whereNull('parent_id')
                ->with(['children' => fn($q) => $q->where('is_active', true)->orderBy('sort_order'), 'children.children' => fn($q) => $q->orderBy('sort_order')])
                ->orderBy('nav_order')->orderBy('sort_order')
                ->get();

            $newProducts = Product::active()->where('is_new', true)
                ->with('category', 'productImages', 'variantAttributes')
                ->latest()->take(12)->get();

            $onSaleProducts = Product::active()->onSale()
                ->with('category', 'productImages', 'variantAttributes')
                ->take(12)->get();

            $featuredProducts = Product::active()->where('is_featured', true)
                ->with('category', 'productImages', 'variantAttributes')
                ->take(12)->get();

            return compact('heroSlides', 'topCategories', 'newProducts', 'onSaleProducts', 'featuredProducts');
        });

        return Inertia::render('Home', array_merge($homeData, [
            'settings' => $settings,
            'seo'      => $this->homeSeo($settings, $baseUrl),
        ]));
    }
}
