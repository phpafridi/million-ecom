<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id','user_name','user_role','action','model_type','model_id',
        'description','old_values','new_values','ip_address','user_agent','severity',
    ];
    protected $casts = ['old_values'=>'array','new_values'=>'array'];

    public function user() { return $this->belongsTo(User::class); }

    public static function log(
        string $action,
        string $description = '',
        string $severity = 'info',
        ?Model $model = null,
        array $old = [],
        array $new = []
    ): void {
        try {
            $user = auth()->user();
            static::create([
                'user_id'     => $user?->id,
                'user_name'   => $user?->name ?? 'System',
                'user_role'   => $user?->role ?? 'system',
                'action'      => $action,
                'model_type'  => $model ? class_basename($model) : null,
                'model_id'    => $model?->id,
                'description' => $description,
                'old_values'  => $old ?: null,
                'new_values'  => $new ?: null,
                'ip_address'  => Request::ip(),
                'user_agent'  => substr(Request::userAgent() ?? '', 0, 200),
                'severity'    => $severity,
            ]);
        } catch (\Throwable $e) {}
    }

    public static function suspicious(string $ip): bool
    {
        return static::where('ip_address', $ip)
            ->where('action', 'login.failed')
            ->where('created_at', '>=', now()->subMinutes(30))
            ->count() >= 10;
    }

    public function scopeRecent($q) { return $q->latest(); }
    public function scopeDanger($q) { return $q->where('severity','danger'); }
}
