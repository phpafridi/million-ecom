<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{BlockedIp, ActivityLog};
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlockedIpController extends Controller
{
    public function index(Request $request)
    {
        $query = BlockedIp::with('blocker')->latest();

        if ($s = $request->search)
            $query->where('ip_address', 'like', "%{$s}%")
                  ->orWhere('reason', 'like', "%{$s}%");
        if ($request->type && $request->type !== 'all')
            $query->where('type', $request->type);
        if ($request->status === 'active')
            $query->where('is_active', true);
        elseif ($request->status === 'inactive')
            $query->where('is_active', false);

        $ips = $query->paginate(30)->through(fn($b) => [
            'id'         => $b->id,
            'ip'         => $b->ip_address,
            'reason'     => $b->reason,
            'type'       => $b->type,
            'hit_count'  => $b->hit_count,
            'is_active'  => $b->is_active,
            'blocked_by' => $b->blocker?->name ?? 'Auto',
            'expires_at' => $b->expires_at?->format('d M Y H:i') ?? 'Permanent',
            'created_at' => $b->created_at->format('d M Y H:i'),
        ]);

        // Recent suspicious IPs from logs (not yet blocked)
        $suspicious = [];
        if (class_exists(\App\Models\ActivityLog::class)) {
            $suspicious = \App\Models\ActivityLog::where('action', 'login.failed')
                ->where('created_at', '>=', now()->subHour())
                ->selectRaw('ip_address, COUNT(*) as attempts')
                ->groupBy('ip_address')
                ->having('attempts', '>=', 3)
                ->whereNotIn('ip_address', BlockedIp::where('is_active',true)->pluck('ip_address'))
                ->orderByDesc('attempts')
                ->limit(10)
                ->get()
                ->toArray();
        }

        return Inertia::render('Admin/BlockedIps/Index', [
            'ips'        => $ips,
            'suspicious' => $suspicious,
            'stats'      => [
                'total'   => BlockedIp::count(),
                'active'  => BlockedIp::where('is_active',true)->count(),
                'ddos'    => BlockedIp::where('type','ddos')->count(),
                'spam'    => BlockedIp::where('type','spam')->count(),
                'manual'  => BlockedIp::where('type','manual')->count(),
            ],
            'filters'    => $request->only(['search','type','status']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ip'      => 'required|ip',
            'reason'  => 'required|string|max:200',
            'hours'   => 'nullable|integer|min:1',
        ]);
        BlockedIp::block($data['ip'], $data['reason'], 'manual', $data['hours'] ?? null);
        return back()->with('success', "IP {$data['ip']} blocked.");
    }

    public function unblock(string $ip)
    {
        BlockedIp::unblock($ip);
        return back()->with('success', "IP {$ip} unblocked.");
    }

    public function destroy(int $id)
    {
        $b = BlockedIp::findOrFail($id);
        BlockedIp::unblock($b->ip_address);
        $b->delete();
        return back()->with('success', 'IP removed from blocklist.');
    }
}
