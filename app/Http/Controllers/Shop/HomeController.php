<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Category, Setting};
use App\Traits\SeoHelper;
use Inertia\Inertia;

class HomeController extends Controller
{
    use SeoHelper;

    public function index()
    {
        $baseUrl  = config('app.url');
        $settings = Setting::allKeyed();

        // Landing page is now just the two top-level categories (Men,
        // Women) as picture tiles — no hero slides, no product listings,
        // no banners needed here anymore. Those queries were removed
        // entirely rather than left unused, since running them on every
        // load of the highest-traffic page for data nothing displays
        // would be pure waste.
        $allCategories = Category::active()
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Home', [
            'categories' => $allCategories,
            'settings'   => $settings,
            'seo'        => $this->homeSeo($settings, $baseUrl),
        ]);
    }
}
