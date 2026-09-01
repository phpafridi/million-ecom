<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Product, Setting, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to   = $request->to   ?? now()->toDateString();
        $f    = $from . ' 00:00:00';
        $t    = $to   . ' 23:59:59';

        return Inertia::render('Admin/Reports/Index', [
            'from'         => $from,
            'to'           => $to,
            'revenueDaily' => DB::table('orders')->whereNotIn('status',['cancelled'])->whereBetween('created_at',[$f,$t])->selectRaw('DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')->groupBy('date')->orderBy('date')->get(),
            'byPayment'    => DB::table('orders')->whereNotIn('status',['cancelled'])->whereBetween('created_at',[$f,$t])->selectRaw('payment_method, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')->groupBy('payment_method')->get(),
            'byCity'       => DB::table('orders')->whereNotIn('status',['cancelled'])->selectRaw('city, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')->groupBy('city')->orderByDesc('revenue')->limit(10)->get(),
            'topProducts'  => DB::table('order_items')->join('orders','order_items.order_id','=','orders.id')->whereNotIn('orders.status',['cancelled'])->whereBetween('orders.created_at',[$f,$t])->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.subtotal) as revenue')->groupBy('order_items.product_name')->orderByDesc('revenue')->limit(10)->get(),
            'byStatus'     => DB::table('orders')->selectRaw('status, COUNT(*) as count')->groupBy('status')->get()->mapWithKeys(fn($r)=>[$r->status=>$r->count]),
            'lowStock'     => Product::where('stock','<=',(int)(Setting::get('low_stock_threshold',5)))->where('is_active',true)->select('id','name','stock')->orderBy('stock')->limit(10)->get(),
            'kpis'         => [
                'total_revenue' => (float)DB::table('orders')->whereNotIn('status',['cancelled'])->whereBetween('created_at',[$f,$t])->sum('total'),
                'total_orders'  => DB::table('orders')->whereBetween('created_at',[$f,$t])->count(),
                'avg_order'     => (float)(DB::table('orders')->whereNotIn('status',['cancelled'])->whereBetween('created_at',[$f,$t])->avg('total') ?? 0),
                'new_customers' => User::where('role','customer')->whereBetween('created_at',[$f,$t])->count(),
                'this_month'    => (float)DB::table('orders')->whereNotIn('status',['cancelled'])->whereMonth('created_at',now()->month)->sum('total'),
                'last_month'    => (float)DB::table('orders')->whereNotIn('status',['cancelled'])->whereMonth('created_at',now()->subMonth()->month)->sum('total'),
            ],
        ]);
    }

    public function export(Request $request)
    {
        // No date validation, no row limit, and the entire CSV was being
        // built as one giant string in PHP memory before sending — an admin
        // could request from year 2000 to 2099 and, with enough order
        // volume, exhaust available memory on a single export request.
        $request->validate([
            'from' => 'nullable|date|before_or_equal:today',
            'to'   => 'nullable|date|after_or_equal:from|before_or_equal:today',
        ]);

        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to   = $request->to   ?? now()->toDateString();

        if (\Carbon\Carbon::parse($from)->diffInDays(\Carbon\Carbon::parse($to)) > 365) {
            return back()->withErrors(['error' => 'Export range cannot exceed 1 year.']);
        }

        $filename = "orders-{$from}-to-{$to}.csv";

        // Streamed and chunked instead of loading everything into memory at
        // once — handles arbitrarily large order volumes safely.
        return response()->streamDownload(function () use ($from, $to) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Order ID','Customer','Phone','City','Status','Payment','Total','Date']);

            DB::table('orders')
                ->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59'])
                ->orderBy('id')
                ->chunk(500, function ($orders) use ($handle) {
                    foreach ($orders as $o) {
                        fputcsv($handle, [
                            $o->id, $o->customer_name ?? '',
                            $o->customer_phone ?? '', $o->city ?? '',
                            $o->status, $o->payment_method,
                            $o->total, substr($o->created_at ?? '', 0, 10),
                        ]);
                    }
                });
            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
