<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Wishlist, Product, Setting};
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    private function sid(): string { return session()->getId(); }

    public function index()
    {
        $items = Wishlist::where('session_id', $this->sid())
            ->with(['product.productImages', 'product.category'])
            ->get()
            ->map(fn($w) => $w->product)
            ->filter()
            ->values();

        return Inertia::render('Shop/Wishlist', [
            'items'    => $items,
            'settings' => Setting::allKeyed(),
        ]);
    }

    // Called by Inertia router.post — returns back() to stay on current page
    public function toggle(Request $request)
    {
        $data = $request->validate(['product_id' => 'required|exists:products,id']);
        $sid  = $this->sid();

        try {
            $existing = Wishlist::where('session_id', $sid)
                ->where('product_id', $data['product_id'])->first();

            if ($existing) {
                $existing->delete();
            } else {
                // Use updateOrCreate to handle race conditions safely
                Wishlist::updateOrCreate(
                    ['session_id' => $sid, 'product_id' => $data['product_id']],
                    ['user_id' => auth()->id()]
                );
            }
        } catch (\Throwable $e) {
            // Log error but don't crash - return back gracefully
            \Log::warning('Wishlist toggle error: ' . $e->getMessage());
        }

        // Always return back to the page the user came from
        $referer = $request->headers->get('referer', '/');
        return redirect($referer);
    }

    // Called by fetch() — returns JSON (for ProductCard live state)
    public function checkSingle(Request $request)
    {
        $productId = $request->validate(['product_id' => 'required|integer'])['product_id'];
        $exists    = Wishlist::where('session_id', $this->sid())
            ->where('product_id', $productId)->exists();
        return response()->json(['wishlisted' => $exists]);
    }

    public function checkAll()
    {
        $ids = Wishlist::where('session_id', $this->sid())->pluck('product_id');
        return response()->json(['ids' => $ids]);
    }
}
