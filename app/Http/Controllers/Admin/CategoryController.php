<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::with(['children.children'])
                ->withCount('products')
                ->whereNull('parent_id')
                ->orderBy('nav_order')
                ->orderBy('sort_order')
                ->get(),
            'allCategories' => Category::orderBy('sort_order')
                ->get(['id','name','slug','parent_id']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255',
            'slug'         => 'required|string|unique:categories,slug',
            'description'  => 'nullable|string',
            'parent_id'    => 'nullable|exists:categories,id',
            'sort_order'   => 'integer|min:0',
            'nav_order'    => 'integer|min:0',
            'is_active'    => 'boolean',
            'show_in_nav'  => 'boolean',
            'color'        => 'nullable|string|max:20',
            'icon'               => 'nullable|string|max:10',
            'image'              => 'nullable|image|max:5120',
            'mobile_image'       => 'nullable|image|max:5120',
            'banner_image'       => 'nullable|image|max:5120',
            'mobile_banner_image'=> 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = ImageService::process($request->file('image'), 'categories', 'category');
        } else { unset($data['image']); }
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image'] = ImageService::process($request->file('mobile_image'), 'categories/mobile', 'banner_promo');
        } else { unset($data['mobile_image']); }
        if ($request->hasFile('banner_image')) {
            $data['banner_image'] = ImageService::process($request->file('banner_image'), 'categories/banners', 'category_banner');
        } else { unset($data['banner_image']); }
        if ($request->hasFile('mobile_banner_image')) {
            $data['mobile_banner_image'] = ImageService::process($request->file('mobile_banner_image'), 'categories/mobile-banners', 'banner_sm');
        } else { unset($data['mobile_banner_image']); }

        if (empty($data['parent_id'])) $data['parent_id'] = null;

        $cat = Category::create($data);
        Cache::forget('nav_categories'); return back()->with('success', "Category \"{$cat->name}\" created.");
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'               => 'string|max:255',
            'slug'               => "string|unique:categories,slug,{$category->id}",
            'description'        => 'nullable|string',
            'parent_id'          => 'nullable|exists:categories,id',
            'sort_order'         => 'integer|min:0',
            'nav_order'          => 'integer|min:0',
            'is_active'          => 'boolean',
            'show_in_nav'        => 'boolean',
            'color'              => 'nullable|string|max:20',
            'icon'               => 'nullable|string|max:10',
            'image'              => 'nullable|image|max:5120',
            'mobile_image'       => 'nullable|image|max:5120',
            'banner_image'       => 'nullable|image|max:5120',
            'mobile_banner_image'=> 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = ImageService::process($request->file('image'), 'categories', 'category');
        } else {
            unset($data['image']); // don't overwrite existing image if no new file uploaded
        }
        if ($request->hasFile('mobile_image')) {
            $data['mobile_image'] = ImageService::process($request->file('mobile_image'), 'categories/mobile', 'banner_promo');
        } else {
            unset($data['mobile_image']);
        }
        if ($request->hasFile('banner_image')) {
            $data['banner_image'] = ImageService::process($request->file('banner_image'), 'categories/banners', 'category_banner');
        } else {
            unset($data['banner_image']);
        }
        if ($request->hasFile('mobile_banner_image')) {
            $data['mobile_banner_image'] = ImageService::process($request->file('mobile_banner_image'), 'categories/mobile-banners', 'banner_sm');
        } else {
            unset($data['mobile_banner_image']);
        }

        if (array_key_exists('parent_id', $data) && empty($data['parent_id'])) {
            $data['parent_id'] = null;
        }

        $category->update($data);
        Cache::forget('nav_categories'); return back()->with('success', "Category \"{$category->name}\" updated.");
    }

    public function destroy(Category $category)
    {
        $category->children()->update(['parent_id' => $category->parent_id]);
        $category->delete();
        Cache::forget('nav_categories'); return back()->with('success', "Category deleted.");
    }

    public function reorder(Request $request)
    {
        foreach ($request->input('items', []) as $item) {
            Category::where('id', $item['id'])->update([
                'sort_order' => $item['sort_order'],
                'parent_id'  => $item['parent_id'] ?? null,
            ]);
        }
        return response()->json(['ok' => true]);
    }
}
