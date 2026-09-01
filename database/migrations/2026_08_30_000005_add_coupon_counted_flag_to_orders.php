<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Same problem, same fix pattern as stock_reduced: coupon used_count was
// being incremented at raw checkout, before payment is ever confirmed for
// online gateways. If JazzCash/Stripe/etc. payment then fails, the coupon
// stays "used" forever with no actual completed purchase behind it —
// coupons can silently exhaust themselves from abandoned/failed payments.
return new class extends Migration {
    public function up(): void {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'coupon_counted')) {
                $table->boolean('coupon_counted')->default(false)->after('coupon_code');
            }
        });
    }
    public function down(): void {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'coupon_counted')) $table->dropColumn('coupon_counted');
        });
    }
};
