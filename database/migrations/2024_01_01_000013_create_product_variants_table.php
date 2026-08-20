<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // Product variant groups (Size, Color, Material etc.)
        Schema::create('variant_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // Size, Color, Material
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Attribute values (S, M, L, XL or Red, Blue, Green)
        Schema::create('variant_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('variant_attribute_id')->constrained()->cascadeOnDelete();
            $table->string('value'); // S, M, L, Red, Blue
            $table->string('color_hex')->nullable(); // for color swatches
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Actual product variants (combination of values)
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->nullable()->unique();
            $table->decimal('price', 12, 2)->nullable(); // override product price
            $table->decimal('compare_price', 12, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Pivot: which values make up this variant
        Schema::create('product_variant_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variant_value_id')->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void {
        Schema::dropIfExists('product_variant_values');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('variant_values');
        Schema::dropIfExists('variant_attributes');
    }
};
