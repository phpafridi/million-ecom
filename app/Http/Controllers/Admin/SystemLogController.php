<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::latest();

        if ($request->severity && $request->severity !== 'all')
            $query->where('severity', $request->severity);
        if ($request->action)
            $query->where('action', 'like', '%' . $request->action . '%');
        if ($request->user)
            $query->where('user_name', 'like', '%' . $request->user . '%');
        if ($request->from)
            $query->whereDate('created_at', '>=', $request->from);
        if ($request->to)
            $query->whereDate('created_at', '<=', $request->to);

        $logs = $query->paginate(50)->through(fn($l) => [
            'id'          => $l->id,
            'user_name'   => $l->user_name,
            'user_role'   => $l->user_role,
            'action'      => $l->action,
            'model_type'  => $l->model_type,
            'model_id'    => $l->model_id,
            'description' => $l->description,
            'old_values'  => $l->old_values,
            'new_values'  => $l->new_values,
            'ip_address'  => $l->ip_address,
            'severity'    => $l->severity,
            'created_at'  => $l->created_at->format('d M Y, h:i A'),
        ]);

        // Suspicious IPs (10+ failed logins in 30 min)
        $suspicious = ActivityLog::where('action', 'login.failed')
            ->where('created_at', '>=', now()->subMinutes(30))
            ->selectRaw('ip_address, COUNT(*) as attempts')
            ->groupBy('ip_address')
            ->having('attempts', '>=', 5)
            ->orderByDesc('attempts')
            ->get();

        // 2 queries instead of 5 — one for the all-time total (different
        // date range than the rest, can't combine), one for everything
        // scoped to the last 24 hours.
        $total      = ActivityLog::count();
        $todayStats = ActivityLog::where('created_at', '>=', now()->subDay())
            ->selectRaw("
                SUM(severity = 'danger') as danger,
                SUM(severity = 'warning') as warnings,
                SUM(action = 'login.success') as logins,
                SUM(action = 'login.failed') as failed_logins
            ")->first();

        $stats = [
            'total'         => $total,
            'danger'        => (int) ($todayStats->danger        ?? 0),
            'warnings'      => (int) ($todayStats->warnings      ?? 0),
            'logins'        => (int) ($todayStats->logins        ?? 0),
            'failed_logins' => (int) ($todayStats->failed_logins ?? 0),
        ];

        return Inertia::render('Admin/SystemLogs/Index', [
            'logs'       => $logs,
            'suspicious' => $suspicious,
            'stats'      => $stats,
            'filters'    => $request->only(['severity','action','user','from','to']),
        ]);
    }

    public function clear(Request $request)
    {
        $days = (int)($request->days ?? 30);
        $count = ActivityLog::where('created_at', '<', now()->subDays($days))->delete();
        ActivityLog::log('logs.cleared', "Cleared {$count} logs older than {$days} days", 'warning');
        return back()->with('success', "Cleared {$count} log entries older than {$days} days.");
    }
}
