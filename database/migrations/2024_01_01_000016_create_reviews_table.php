<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->tinyInteger('rating'); // 1-5
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
        });

        // Add avg_rating to products
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'avg_rating')) {
                $table->decimal('avg_rating', 3, 2)->default(0)->after('stock_sold');
                $table->integer('review_count')->default(0)->after('avg_rating');
            }
        });
    }
    public function down(): void { Schema::dropIfExists('reviews'); }
};
