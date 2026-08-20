<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['email','name','token','is_active','subscribed_at','unsubscribed_at'];

    protected $casts = [
        'is_active'        => 'boolean',
        'subscribed_at'    => 'datetime',
        'unsubscribed_at'  => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->token = Str::random(64);
            $model->subscribed_at = now();
        });
    }
}
