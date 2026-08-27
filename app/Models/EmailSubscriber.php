<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EmailSubscriber extends Model
{
    protected $table = 'email_subscribers';
    protected $fillable = ['email','name','source','is_active','subscribed_at'];
    protected $casts    = ['is_active' => 'boolean'];
}
