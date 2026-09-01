<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Product, Category, ProductImage, VariantAttribute, VariantValue};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Services\ImageService;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category','productImages'])->latest();
        if ($q = $request->q) $query->where('name','like',"%{$q}%");
        if ($c = $request->category) $query->whereHas('category', fn($q2) => $q2->where('slug',$c));

        $categories = Category::active()->with('parent')->orderBy('sort_order')->get()
            ->map(fn($c) => [
                'id'   => $c->id,
                'name' => $c->parent ? "{$c->parent->name} → {$c->name}" : $c->name,
                'slug' => $c->slug,
            ]);

        return Inertia::render('Admin/Products/Index', [
            'products'   => $query->paginate(20)->withQueryString(),
            'categories' => $categories,
            'filters'    => $request->only(['q','category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Edit', [
            'categories' => $this->categoryOptions(),
            'isCreate'   => true,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'slug'          => 'required|string|unique:products,slug',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock'         => 'required|integer|min:0',
            'category_id'   => 'required|exists:categories,id',
            'is_featured'   => 'boolean',
            'is_new'        => 'boolean',
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
            'images.*'      => 'nullable|image|max:5120',
        ]);

        $product = Product::create($data);
        $this->saveImages($request, $product);
        \Illuminate\Support\Facades\Cache::forget('home_products');
        \Illuminate\Support\Facades\Cache::forget('sitemap_xml');

        return redirect()->route('admin.products.index')->with('success', "Product \"{$product->name}\" created.");
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product'    => $product->load(['category','productImages','variantAttributes.values']),
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'slug'          => "sometimes|string|unique:products,slug,{$product->id}",
            'description'   => 'nullable|string',
            'price'         => 'sometimes|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock'         => 'sometimes|integer|min:0',
            'category_id'   => 'sometimes|exists:categories,id',
            'is_featured'   => 'boolean',
            'is_new'        => 'boolean',
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
            'images.*'      => 'nullable|image|max:5120',
        ]);

        $product->update($data);
        $this->saveImages($request, $product);
        \Illuminate\Support\Facades\Cache::forget('home_products');
        \Illuminate\Support\Facades\Cache::forget('sitemap_xml');

        return redirect()->route('admin.products.index')->with('success', "Product \"{$product->name}\" updated.");
    }

    public function destroy(Product $product)
    {
        foreach ($product->productImages as $img) {
            $diskPath = \App\Services\ImageService::diskPath($img->path);
            if ($diskPath) Storage::disk('uploads')->delete($diskPath);
        }
        $product->delete();
        \Illuminate\Support\Facades\Cache::forget('home_products');
        \Illuminate\Support\Facades\Cache::forget('sitemap_xml');
        return back()->with('success', 'Product deleted.');
    }

    // ── BULK ACTIONS ──
    public function bulkAction(Request $request)
    {
        $data = $request->validate([
            'action'        => 'required|in:activate,deactivate,delete',
            'product_ids'   => 'required|array|min:1',
            'product_ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $data['product_ids']);

        match($data['action']) {
            'activate'   => $products->update(['is_active' => true]),
            'deactivate' => $products->update(['is_active' => false]),
            'delete'     => $products->with('productImages')->get()->each(function ($p) {
                // Single-product destroy() already cleans up image files —
                // bulk delete skipped this entirely, leaving orphaned files
                // on disk for every product deleted this way.
                foreach ($p->productImages as $img) {
                    $diskPath = \App\Services\ImageService::diskPath($img->path);
                    if ($diskPath) Storage::disk('uploads')->delete($diskPath);
                }
                $p->delete();
            }),
        };

        $count = count($data['product_ids']);
        \Illuminate\Support\Facades\Cache::forget('home_products');
        \Illuminate\Support\Facades\Cache::forget('sitemap_xml');
        return back()->with('success', "{$count} product(s) {$data['action']}d.");
    }

    // ── CSV EXPORT ──
    public function export()
    {
        $products = Product::with('category','productImages')->get();
        // Header previously only listed 9 columns while the actual data row
        // written below has 10 values (an unlabeled "is_new" flag squeezed
        // in between Featured and Description) — meaning the exported file
        // never actually matched its own header, and "Description" in Excel
        // would show the is_new flag instead. Re-exporting existing data
        // will now produce a genuinely consistent file.
        $csv = "ID,Name,Slug,Category,Price,Compare Price,Stock,Featured,New,Description\n";
        foreach ($products as $p) {
            $desc = str_replace(['"',"\n"], ['\\"',' '], $p->description ?? '');
            $csv .= implode(',', [
                $p->id,
                '"' . str_replace('"', '\\"', $p->name) . '"',
                $p->slug,
                '"' . ($p->category->name ?? '') . '"',
                $p->price,
                $p->compare_price ?? '',
                $p->stock,
                $p->is_featured ? '1' : '0',
                    $p->is_new       ? '1' : '0',
                '"' . $desc . '"',
            ]) . "\n";
        }
        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="products-' . date('Y-m-d') . '.csv"');
    }

    // ── CSV IMPORT ──
    public function import(Request $request)
    {
        $request->validate(['csv' => 'required|file|mimes:csv,txt|max:10240']);
        $rows    = array_map('str_getcsv', explode("\n", file_get_contents($request->file('csv')->getPathname())));
        array_shift($rows); // skip header
        $created = 0; $updated = 0;

        foreach ($rows as $row) {
            if (count($row) < 5) continue;
            try {
                $slug = Str::slug($row[1] ?? '');
                if (!$slug) continue;
                $category = Category::where('name', trim($row[3] ?? ''))->first();
                // updateOrCreate() always returns a model instance, which is
                // always truthy in a ternary — meaning $updated incremented
                // on every row and $created never did, regardless of whether
                // the product was actually new. wasRecentlyCreated is the
                // correct signal for which one actually happened.
                $product = Product::updateOrCreate(['slug' => $slug], [
                    'name'          => trim($row[1]),
                    'category_id'   => $category?->id,
                    'price'         => (float)($row[4] ?? 0),
                    'compare_price' => (float)($row[5] ?? 0) ?: null,
                    'stock'         => (int)($row[6] ?? 0),
                    'is_featured'   => ($row[7] ?? '0') === '1',
                    'is_new'        => ($row[8] ?? '0') === '1',
                    'description'   => trim($row[9] ?? ''),
                    'is_active'     => true,
                ]);
                $product->wasRecentlyCreated ? $created++ : $updated++;
            } catch (\Throwable $e) { /* skip bad rows */ }
        }

        \Illuminate\Support\Facades\Cache::forget('home_products');
        \Illuminate\Support\Facades\Cache::forget('sitemap_xml');
        return back()->with('success', "Import complete: {$created} created, {$updated} updated.");
    }

    // ── VARIANTS ──
    public function storeVariant(Request $request, Product $product)
    {
        $data = $request->validate([
            'attributes'                  => 'required|array',
            'attributes.*.name'           => 'required|string|max:50',
            'attributes.*.is_required'    => 'nullable|boolean',
            'attributes.*.display_type'   => 'nullable|string|in:button,color,dropdown',
            'attributes.*.values'         => 'required|array',
            'attributes.*.values.*.value' => 'required|string|max:50',
            'attributes.*.values.*.color_hex' => 'nullable|string|max:7',
        ]);

        $product->variantAttributes()->delete();

        foreach ($data['attributes'] as $i => $attrData) {
            $attr = $product->variantAttributes()->create([
                'name'         => $attrData['name'],
                'is_required'  => !empty($attrData['is_required']),
                'display_type' => $attrData['display_type'] ?? 'button',
                'sort_order'   => $i,
            ]);
            foreach ($attrData['values'] as $j => $valData) {
                $attr->values()->create([
                    'value'      => is_array($valData) ? $valData['value'] : $valData,
                    'color_hex'  => is_array($valData) ? ($valData['color_hex'] ?? null) : null,
                    'sort_order' => $j,
                ]);
            }
        }

        return back()->with('success', 'Variants saved.');
    }

    // ── HELPERS ──
    private function saveImages(Request $request, Product $product): void
    {
        if (!$request->hasFile('images')) return;
        $sort = $product->productImages()->max('sort_order') ?? 0;
        foreach ($request->file('images') as $file) {
            $path = ImageService::process($file, "products/{$product->id}", 'product');
            ProductImage::create([
                'product_id' => $product->id,
                'path'       => $path,
                'sort_order' => ++$sort,
            ]);
        }
    }

    private function categoryOptions(): \Illuminate\Support\Collection
    {
        return Category::active()->with('parent')
            ->orderByRaw('COALESCE(parent_id, id), parent_id IS NOT NULL, sort_order')
            ->get()
            ->map(fn($c) => [
                'id'   => $c->id,
                'name' => $c->parent ? "{$c->parent->name} → {$c->name}" : $c->name,
            ]);
    }
}
