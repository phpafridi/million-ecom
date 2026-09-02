<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Not every store wants per-color/size stock tracking — some just want
// Color/Size as customer-facing options with one shared stock number for
// the whole product. Defaults to true (individual tracking) so existing
// products that already have real per-variant stock set keep behaving
// exactly as they do now.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'track_variant_stock')) {
                $table->boolean('track_variant_stock')->default(true)->after('stock');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('track_variant_stock');
        });
    }
};
