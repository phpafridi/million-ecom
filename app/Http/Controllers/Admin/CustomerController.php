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
        // Loaded every registered customer AND every guest-order group into
        // PHP memory with zero limit, then merged and sorted them there —
        // with thousands of customers this would exhaust available memory
        // and crash the request outright. The frontend has no pagination UI
        // built for this page at all yet, so a full paginated rebuild is a
        // genuine separate task rather than something to force through here
        // — this cap at least removes the actual unbounded-growth crash risk
        // for now, and stats are cached instead of recomputed on every load.
        $registered = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->latest()
            ->take(500)
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
            ->take(500)
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

        // True totals (not just the capped 500+500 above) — cached for 5
        // minutes rather than recomputed on every page load.
        $stats = \Illuminate\Support\Facades\Cache::remember('customer_stats', 300, function () {
            return [
                'total'         => User::where('role', 'customer')->count()
                                   + Order::whereNull('user_id')->distinct('customer_phone')->count('customer_phone'),
                'registered'    => User::where('role', 'customer')->count(),
                'guests'        => Order::whereNull('user_id')->distinct('customer_phone')->count('customer_phone'),
                'total_revenue' => (float) Order::whereNotIn('status', ['cancelled'])->sum('total'),
            ];
        });

        return Inertia::render('Admin/Customers/Index', [
            'customers' => array_values($all),
            'stats'     => $stats,
        ]);
    }
}
