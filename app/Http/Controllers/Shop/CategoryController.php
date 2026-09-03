<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Category, Setting};
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class CategoryController extends Controller
{
    // Categories with subcategories (e.g. Millionaire Optical) show a
    // landing page of full-cover subcategory cards first — same visual
    // pattern as the homepage's category section. Leaf categories (no
    // children — e.g. Millionaire Watches) skip straight to the product
    // grid, since there's nothing to drill into.
    public function show(string $slug): Response|RedirectResponse
    {
        $category = Category::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $children = $category->children()->where('is_active', true)
            ->orderBy('sort_order')->get();

        if ($children->isEmpty()) {
            return redirect("/shop?category={$category->slug}");
        }

        return Inertia::render('Shop/CategoryLanding', [
            'category'  => $category,
            'children'  => $children,
            'settings'  => Setting::allKeyed(),
        ]);
    }
}
