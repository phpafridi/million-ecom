<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['product_id','order_id','name','email','rating','title','body','is_approved'];
    protected $casts    = ['is_approved'=>'boolean'];
    public function product() { return $this->belongsTo(Product::class); }
    public function scopeApproved($q) { return $q->where('is_approved', true); }
}
