<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Order, Product, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to   = $request->to   ?? now()->toDateString();

        // ── Revenue chart — daily ─────────────────────────────────────
        $revenueDaily = DB::table('orders')
            ->whereNotIn('status', ['cancelled'])
            ->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')
            ->groupBy('date')->orderBy('date')->get();

        // ── Revenue by payment method ─────────────────────────────────
        $byPayment = DB::table('orders')
            ->whereNotIn('status', ['cancelled'])
            ->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->selectRaw('payment_method, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')
            ->groupBy('payment_method')->get();

        // ── Revenue by city ───────────────────────────────────────────
        $byCity = DB::table('orders')
            ->whereNotIn('status', ['cancelled'])
            ->selectRaw('city, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')
            ->groupBy('city')->orderByDesc('revenue')->limit(10)->get();

        // ── Top selling products ──────────────────────────────────────
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotIn('orders.status', ['cancelled'])
            ->whereBetween('orders.created_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.subtotal) as revenue')
            ->groupBy('order_items.product_name')->orderByDesc('revenue')->limit(10)->get();

        // ── Order status breakdown ────────────────────────────────────
        $byStatus = DB::table('orders')
            ->selectRaw('status, COUNT(*) as count')->groupBy('status')->get()
            ->mapWithKeys(fn($r) => [$r->status => $r->count]);

        // ── Summary KPIs ──────────────────────────────────────────────
        $totalRevenue  = DB::table('orders')->whereNotIn('status', ['cancelled'])->whereBetween('created_at', [$from, $to])->sum('total');
        $totalOrders   = DB::table('orders')->whereBetween('created_at', [$from, $to])->count();
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $newCustomers  = DB::table('users')->where('role', 'customer')->whereBetween('created_at', [$from, $to])->count();
        $cancelRate    = $totalOrders > 0 ? (DB::table('orders')->where('status','cancelled')->whereBetween('created_at',[$from,$to])->count() / $totalOrders * 100) : 0;

        // ── Month-over-month ──────────────────────────────────────────
        $lastMonth      = DB::table('orders')->whereNotIn('status',['cancelled'])->whereMonth('created_at', now()->subMonth()->month)->sum('total');
        $thisMonth      = DB::table('orders')->whereNotIn('status',['cancelled'])->whereMonth('created_at', now()->month)->sum('total');
        $growthRate     = $lastMonth > 0 ? (($thisMonth - $lastMonth) / $lastMonth * 100) : 0;

        // ── Inventory alerts ──────────────────────────────────────────
        $lowStock = Product::where('stock', '<=', 5)->where('is_active', true)
            ->select('id','name','stock','sku')->orderBy('stock')->limit(10)->get();

        return Inertia::render('Admin/Reports/Index', [
            'from'         => $from,
            'to'           => $to,
            'revenueDaily' => $revenueDaily,
            'byPayment'    => $byPayment,
            'byCity'       => $byCity,
            'topProducts'  => $topProducts,
            'byStatus'     => $byStatus,
            'lowStock'     => $lowStock,
            'kpis'         => [
                'total_revenue'  => (float) $totalRevenue,
                'total_orders'   => $totalOrders,
                'avg_order'      => round($avgOrderValue, 2),
                'new_customers'  => $newCustomers,
                'cancel_rate'    => round($cancelRate, 1),
                'growth_rate'    => round($growthRate, 1),
                'this_month'     => (float) $thisMonth,
                'last_month'     => (float) $lastMonth,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $from  = $request->from ?? now()->startOfMonth()->toDateString();
        $to    = $request->to   ?? now()->toDateString();
        $orders = DB::table('orders')
            ->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
            ->orderBy('id')->get();

        $csv  = "Order ID,Customer,Phone,City,Status,Payment,Total,Date\n";
        foreach ($orders as $o) {
            $csv .= implode(',', [
                $o->id, '"' . $o->customer_name . '"', $o->customer_phone,
                $o->city ?? '', $o->status, $o->payment_method,
                $o->total, substr($o->created_at, 0, 10),
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=orders-{$from}-to-{$to}.csv",
        ]);
    }
}
