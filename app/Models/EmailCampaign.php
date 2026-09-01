<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EmailCampaign extends Model
{
    protected $fillable = ['name', 'subject', 'body', 'status', 'sent_count', 'sent_at'];
    protected $casts    = ['sent_at' => 'datetime'];
}
