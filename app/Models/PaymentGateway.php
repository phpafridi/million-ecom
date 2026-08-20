<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'code','name','region','is_enabled','is_test_mode',
        'credentials','config','logo','instructions','sort_order'
    ];
    protected $casts = [
        'is_enabled'   => 'boolean',
        'is_test_mode' => 'boolean',
        'credentials'  => 'array',
        'config'       => 'array',
    ];
    public function scopeEnabled($q) { return $q->where('is_enabled', true); }
}
