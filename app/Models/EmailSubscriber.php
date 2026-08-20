<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EmailSubscriber extends Model
{
    protected $fillable = ['email','name','source','is_active'];
    protected $casts    = ['is_active' => 'boolean'];
}
