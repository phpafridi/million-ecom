<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'banner_image')) {
                $table->string('banner_image')->nullable()->after('image');
            }
        });
    }
    public function down(): void {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'banner_image')) {
                $table->dropColumn('banner_image');
            }
        });
    }
};
