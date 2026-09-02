<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// The actual root cause of the color/size never saving to orders: this
// fix's controller/model code was written against columns that were never
// actually added to the database — every single "Save Variants" click was
// silently failing with a SQL error (Unknown column 'compare_price'),
// which is why product_variants stayed completely empty no matter what
// was tried.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'compare_price')) {
                $table->decimal('compare_price', 12, 2)->nullable()->after('price');
            }
            if (!Schema::hasColumn('product_variants', 'image')) {
                $table->string('image', 500)->nullable()->after('stock');
            }
            if (!Schema::hasColumn('product_variants', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('image');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['compare_price', 'image', 'is_active']);
        });
    }
};
