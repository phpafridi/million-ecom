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
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
            'images.*'      => 'nullable|image|max:5120',
        ]);

        $product = Product::create($data);
        $this->saveImages($request, $product);

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
            'is_active'     => 'boolean',
            'sort_order'    => 'integer|min:0',
            'images.*'      => 'nullable|image|max:5120',
        ]);

        $product->update($data);
        $this->saveImages($request, $product);

        return redirect()->route('admin.products.index')->with('success', "Product \"{$product->name}\" updated.");
    }

    public function destroy(Product $product)
    {
        foreach ($product->productImages as $img) {
            if (!str_starts_with($img->path, 'http')) {
                Storage::disk('uploads')->delete($img->path);
            }
        }
        $product->delete();
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
            'delete'     => $products->get()->each(fn($p) => $p->delete()),
        };

        $count = count($data['product_ids']);
        return back()->with('success', "{$count} product(s) {$data['action']}d.");
    }

    // ── CSV EXPORT ──
    public function export()
    {
        $products = Product::with('category','productImages')->get();
        $csv = "ID,Name,Slug,Category,Price,Compare Price,Stock,Featured,Description\n";
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
                Product::updateOrCreate(['slug' => $slug], [
                    'name'          => trim($row[1]),
                    'category_id'   => $category?->id,
                    'price'         => (float)($row[4] ?? 0),
                    'compare_price' => (float)($row[5] ?? 0) ?: null,
                    'stock'         => (int)($row[6] ?? 0),
                    'is_featured'   => ($row[7] ?? '0') === '1',
                    'description'   => trim($row[8] ?? ''),
                    'is_active'     => true,
                ]) ? $updated++ : $created++;
            } catch (\Throwable $e) { /* skip bad rows */ }
        }

        return back()->with('success', "Import complete: {$created} created, {$updated} updated.");
    }

    // ── VARIANTS ──
    public function storeVariant(Request $request, Product $product)
    {
        $data = $request->validate([
            'attributes'            => 'required|array',
            'attributes.*.name'     => 'required|string|max:50',
            'attributes.*.values'   => 'required|array',
            'attributes.*.values.*' => 'required|string|max:50',
        ]);

        $product->variantAttributes()->delete();

        foreach ($data['attributes'] as $i => $attrData) {
            $attr = $product->variantAttributes()->create(['name' => $attrData['name'], 'sort_order' => $i]);
            foreach ($attrData['values'] as $j => $val) {
                $attr->values()->create(['value' => $val, 'sort_order' => $j]);
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
