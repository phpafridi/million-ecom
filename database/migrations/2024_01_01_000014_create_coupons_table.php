<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type')->default('percentage'); // percentage, fixed, free_shipping
            $table->decimal('value', 10, 2)->default(0);
            $table->decimal('min_order', 10, 2)->default(0);
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->integer('per_user_limit')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'coupon_code')) {
                $table->string('coupon_code')->nullable()->after('notes');
                $table->decimal('discount', 10, 2)->default(0)->after('coupon_code');
            }
        });
    }

    public function down(): void {
        Schema::dropIfExists('coupons');
    }
};
