<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Order};
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $q = \App\Models\User::where('role','customer');
        if ($s = $request->search) $q->where(fn($q) => $q->where('name','like',"%{$s}%")->orWhere('email','like',"%{$s}%")->orWhere('phone','like',"%{$s}%"));
        if ($request->city) $q->where('city','like',"%{$request->city}%");
        $registered = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->latest()
            ->get()
            ->map(fn($u) => [
                'id'          => 'user_' . $u->id,
                'name'        => $u->name,
                'email'       => $u->email,
                'phone'       => $u->phone ?? null,
                'type'        => 'registered',
                'order_count' => (int)($u->orders_count ?? 0),
                'total_spent' => (float)($u->orders_sum_total ?? 0),
                'created_at'  => $u->created_at?->toDateString(),
            ])->toArray();

        $guests = Order::select(
                'customer_name', 'customer_phone', 'customer_email',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total) as total_spent'),
                DB::raw('MAX(created_at) as last_order')
            )
            ->whereNull('user_id')
            ->groupBy('customer_phone', 'customer_name', 'customer_email')
            ->orderByDesc('last_order')
            ->get()
            ->map(fn($o) => [
                'id'          => 'guest_' . preg_replace('/\D/', '', $o->customer_phone ?? uniqid()),
                'name'        => $o->customer_name,
                'email'       => $o->customer_email,
                'phone'       => $o->customer_phone,
                'type'        => 'guest',
                'order_count' => (int)($o->order_count ?? 0),
                'total_spent' => (float)($o->total_spent ?? 0),
                'created_at'  => $o->last_order ? date('Y-m-d', strtotime($o->last_order)) : null,
            ])->toArray();

        // Merge as plain arrays then sort with usort — avoids getKey() error
        $all = array_merge($registered, $guests);
        usort($all, fn($a, $b) => $b['total_spent'] <=> $a['total_spent']);

        $regCount   = count($registered);
        $guestCount = count($guests);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => array_values($all),
            'stats'     => [
                'total'         => count($all),
                'registered'    => $regCount,
                'guests'        => $guestCount,
                'total_revenue' => array_sum(array_column($all, 'total_spent')),
            ],
        ]);
    }
}
