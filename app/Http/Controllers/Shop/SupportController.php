<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail};
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/Support', [
            'settings' => Setting::allKeyed(),
            'orders'   => auth()->check() ? DB::table('orders')->where('user_id', auth()->id())->select('id','status','created_at')->latest()->take(10)->get() : [],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|max:150',
            'phone'    => 'nullable|string|max:20',
            'order_id' => 'nullable|integer',
            'subject'  => 'required|string|max:150',
            'message'  => 'required|string|max:3000',
            'priority' => 'nullable|in:low,normal,high',
        ]);

        $tn = 'TKT-' . strtoupper(substr(md5(uniqid()), 0, 8));
        DB::table('support_tickets')->insert([
            'user_id'       => auth()->id(),
            'ticket_number' => $tn,
            'name'          => $data['name'],
            'email'         => $data['email'],
            'phone'         => $data['phone'] ?? null,
            'order_id'      => $data['order_id'] ?? null,
            'subject'       => $data['subject'],
            'message'       => $data['message'],
            'status'        => 'open',
            'priority'      => $data['priority'] ?? 'normal',
            'created_at'    => now(), 'updated_at' => now(),
        ]);

        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        \App\Jobs\SendSupportTicketConfirmation::dispatch(
            $data['email'], $data['name'], $tn, $data['subject'], $siteName
        );

        return back()->with('success', "Ticket #{$tn} created! We'll reply within 24 hours.");
    }

    public function myTickets()
    {
        return Inertia::render('Shop/MyTickets', [
            'tickets'  => DB::table('support_tickets')->where('user_id', auth()->id())->orderBy('created_at', 'desc')->get(),
            'settings' => Setting::allKeyed(),
        ]);
    }
}
