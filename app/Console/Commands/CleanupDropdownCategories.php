<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;

class CleanupDropdownCategories extends Command
{
    protected $signature = 'categories:cleanup-dropdown';
    protected $description = 'Remove 3rd-level category items that were only used by the now-removed mega-menu dropdown, keeping Accessories items intact since those power the homepage carousel.';

    public function handle(): void
    {
        // 3rd-level = has a parent, and that parent ALSO has a parent
        // (top-level -> subcategory -> this item).
        $deepItems = Category::whereNotNull('parent_id')
            ->whereHas('parent', fn($q) => $q->whereNotNull('parent_id'))
            ->with('parent')
            ->get();

        $removed = 0;
        $kept    = 0;

        foreach ($deepItems as $item) {
            $parentName = $item->parent->name ?? '';
            if (str_contains(strtolower($parentName), 'accessories')) {
                $kept++;
                continue;
            }
            $this->line("Removing: {$item->name} (under {$parentName})");
            $item->delete();
            $removed++;
        }

        $this->info("Done. Removed {$removed} dropdown items, kept {$kept} Accessories items.");
    }
}
