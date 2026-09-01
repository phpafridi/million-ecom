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
            ->when($request->status, fn($q)=>$q->where('support_tickets.status',$request->status))
            ->when($request->search, fn($q)=>$q->where(fn($q2)=>$q2->where('support_tickets.subject','like',"%{$request->search}%")->orWhere('support_tickets.email','like',"%{$request->search}%")))
            ->orderByRaw("FIELD(support_tickets.priority,'urgent','high','normal','low')")
            ->orderBy('support_tickets.created_at','desc')
            ->paginate(20);

        // One query for all 4 counts instead of 4 separate COUNT queries.
        $counts = DB::table('support_tickets')
            ->selectRaw("
                SUM(status = 'open') as open,
                SUM(status = 'in_progress') as in_progress,
                SUM(status = 'resolved') as resolved,
                SUM(priority = 'urgent' AND status != 'closed') as urgent
            ")->first();

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'staff'   => User::where(fn($q)=>$q->where('role','admin')->orWhere('is_staff',true))->get(['id','name']),
            'stats'   => [
                'open'        => (int) ($counts->open        ?? 0),
                'in_progress' => (int) ($counts->in_progress ?? 0),
                'resolved'    => (int) ($counts->resolved    ?? 0),
                'urgent'      => (int) ($counts->urgent      ?? 0),
            ],
        ]);
    }

    public function show(int $id)
    {
        $ticket  = DB::table('support_tickets')->where('id',$id)->first(); if (!$ticket) abort(404);
        $replies = DB::table('support_ticket_replies')->leftJoin('users','support_ticket_replies.user_id','=','users.id')->select('support_ticket_replies.*','users.name as replier_name')->where('ticket_id',$id)->orderBy('created_at')->get();
        return Inertia::render('Admin/Support/Show', ['ticket'=>$ticket,'replies'=>$replies,'staff'=>User::where(fn($q)=>$q->where('role','admin')->orWhere('is_staff',true))->get(['id','name'])]);
    }

    public function reply(Request $request, int $id)
    {
        $data   = $request->validate(['message'=>'required|string|max:5000']);
        $ticket = DB::table('support_tickets')->where('id',$id)->first(); if (!$ticket) abort(404);
        DB::table('support_ticket_replies')->insert(['ticket_id'=>$id,'user_id'=>auth()->id(),'message'=>$data['message'],'is_staff'=>true,'created_at'=>now(),'updated_at'=>now()]);
        if ($ticket->status === 'open') DB::table('support_tickets')->where('id',$id)->update(['status'=>'in_progress','updated_at'=>now()]);
        \App\Jobs\SendSupportReplyEmail::dispatch(
            $ticket->email, $ticket->name, $ticket->subject, $ticket->ticket_number,
            $data['message'], Setting::get('site_name', 'MILLIONAIRE')
        );
        return back()->with('success','Reply sent.');
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate(['status'=>'sometimes|in:open,in_progress,resolved,closed','priority'=>'sometimes|in:low,normal,high,urgent','assigned_to'=>'sometimes|nullable|integer']);
        if (($data['status']??'') === 'resolved') $data['resolved_at'] = now();
        DB::table('support_tickets')->where('id',$id)->update($data + ['updated_at'=>now()]);
        return back()->with('success','Ticket updated.');
    }
}
