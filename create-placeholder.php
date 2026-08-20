<?php
// Run once: php create-placeholder.php
$dir = __DIR__ . '/public/images';
if (!is_dir($dir)) mkdir($dir, 0755, true);

$w = 400; $h = 400;
$img = imagecreatetruecolor($w, $h);

$bg    = imagecolorallocate($img, 240, 242, 245);
$box   = imagecolorallocate($img, 210, 215, 225);
$text  = imagecolorallocate($img, 160, 168, 185);
$line  = imagecolorallocate($img, 220, 224, 232);

imagefill($img, 0, 0, $bg);

// Simple image icon
imagefilledrectangle($img, 150, 140, 250, 210, $box);
imagefilledpolygon($img, [150,210, 200,160, 250,210], $box);
imagefilledellipse($img, 228, 158, 28, 28, $box);

// "No Image" text
imagestring($img, 3, 145, 230, 'No Image', $text);

imagejpeg($img, $dir . '/placeholder.jpg', 85);
imagedestroy($img);
echo "Created: public/images/placeholder.jpg\n";
