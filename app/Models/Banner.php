<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title','subtitle','link','cta_text','position','is_active','sort_order',
        'badge','image_path','mobile_image_path','video_url','media_type',
    ];

    protected $appends = ['image','mobile_image','video'];

    // Handles all 3 formats a stored path can be in:
    //   - absolute URL with the domain baked in (legacy rows from before this fix)
    //   - root-relative "/uploads/..." (current format — portable across domains)
    //   - bare relative "folder/file.webp" (very old rows, pre-dating asset() usage)
    private static function resolveUrl(?string $path): ?string
    {
        if (!$path) return null;
        if (str_starts_with($path, 'http')) return $path;
        if (str_starts_with($path, '/'))     return $path;
        return asset('uploads/' . $path);
    }

    public function getImageAttribute(): ?string
    {
        return self::resolveUrl($this->image_path);
    }

    public function getMobileImageAttribute(): ?string
    {
        // Use mobile-specific path if set, otherwise fall back to desktop image
        $path = null;
        try {
            $path = $this->mobile_image_path;
        } catch (\Exception $e) {
            // Column may not exist yet if migration hasn't run
        }
        return self::resolveUrl($path ?? $this->image_path);
    }

    public function getVideoAttribute(): ?string
    {
        return self::resolveUrl($this->video_url);
    }
}
