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
    // Converts a stored image path (in any of the 3 legacy/current formats — full
    // URL, root-relative "/uploads/...", or bare "folder/file.webp") into the
    // relative path the 'uploads' disk actually expects for delete()/exists() calls.
    // Returns null for absolute external URLs, which aren't files we manage.
    public static function diskPath(?string $stored): ?string
    {
        if (!$stored) return null;
        if (str_starts_with($stored, 'http')) {
            // Only usable if it's our own uploads URL, not some external image
            if (!str_contains($stored, '/uploads/')) return null;
            $stored = '/uploads/' . explode('/uploads/', $stored, 2)[1];
        }
        if (str_starts_with($stored, '/uploads/')) return substr($stored, 9);
        return $stored; // already bare-relative
    }

    // ── Presets for each upload type ─────────────────────────────────
    public static array $presets = [
        'logo'      => ['w' => 400,  'h' => 120,  'mode' => 'free',    'bg' => [255,255,255,0], 'quality' => 95, 'trim' => true],
        'favicon'   => ['w' => 64,   'h' => 64,   'mode' => 'cover',   'bg' => [255,255,255,0], 'quality' => 95, 'trim' => true],
        'og_image'  => ['w' => 1200, 'h' => 630,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 88],
        'banner'    => ['w' => 1400, 'h' => 560,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 85],
        // Position-specific banner presets — must match the actual container shape each
        // slot renders at on the storefront (see resources/js/Pages/Home.tsx "BANNER GRID").
        'banner_promo' => ['w' => 1080, 'h' => 1080, 'mode' => 'cover', 'bg' => [10,10,10], 'quality' => 88, 'smart_crop' => true], // square master — desktop shows it portrait-cropped, mobile shows it landscape-cropped
        'banner_sm'    => ['w' => 900,  'h' => 540,  'mode' => 'cover', 'bg' => [10,10,10], 'quality' => 85, 'smart_crop' => true],
        'banner_wide'  => ['w' => 1600, 'h' => 450,  'mode' => 'cover', 'bg' => [10,10,10], 'quality' => 85, 'smart_crop' => true],
        'banner_full'  => ['w' => 1920, 'h' => 520,  'mode' => 'cover', 'bg' => [10,10,10], 'quality' => 85, 'smart_crop' => true],
        'hero'      => ['w' => 1920, 'h' => 820,  'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 82, 'smart_crop' => true],
        'product'   => ['w' => 800,  'h' => 1067, 'mode' => 'cover',   'bg' => [245,245,245],   'quality' => 88], // 3:4 ratio
        'category'  => ['w' => 900,  'h' => 1080, 'mode' => 'cover',   'bg' => [10,10,10],      'quality' => 85, 'smart_crop' => true],
        'category_banner' => ['w' => 1920, 'h' => 380, 'mode' => 'cover', 'bg' => [10,10,10],   'quality' => 85, 'smart_crop' => true],
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
            return '/uploads/' . $path;
        }

        $srcW = imagesx($src);
        $srcH = imagesy($src);

        // Auto-trim transparent padding around the actual artwork.
        // Prevents logos/icons that were exported on an oversized transparent
        // canvas from rendering tiny once fitted into their target box.
        if (!empty($p['trim'])) {
            $trimmed = self::trimTransparent($src, $srcW, $srcH);
            if ($trimmed) {
                imagedestroy($src);
                [$src, $srcW, $srcH] = $trimmed;
            }
        }

        // Process based on mode
        $fx = 0.5; $fy = 1/3; // matches the previous fixed top-bias default
        if (!empty($p['smart_crop']) && in_array($mode, ['cover', 'square'], true)) {
            [$fx, $fy] = self::smartCropCenter($src, $srcW, $srcH);
        }

        $dst = match($mode) {
            'cover'  => self::cropCover($src, $srcW, $srcH, $targetW, $targetH, $fx, $fy),
            'square' => self::cropCover($src, $srcW, $srcH, $targetW, $targetW, $fx, $fy),
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

        // Store a domain-free, root-relative path — never bake the current APP_URL
        // into the database. This is critical: dev runs on 127.0.0.1:8000, production
        // runs on a real domain, and every browser resolves "/uploads/..." correctly
        // against whatever origin it's actually loaded from, with zero migration
        // needed when you move environments.
        return '/uploads/' . $folder . '/' . $name;
    }

    // ── Cover crop (fill & crop, biased toward the detected subject) ──
    // $fx/$fy (0..1) shift the crop window toward wherever the "busiest" part of
    // the image is, instead of always cutting from dead-center. Falls back to
    // plain center-crop when $fx/$fy are left at their 0.5 default.
    private static function cropCover($src, int $srcW, int $srcH, int $dstW, int $dstH, float $fx = 0.5, float $fy = 0.5): \GdImage
    {
        $dst = imagecreatetruecolor($dstW, $dstH);
        self::enableAlpha($dst);

        $srcRatio = $srcW / $srcH;
        $dstRatio = $dstW / $dstH;

        if ($srcRatio > $dstRatio) {
            // Source is wider — crop sides, keep full height
            $cropH = $srcH;
            $cropW = (int) round($srcH * $dstRatio);
            $cropX = (int) round(($srcW - $cropW) * $fx);
            $cropY = 0;
        } else {
            // Source is taller — crop top/bottom, keep full width
            $cropW = $srcW;
            $cropH = (int) round($srcW / $dstRatio);
            $cropX = 0;
            $cropY = (int) round(($srcH - $cropH) * $fy);
        }

        imagecopyresampled($dst, $src, 0, 0, $cropX, $cropY, $dstW, $dstH, $cropW, $cropH);
        return $dst;
    }

    // ── Smart-crop centroid detection ──────────────────────────────────
    // Finds where the actual "content" of the photo is (the product, not the
    // plain background around it) so cropCover can cut around it instead of
    // blindly slicing from the middle of the frame.
    //
    // How it works: downsamples the image to a small grid, then for each cell
    // measures how much its brightness differs from its neighbours (a cheap
    // stand-in for "edges/detail"). A flat background scores near zero; the
    // product's outline, text, and shading score high. The weighted average
    // position of that detail becomes the crop center. If the whole image is
    // roughly uniform (no clear subject), it safely falls back to dead-center.
    private static function smartCropCenter($src, int $srcW, int $srcH): array
    {
        $gridW = 24; $gridH = 24;
        $small = imagecreatetruecolor($gridW, $gridH);
        imagecopyresampled($small, $src, 0, 0, 0, 0, $gridW, $gridH, $srcW, $srcH);

        $bright = [];
        for ($y = 0; $y < $gridH; $y++) {
            for ($x = 0; $x < $gridW; $x++) {
                $rgb = imagecolorat($small, $x, $y);
                $r = ($rgb >> 16) & 0xFF; $g = ($rgb >> 8) & 0xFF; $b = $rgb & 0xFF;
                $bright[$y][$x] = 0.299 * $r + 0.587 * $g + 0.114 * $b;
            }
        }
        imagedestroy($small);

        $cx0 = $gridW / 2; $cy0 = $gridH / 2;
        $maxDist = sqrt($cx0 * $cx0 + $cy0 * $cy0);

        $totalW = 0.0; $sumX = 0.0; $sumY = 0.0;
        for ($y = 1; $y < $gridH - 1; $y++) {
            for ($x = 1; $x < $gridW - 1; $x++) {
                $c = $bright[$y][$x];
                $edge = abs($c - $bright[$y][$x - 1]) + abs($c - $bright[$y][$x + 1])
                      + abs($c - $bright[$y - 1][$x]) + abs($c - $bright[$y + 1][$x]);

                // Products/subjects are usually placed centrally by whoever shot or
                // designed the image; stray high-contrast detail near the edges
                // (a caption, a corner label) is far more often background clutter
                // than the actual subject. Down-weight detail the further it sits
                // from the middle, so the crop favors the center of interest rather
                // than whatever happens to have the sharpest edges anywhere in frame.
                $d = sqrt(($x - $cx0) ** 2 + ($y - $cy0) ** 2) / $maxDist;
                $centerBias = (1 - $d) ** 2.2;

                $w = $edge * $centerBias;
                $totalW += $w;
                $sumX   += $w * $x;
                $sumY   += $w * $y;
            }
        }

        // Not enough detail anywhere (near-blank image) — plain center is safest.
        if ($totalW < 50) return [0.5, 0.5];

        $fx = $sumX / $totalW / $gridW;
        $fy = $sumY / $totalW / $gridH;

        // Keep the bias gentle and clamped — this should nudge the crop toward
        // the subject, not swing to an extreme edge from one stray highlight.
        $fx = max(0.15, min(0.85, $fx));
        $fy = max(0.1, min(0.8, $fy));

        return [$fx, $fy];
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

    // ── Trim transparent padding around the visible artwork ──────────
    // Scans the alpha channel to find the bounding box of non-transparent
    // pixels, then crops to that box (with a small breathing margin).
    // Returns [GdImage, width, height] or null if nothing to trim.
    private static function trimTransparent($src, int $srcW, int $srcH): ?array
    {
        // Only meaningful for images that actually have an alpha channel
        $minX = $srcW; $minY = $srcH; $maxX = -1; $maxY = -1;

        // Sample on a grid for speed on large images, refine with full scan on small ones
        $stepX = max(1, (int) floor($srcW / 400));
        $stepY = max(1, (int) floor($srcH / 400));

        for ($y = 0; $y < $srcH; $y += $stepY) {
            for ($x = 0; $x < $srcW; $x += $stepX) {
                $rgba  = imagecolorat($src, $x, $y);
                $alpha = ($rgba >> 24) & 0x7F; // 0 = opaque, 127 = fully transparent
                if ($alpha < 120) { // treat near-opaque as content
                    if ($x < $minX) $minX = $x;
                    if ($y < $minY) $minY = $y;
                    if ($x > $maxX) $maxX = $x;
                    if ($y > $maxY) $maxY = $y;
                }
            }
        }

        // Nothing opaque found, or content already fills the canvas — skip
        if ($maxX < 0 || $maxY < 0) return null;

        $contentW = $maxX - $minX + 1;
        $contentH = $maxY - $minY + 1;

        // If content already fills ~90%+ of the canvas, trimming won't help — skip
        if ($contentW / $srcW > 0.9 && $contentH / $srcH > 0.9) return null;

        // Add ~6% breathing margin around the detected content
        $marginX = (int) round($contentW * 0.06);
        $marginY = (int) round($contentH * 0.06);
        $cropX   = max(0, $minX - $marginX);
        $cropY   = max(0, $minY - $marginY);
        $cropW   = min($srcW - $cropX, $contentW + $marginX * 2);
        $cropH   = min($srcH - $cropY, $contentH + $marginY * 2);

        $trimmed = imagecreatetruecolor($cropW, $cropH);
        self::enableAlpha($trimmed);
        $transparent = imagecolorallocatealpha($trimmed, 0, 0, 0, 127);
        imagefill($trimmed, 0, 0, $transparent);
        imagecopy($trimmed, $src, 0, 0, $cropX, $cropY, $cropW, $cropH);

        return [$trimmed, $cropW, $cropH];
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
