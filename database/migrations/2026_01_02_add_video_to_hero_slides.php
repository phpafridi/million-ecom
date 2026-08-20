<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            if (!Schema::hasColumn('hero_slides', 'video_url'))
                $table->string('video_url')->nullable()->after('image_path');
            if (!Schema::hasColumn('hero_slides', 'video_type'))
                $table->string('video_type')->default('url')->after('video_url'); // url or upload
        });
    }
    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn(['video_url', 'video_type']);
        });
    }
};
