<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('banners', function (Blueprint $table) {
            $table->string('mobile_image_path')->nullable()->after('image_path');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->string('mobile_image')->nullable()->after('image');
            $table->string('mobile_banner_image')->nullable()->after('banner_image');
        });
    }
    public function down(): void {
        Schema::table('banners', function (Blueprint $table) {
            $table->dropColumn('mobile_image_path');
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['mobile_image', 'mobile_banner_image']);
        });
    }
};
