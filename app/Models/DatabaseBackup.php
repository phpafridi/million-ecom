<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DatabaseBackup extends Model
{
    protected $fillable = ['filename','path','size','status','created_by','notes'];
    public function creator() { return $this->belongsTo(User::class, 'created_by'); }
    public function getSizeFormattedAttribute(): string
    {
        $b = $this->size;
        if ($b < 1024) return "{$b} B";
        if ($b < 1048576) return round($b/1024,1) . " KB";
        return round($b/1048576,1) . " MB";
    }
}
