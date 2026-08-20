<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title','subtitle','cta_text','link','position',
        'image_path','video_url','is_active'
    ];

    protected $casts    = ['is_active' => 'boolean'];
    protected $appends  = ['image','video'];

    // ── Image URL accessor ────────────────────────────────────────────
    public function getImageAttribute(): ?string
    {
        if (!$this->image_path) return null;
        if (str_starts_with($this->image_path, 'http')) return $this->image_path;
        return asset('uploads/' . $this->image_path);
    }

    // ── Video URL accessor ────────────────────────────────────────────
    public function getVideoAttribute(): ?string
    {
        if (!$this->video_url) return null;
        if (str_starts_with($this->video_url, 'http')) return $this->video_url;
        return asset('uploads/' . $this->video_url);
    }
}
