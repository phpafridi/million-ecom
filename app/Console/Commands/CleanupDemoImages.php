<?php
namespace App\Console\Commands;

use App\Models\{Category, Product, ProductImage, HeroSlide};
use Illuminate\Console\Command;

class CleanupDemoImages extends Command
{
    protected $signature = 'demo:clear-images';
    protected $description = 'Removes any seeded placeholder images (picsum.photos or placehold.co) from categories/products, plus resets hero slide images so re-seeding fetches fresh Unsplash photos with the current search terms.';

    public function handle(): int
    {
        $catCount = Category::where(function ($q) {
                $q->where('image', 'like', '%picsum.photos%')
                  ->orWhere('image', 'like', '%placehold.co%')
                  ->orWhere('mobile_image', 'like', '%picsum.photos%')
                  ->orWhere('mobile_image', 'like', '%placehold.co%')
                  ->orWhere('banner_image', 'like', '%picsum.photos%')
                  ->orWhere('banner_image', 'like', '%placehold.co%')
                  ->orWhere('mobile_banner_image', 'like', '%picsum.photos%')
                  ->orWhere('mobile_banner_image', 'like', '%placehold.co%');
            })
            ->update([
                'image' => null, 'mobile_image' => null,
                'banner_image' => null, 'mobile_banner_image' => null,
            ]);

        $imgCount = ProductImage::where('path', 'like', '%picsum.photos%')
            ->orWhere('path', 'like', '%placehold.co%')
            ->delete();

        // Hero slides re-fetch based on whether image_path is already
        // set — resetting it to null here means the next
        // HeroSlideSeeder run re-fetches with whatever search terms are
        // currently in the seeder, instead of skipping because *some*
        // image (possibly a non-unique one) already exists.
        $heroCount = HeroSlide::whereNotNull('image_path')->update(['image_path' => null]);

        $this->info("Cleared images on {$catCount} categories, deleted {$imgCount} product images, reset {$heroCount} hero slides.");
        $this->line('Nothing except image fields was touched — re-run your seeders to fetch fresh photos.');

        return self::SUCCESS;
    }
}
