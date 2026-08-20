<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => Coupon::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'          => 'required|string|max:50|unique:coupons,code',
            'type'          => 'required|in:percentage,fixed,free_shipping',
            'value'         => 'required|numeric|min:0',
            'min_order'     => 'nullable|numeric|min:0',
            'max_discount'  => 'nullable|numeric|min:0',
            'usage_limit'   => 'nullable|integer|min:1',
            'per_user_limit'=> 'nullable|integer|min:1',
            'is_active'     => 'boolean',
            'expires_at'    => 'nullable|date',
            'description'   => 'nullable|string|max:200',
        ]);
        Coupon::create($data);
        return back()->with('success', 'Coupon created.');
    }

    public function update(Request $request, Coupon $coupon)
    {
        $data = $request->validate([
            'code'          => "string|max:50|unique:coupons,code,{$coupon->id}",
            'type'          => 'in:percentage,fixed,free_shipping',
            'value'         => 'numeric|min:0',
            'min_order'     => 'nullable|numeric|min:0',
            'max_discount'  => 'nullable|numeric|min:0',
            'usage_limit'   => 'nullable|integer|min:1',
            'is_active'     => 'boolean',
            'expires_at'    => 'nullable|date',
            'description'   => 'nullable|string|max:200',
        ]);
        $coupon->update($data);
        return back()->with('success', 'Coupon updated.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return back()->with('success', 'Coupon deleted.');
    }
}
