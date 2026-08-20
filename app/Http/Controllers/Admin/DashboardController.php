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
        // Revenue chart — last 12 months
        $revenueChart = collect(range(11, 0))->map(function($i) {
            $month = Carbon::now()->subMonths($i);
            $data  = Order::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->whereNotIn('status', ['cancelled'])
                ->selectRaw('COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')
                ->first();
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

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'revenue'         => (float) Order::whereNotIn('status',['cancelled'])->sum('total'),
                'orders'          => Order::count(),
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
