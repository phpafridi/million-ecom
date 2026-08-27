<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('image')->nullable();
            $table->string('image_path')->nullable();
            $table->string('description')->nullable();
            $table->unsignedTinyInteger('discount_pct')->default(0);
            $table->string('price', 30)->nullable();
            $table->string('compare_price', 30)->nullable();
            $table->string('image_mobile')->nullable();
            $table->string('cta_text', 50)->nullable();
            $table->string('cta_url')->nullable();
            $table->string('badge', 50)->nullable();
            $table->string('overlay_color', 30)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('hero_slides'); }
};