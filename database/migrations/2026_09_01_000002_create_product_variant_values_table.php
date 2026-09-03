<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// This pivot table never existed at all — meaning ProductVariant's
// variantValues() relationship (which every color/size combination
// depends on to know which values it represents) had nothing to attach
// to, and every attempt threw a SQL error rather than silently doing
// nothing.
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('product_variant_values')) {
            Schema::create('product_variant_values', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
                $table->foreignId('variant_value_id')->constrained()->cascadeOnDelete();
                $table->unique(['product_variant_id', 'variant_value_id'], 'pvv_variant_value_unique');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variant_values');
    }
};
