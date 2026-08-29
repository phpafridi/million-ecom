<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// VariantAttribute model and ProductController both read/write 'is_required' and
// 'display_type' on variant_attributes, and 'color_hex' on variant_values — none
// of which the original migration created. That's why marking an attribute
// "Required" in the admin never actually saved anywhere, and reopening the product
// always showed it as unchecked again: there was no column for it to live in.
return new class extends Migration {
    public function up(): void {
        Schema::table('variant_attributes', function (Blueprint $table) {
            if (!Schema::hasColumn('variant_attributes', 'is_required')) {
                $table->boolean('is_required')->default(false)->after('name');
            }
            if (!Schema::hasColumn('variant_attributes', 'display_type')) {
                $table->string('display_type', 20)->default('button')->after('is_required');
            }
        });
        Schema::table('variant_values', function (Blueprint $table) {
            if (!Schema::hasColumn('variant_values', 'color_hex')) {
                $table->string('color_hex', 7)->nullable()->after('value');
            }
        });
    }

    public function down(): void {
        Schema::table('variant_attributes', function (Blueprint $table) {
            if (Schema::hasColumn('variant_attributes', 'is_required'))  $table->dropColumn('is_required');
            if (Schema::hasColumn('variant_attributes', 'display_type')) $table->dropColumn('display_type');
        });
        Schema::table('variant_values', function (Blueprint $table) {
            if (Schema::hasColumn('variant_values', 'color_hex')) $table->dropColumn('color_hex');
        });
    }
};
