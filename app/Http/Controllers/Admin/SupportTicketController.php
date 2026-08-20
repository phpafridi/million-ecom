<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail};
use Inertia\Inertia;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        $tickets = DB::table('support_tickets')
            ->leftJoin('users','support_tickets.user_id','=','users.id')
            ->leftJoin('users as assignee','support_tickets.assigned_to','=','assignee.id')
            ->select('support_tickets.*','users.name as customer_name','assignee.name as assignee_name')
            ->when($request->status, fn($q) => $q->where('support_tickets.status',$request->status))
            ->when($request->search,  fn($q) => $q->where(fn($q2) => $q2->where('support_tickets.subject','like',"%{$request->search}%")->orWhere('support_tickets.email','like',"%{$request->search}%")))
            ->orderByRaw("FIELD(support_tickets.priority,'urgent','high','normal','low')")
            ->orderBy('support_tickets.created_at','desc')
            ->paginate(20);
        $staff = User::where(fn($q) => $q->where('role','admin')->orWhere('is_staff',true))->get(['id','name']);
        return Inertia::render('Admin/Support/Index',['tickets'=>$tickets,'staff'=>$staff,'stats'=>['open'=>DB::table('support_tickets')->where('status','open')->count(),'in_progress'=>DB::table('support_tickets')->where('status','in_progress')->count(),'resolved'=>DB::table('support_tickets')->where('status','resolved')->count(),'urgent'=>DB::table('support_tickets')->where('priority','urgent')->where('status','!=','closed')->count()]]);
    }

    public function show(int $id)
    {
        $ticket  = DB::table('support_tickets')->where('id',$id)->first(); if (!$ticket) abort(404);
        $replies = DB::table('support_ticket_replies')->leftJoin('users','support_ticket_replies.user_id','=','users.id')->select('support_ticket_replies.*','users.name as replier_name')->where('ticket_id',$id)->orderBy('created_at')->get();
        $staff   = User::where(fn($q) => $q->where('role','admin')->orWhere('is_staff',true))->get(['id','name']);
        return Inertia::render('Admin/Support/Show',compact('ticket','replies','staff'));
    }

    public function reply(Request $request, int $id)
    {
        $data   = $request->validate(['message'=>'required|string|max:5000']);
        $ticket = DB::table('support_tickets')->where('id',$id)->first(); if (!$ticket) abort(404);
        DB::table('support_ticket_replies')->insert(['ticket_id'=>$id,'user_id'=>auth()->id(),'message'=>$data['message'],'is_staff'=>true,'created_at'=>now(),'updated_at'=>now()]);
        if ($ticket->status === 'open') DB::table('support_tickets')->where('id',$id)->update(['status'=>'in_progress']);
        try { Mail::raw("Hi {$ticket->name},\n\nYou have a reply to ticket #{$ticket->ticket_number}:\n\n{$data['message']}\n\n— " . Setting::get('site_name','MILLIONAIRE') . " Support", fn($m) => $m->to($ticket->email)->subject("Re: {$ticket->subject} [#{$ticket->ticket_number}]")); } catch (\Throwable $e) {}
        return back()->with('success','Reply sent to customer.');
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate(['status'=>'sometimes|in:open,in_progress,resolved,closed','priority'=>'sometimes|in:low,normal,high,urgent','assigned_to'=>'sometimes|nullable|integer']);
        $updates = $data;
        if (($data['status']??'') === 'resolved') $updates['resolved_at'] = now();
        DB::table('support_tickets')->where('id',$id)->update($updates + ['updated_at'=>now()]);
        return back()->with('success','Ticket updated.');
    }
}
