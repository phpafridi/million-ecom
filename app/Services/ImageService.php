<?php
namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

/**
 * ImageService — Smart image processing with auto-crop
 * Uses GD (built-in PHP) — no extra packages needed
 *
 * Crop modes:
 *   'cover'   — fill exact dimensions, crop center (like CSS object-fit:cover)
 *   'contain' — fit inside dimensions, pad with bg color
 *   'free'    — just resize proportionally, no crop
 *   'square'  — force square crop from center
 */
class ImageService
{
    // ── Presets for each upload type ─────────────────────────────────
    public static array $presets = [
        'logo'      => ['w' => 400,  'h' => 120,  'mode' => 'contain', 'bg' => [255,255,255,0], 'quality' => 95],
        'favicon'   => ['w' => 64,   'h' => 64,   'mode' => 'cover',   'bg' => [255,255,255,0], 'quality' => 95],
        'og_image'  => ['w' => 1200, 'h' => 630,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 88],
        'banner'    => ['w' => 1400, 'h' => 560,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 85],
        'hero'      => ['w' => 1920, 'h' => 820,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 82],
        'product'   => ['w' => 800,  'h' => 1067, 'mode' => 'cover',   'bg' => [245,245,245],   'quality' => 88], // 3:4 ratio
        'category'  => ['w' => 600,  'h' => 400,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 85],
        'avatar'    => ['w' => 200,  'h' => 200,  'mode' => 'square',  'bg' => [245,245,245],   'quality' => 90],
        'thumbnail' => ['w' => 300,  'h' => 400,  'mode' => 'cover',   'bg' => [245,245,245],   'quality' => 82],
        'promo'     => ['w' => 800,  'h' => 800,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 85],
    ];

    /**
     * Process and save uploaded image with auto-crop
     *
     * @param  UploadedFile  $file     Uploaded file
     * @param  string        $folder   Storage subfolder (e.g. 'products', 'seo')
     * @param  string        $preset   Key from $presets array
     * @param  string|null   $filename Optional custom filename (without extension)
     * @return string                  Public URL of saved image
     */
    public static function process(
        UploadedFile $file,
        string $folder,
        string $preset = 'product',
        ?string $filename = null
    ): string {
        $p         = self::$presets[$preset] ?? self::$presets['product'];
        $targetW   = $p['w'];
        $targetH   = $p['h'];
        $mode      = $p['mode'];
        $bg        = $p['bg'];
        $quality   = $p['quality'];

        // Load source image
        $src = self::loadImage($file->getRealPath(), $file->getMimeType());
        if (!$src) {
            // Fallback: just store original
            $path = $file->store($folder, 'uploads');
            return asset('uploads/' . $path);
        }

        $srcW = imagesx($src);
        $srcH = imagesy($src);

        // Process based on mode
        $dst = match($mode) {
            'cover'  => self::cropCover($src, $srcW, $srcH, $targetW, $targetH),
            'square' => self::cropCover($src, $srcW, $srcH, $targetW, $targetW),
            'contain'=> self::cropContain($src, $srcW, $srcH, $targetW, $targetH, $bg),
            default  => self::resizeFree($src, $srcW, $srcH, $targetW, $targetH),
        };

        imagedestroy($src);

        // Save as WebP first, fallback to JPEG/PNG
        $name     = ($filename ?? uniqid('img_')) . '.webp';
        $dir      = public_path('uploads/' . $folder);
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $fullPath = $dir . '/' . $name;

        if (function_exists('imagewebp')) {
            imagewebp($dst, $fullPath, $quality);
        } else {
            // Fallback to JPEG
            $name     = ($filename ?? uniqid('img_')) . '.jpg';
            $fullPath = $dir . '/' . $name;
            imagejpeg($dst, $fullPath, $quality);
        }

        imagedestroy($dst);

        return rtrim(config('app.url'), '/') . '/uploads/' . $folder . '/' . $name;
    }

    // ── Cover crop (fill & crop center) ──────────────────────────────
    private static function cropCover($src, int $srcW, int $srcH, int $dstW, int $dstH): \GdImage
    {
        $dst = imagecreatetruecolor($dstW, $dstH);
        self::enableAlpha($dst);

        $srcRatio = $srcW / $srcH;
        $dstRatio = $dstW / $dstH;

        if ($srcRatio > $dstRatio) {
            // Source is wider — crop sides
            $cropH = $srcH;
            $cropW = (int) round($srcH * $dstRatio);
            $cropX = (int) round(($srcW - $cropW) / 2);
            $cropY = 0;
        } else {
            // Source is taller — crop top/bottom
            $cropW = $srcW;
            $cropH = (int) round($srcW / $dstRatio);
            $cropX = 0;
            $cropY = (int) round(($srcH - $cropH) / 3); // Bias toward top (faces)
        }

        imagecopyresampled($dst, $src, 0, 0, $cropX, $cropY, $dstW, $dstH, $cropW, $cropH);
        return $dst;
    }

    // ── Contain (fit inside, pad background) ─────────────────────────
    private static function cropContain($src, int $srcW, int $srcH, int $dstW, int $dstH, array $bg): \GdImage
    {
        $dst = imagecreatetruecolor($dstW, $dstH);
        self::enableAlpha($dst);

        // Fill background
        if (count($bg) === 4) {
            $color = imagecolorallocatealpha($dst, $bg[0], $bg[1], $bg[2], 127);
        } else {
            $color = imagecolorallocate($dst, $bg[0] ?? 255, $bg[1] ?? 255, $bg[2] ?? 255);
        }
        imagefill($dst, 0, 0, $color);

        // Calculate scaled size
        $scale = min($dstW / $srcW, $dstH / $srcH);
        $newW  = (int) round($srcW * $scale);
        $newH  = (int) round($srcH * $scale);
        $offX  = (int) round(($dstW - $newW) / 2);
        $offY  = (int) round(($dstH - $newH) / 2);

        imagecopyresampled($dst, $src, $offX, $offY, 0, 0, $newW, $newH, $srcW, $srcH);
        return $dst;
    }

    // ── Free resize (proportional) ────────────────────────────────────
    private static function resizeFree($src, int $srcW, int $srcH, int $maxW, int $maxH): \GdImage
    {
        $scale = min($maxW / $srcW, $maxH / $srcH, 1);
        $newW  = (int) round($srcW * $scale);
        $newH  = (int) round($srcH * $scale);
        $dst   = imagecreatetruecolor($newW, $newH);
        self::enableAlpha($dst);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $srcW, $srcH);
        return $dst;
    }

    // ── Load image from path ──────────────────────────────────────────
    private static function loadImage(string $path, string $mime): ?\GdImage
    {
        try {
            return match(true) {
                str_contains($mime, 'jpeg') => imagecreatefromjpeg($path),
                str_contains($mime, 'png')  => imagecreatefrompng($path),
                str_contains($mime, 'webp') => imagecreatefromwebp($path),
                str_contains($mime, 'gif')  => imagecreatefromgif($path),
                default => null,
            };
        } catch (\Throwable $e) {
            Log::warning('ImageService: Could not load image — ' . $e->getMessage());
            return null;
        }
    }

    // ── Enable alpha/transparency on GD image ─────────────────────────
    private static function enableAlpha(\GdImage $img): void
    {
        imagealphablending($img, false);
        imagesavealpha($img, true);
    }

    // ── Quick helper — process or just store ─────────────────────────
    public static function store(UploadedFile $file, string $folder, string $preset = 'product'): string
    {
        return self::process($file, $folder, $preset);
    }
}
