<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Order, Product, User, Review};
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Revenue chart — last 12 months, one query instead of 12
        $revenueRaw = Order::whereNotIn('status', ['cancelled'])
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month_key, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue")
            ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
            ->get()
            ->keyBy('month_key');

        $revenueChart = collect(range(11, 0))->map(function($i) use ($revenueRaw) {
            $month = Carbon::now()->subMonths($i);
            $data  = $revenueRaw->get($month->format('Y-m'));
            return [
                'month'   => $month->format('M'),
                'revenue' => (float) ($data->revenue ?? 0),
                'orders'  => (int)  ($data->orders  ?? 0),
            ];
        })->values()->toArray();

        // Top products by sales
        $topProducts = Product::select('name')
            ->withSum(['orderItems as sold' => fn($q) => $q], 'quantity')
            ->withSum(['orderItems as revenue' => fn($q) => $q], 'subtotal')
            ->orderByDesc('sold')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'name'    => $p->name,
                'sold'    => (int)   ($p->sold    ?? 0),
                'revenue' => (float) ($p->revenue ?? 0),
            ])->toArray();

        // Recent orders
        $recentOrders = Order::with('items')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn($o) => [
                'id'      => $o->id,
                'customer'=> $o->customer_name,
                'total'   => $o->total,
                'status'  => $o->status,
                'payment' => $o->payment_status,
                'date'    => $o->created_at->diffForHumans(),
            ])->toArray();

        // Low stock
        $lowStock = Product::active()
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(6)
            ->get(['id','name','stock'])
            ->toArray();

        // Pending reviews
        $pendingReviews = Review::where('is_approved', false)->count();

        // Refunds were never subtracted here at all — Total Revenue just
        // summed orders.total regardless of any later return, so refunding
        // an item never moved the number.
        $refundedTotal = DB::table('order_returns')->where('status', 'refunded')->sum('refund_amount');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'revenue'         => (float) Order::whereNotIn('status',['cancelled'])->sum('total') - (float) $refundedTotal,
                'orders'          => Order::whereNotIn('status', ['cancelled'])->count(),
                'customers'       => User::where('role','customer')->count(),
                'products'        => Product::active()->count(),
                'pending_orders'  => Order::where('status','pending')->count(),
                'pending_reviews' => $pendingReviews,
            ],
            'revenueChart' => $revenueChart,
            'topProducts'  => $topProducts,
            'recentOrders' => $recentOrders,
            'lowStock'     => $lowStock,
        ]);
    }
}
