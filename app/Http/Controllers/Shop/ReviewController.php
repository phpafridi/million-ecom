<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, int $productId)
    {
        $data = $request->validate([
            'name'   => 'required|string|max:100',
            'email'  => 'nullable|email',
            'rating' => 'required|integer|min:1|max:5',
            'title'  => 'nullable|string|max:100',
            'body'   => 'nullable|string|max:1000',
        ]);

        Review::create(array_merge($data, [
            'product_id'  => $productId,
            'is_approved' => false, // Admin must approve
        ]));

        return back()->with('success', 'Review submitted! It will appear after approval.');
    }
}
