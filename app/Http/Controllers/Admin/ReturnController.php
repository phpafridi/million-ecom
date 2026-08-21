<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail, Log};
use Inertia\Inertia;

class ReturnController extends Controller
{
    public function index()
    {
        $returns = DB::table('order_returns')
            ->join('orders','order_returns.order_id','=','orders.id')
            ->select('order_returns.*','orders.customer_name','orders.customer_email','orders.customer_phone','orders.total as order_total','orders.status as order_status')
            ->orderByRaw("FIELD(order_returns.status,'requested','approved','received','refunded','rejected')")
            ->orderBy('order_returns.created_at','desc')
            ->paginate(20);

        return Inertia::render('Admin/Returns/Index', [
            'returns' => $returns,
            'stats'   => ['requested'=>DB::table('order_returns')->where('status','requested')->count(),'approved'=>DB::table('order_returns')->where('status','approved')->count(),'refunded'=>DB::table('order_returns')->where('status','refunded')->count(),'total_refunded'=>(float)DB::table('order_returns')->where('status','refunded')->sum('refund_amount')],
        ]);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate(['status'=>'required|in:approved,rejected,received,refunded','admin_notes'=>'nullable|string|max:1000','refund_amount'=>'nullable|numeric|min:0']);
        $ret  = DB::table('order_returns')->where('id',$id)->first(); if (!$ret) abort(404);
        $upd  = array_filter(['status'=>$data['status'],'admin_notes'=>$data['admin_notes']??null,'refund_amount'=>$data['refund_amount']??null,'updated_at'=>now(),'approved_at'=>$data['status']==='approved'?now():null,'refunded_at'=>$data['status']==='refunded'?now():null]);
        DB::table('order_returns')->where('id',$id)->update($upd);
        $order = Order::find($ret->order_id);
        if ($order && $order->customer_email) {
            try { Mail::raw("Your return #{$ret->return_number} status: {$data['status']}." . ($data['admin_notes'] ? "\n\nNote: {$data['admin_notes']}" : ''), fn($m)=>$m->to($order->customer_email)->subject("Return #{$ret->return_number} Update")); } catch (\Throwable $e) { Log::warning($e->getMessage()); }
        }
        return back()->with('success','Return updated. Customer emailed.');
    }
}
