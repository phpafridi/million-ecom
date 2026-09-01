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

        // Prevent the same person from reviewing the same product more than
        // once — genuinely no check existed here at all before. Priority:
        // logged-in account, then the email they gave, then IP as a last
        // resort for anonymous guests with no email.
        $duplicateCheck = \App\Models\Review::where('product_id', $productId);
        if (auth()->id()) {
            $duplicateCheck->where('user_id', auth()->id());
        } elseif (!empty($data['email'])) {
            $duplicateCheck->where('email', $data['email']);
        } else {
            $duplicateCheck->where('ip_address', $request->ip());
        }
        if ($duplicateCheck->exists()) {
            return back()->with('error', 'You have already reviewed this product.');
        }

        // Verified purchase — look for a delivered order containing this
        // product, matched by account or by the email given.
        $orderId = null;
        $orderQuery = \App\Models\Order::whereIn('status', ['delivered'])
            ->whereHas('items', fn($q) => $q->where('product_id', $productId));
        if (auth()->id()) {
            $orderQuery->where('user_id', auth()->id());
        } elseif (!empty($data['email'])) {
            $orderQuery->where('customer_email', $data['email']);
        } else {
            $orderQuery = null;
        }
        if ($orderQuery) {
            $orderId = $orderQuery->value('id');
        }

        Review::create(array_merge($data, [
            'product_id'  => $productId,
            'order_id'    => $orderId,
            'user_id'     => auth()->id(),
            'ip_address'  => $request->ip(),
            'is_approved' => false,
        ]));

        return back()->with('success', 'Thank you! Your review will appear after approval.');
    }
}
