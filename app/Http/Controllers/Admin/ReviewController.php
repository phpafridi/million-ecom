<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Review, Product};
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => Review::with('product')->latest()->paginate(30),
            'stats' => [
                'total'    => Review::count(),
                'pending'  => Review::where('is_approved', false)->count(),
                'approved' => Review::where('is_approved', true)->count(),
                'avg'      => round(Review::where('is_approved', true)->avg('rating'), 1),
            ],
        ]);
    }

    public function approve(Review $review)
    {
        $review->update(['is_approved' => true]);
        // Update product avg rating
        $this->updateProductRating($review->product_id);
        return back()->with('success', 'Review approved.');
    }

    public function destroy(Review $review)
    {
        $productId = $review->product_id;
        $review->delete();
        $this->updateProductRating($productId);
        return back()->with('success', 'Review deleted.');
    }

    private function updateProductRating(int $productId): void
    {
        $reviews = Review::where('product_id', $productId)->where('is_approved', true);
        Product::where('id', $productId)->update([
            'avg_rating'   => round($reviews->avg('rating') ?? 0, 2),
            'review_count' => $reviews->count(),
        ]);
    }
}
