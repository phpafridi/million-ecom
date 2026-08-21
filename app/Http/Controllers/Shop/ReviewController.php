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
            'email'  => 'nullable|email|max:150',
            'rating' => 'required|integer|min:1|max:5',
            'title'  => 'nullable|string|max:100',
            'body'   => 'nullable|string|max:1000',
        ]);

        Review::create(array_merge($data, [
            'product_id'  => $productId,
            'user_id'     => auth()->id(),
            'is_approved' => false,
        ]));

        return back()->with('success', 'Thank you! Your review will appear after approval.');
    }
}
