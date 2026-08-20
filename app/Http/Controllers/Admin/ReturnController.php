<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail, Log};
use Inertia\Inertia;

class ReturnController extends Controller
{
    public function index()
    {
        $returns = DB::table('order_returns')
            ->join('orders', 'order_returns.order_id', '=', 'orders.id')
            ->select('order_returns.*', 'orders.customer_name', 'orders.customer_email',
                     'orders.customer_phone', 'orders.total as order_total', 'orders.status as order_status')
            ->orderByRaw("FIELD(order_returns.status,'requested','approved','received','refunded','rejected')")
            ->orderBy('order_returns.created_at', 'desc')
            ->paginate(20);

        $stats = [
            'requested' => DB::table('order_returns')->where('status','requested')->count(),
            'approved'  => DB::table('order_returns')->where('status','approved')->count(),
            'refunded'  => DB::table('order_returns')->where('status','refunded')->count(),
            'total_refunded' => DB::table('order_returns')->where('status','refunded')->sum('refund_amount'),
        ];

        return Inertia::render('Admin/Returns/Index', compact('returns','stats'));
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'status'        => 'required|in:approved,rejected,received,refunded',
            'admin_notes'   => 'nullable|string|max:1000',
            'refund_amount' => 'nullable|numeric|min:0',
            'refund_method' => 'nullable|string|max:50',
        ]);

        $ret   = DB::table('order_returns')->where('id', $id)->first();
        if (!$ret) abort(404);
        $order = Order::find($ret->order_id);

        $updates = array_filter($data) + ['updated_at' => now()];
        if ($data['status'] === 'approved') $updates['approved_at'] = now();
        if ($data['status'] === 'refunded') $updates['refunded_at'] = now();

        DB::table('order_returns')->where('id', $id)->update($updates);

        // Update order refund amount
        if ($data['status'] === 'refunded' && $order) {
            $order->update(['refund_amount' => $data['refund_amount'] ?? $ret->refund_amount, 'payment_status' => 'refunded']);
        }

        // Email customer
        if ($order && $order->customer_email) {
            try {
                $msg = match($data['status']) {
                    'approved' => "Your return request #{$ret->return_number} has been approved. Please send the item back and we'll process your refund.",
                    'rejected' => "Your return request #{$ret->return_number} has been reviewed. Unfortunately it doesn't meet our return criteria. " . ($data['admin_notes'] ?? ''),
                    'refunded' => "Your refund of Rs " . number_format($data['refund_amount'] ?? $ret->refund_amount) . " for return #{$ret->return_number} has been processed.",
                    default    => "Your return request #{$ret->return_number} status: " . $data['status'],
                };
                Mail::raw($msg, fn($m) => $m->to($order->customer_email)->subject("Return #{$ret->return_number} Update"));
            } catch (\Throwable $e) {
                Log::warning("Return email failed: " . $e->getMessage());
            }
        }

        return back()->with('success', "Return {$data['status']}." . ($order && $order->customer_email ? ' Customer emailed.' : ''));
    }
}
