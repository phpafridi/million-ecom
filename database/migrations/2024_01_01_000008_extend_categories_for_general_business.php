<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'banner_image'))
                $table->string('banner_image')->nullable()->after('image');
            if (!Schema::hasColumn('categories', 'type'))
                $table->string('type')->default('general')->after('description'); // general|gender|age|custom
            if (!Schema::hasColumn('categories', 'icon'))
                $table->string('icon')->nullable()->after('banner_image'); // emoji or icon name
            if (!Schema::hasColumn('categories', 'color'))
                $table->string('color', 20)->nullable()->after('icon'); // hex for category badge
            if (!Schema::hasColumn('categories', 'show_in_nav'))
                $table->boolean('show_in_nav')->default(true)->after('is_active');
            if (!Schema::hasColumn('categories', 'nav_order'))
                $table->integer('nav_order')->default(0)->after('show_in_nav');
        });
    }
    public function down(): void {
        Schema::table('categories', function (Blueprint $table) {
            foreach (['banner_image','type','icon','color','show_in_nav','nav_order'] as $col)
                if (Schema::hasColumn('categories', $col)) $table->dropColumn($col);
        });
    }
};
