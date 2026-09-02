<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Wishlist, Product, Setting};
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    private function sid(): string { return session()->getId(); }

    // For a logged-in customer, the wishlist belongs to their account —
    // querying by session_id alone (the old behavior everywhere in this
    // controller) meant the wishlist silently became invisible the moment
    // their session regenerated on login, even though user_id was already
    // being saved on each item. Guests still key off session_id as before.
    private function scoped($query)
    {
        return auth()->check()
            ? $query->where('user_id', auth()->id())
            : $query->where('session_id', $this->sid());
    }

    public function index()
    {
        $items = $this->scoped(Wishlist::query())
            ->with(['product.productImages', 'product.category', 'product.variantAttributes'])
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
            $existing = $this->scoped(Wishlist::query())
                ->where('product_id', $data['product_id'])->first();

            if ($existing) {
                $existing->delete();
            } elseif (auth()->check()) {
                // Use updateOrCreate to handle race conditions safely
                Wishlist::updateOrCreate(
                    ['user_id' => auth()->id(), 'product_id' => $data['product_id']],
                    ['session_id' => $sid]
                );
            } else {
                Wishlist::updateOrCreate(
                    ['session_id' => $sid, 'product_id' => $data['product_id']],
                    ['user_id' => null]
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
        $exists    = $this->scoped(Wishlist::query())
            ->where('product_id', $productId)->exists();
        return response()->json(['wishlisted' => $exists]);
    }

    public function checkAll()
    {
        $ids = $this->scoped(Wishlist::query())->pluck('product_id');
        return response()->json(['ids' => $ids]);
    }
}
