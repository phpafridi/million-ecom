<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Stock reduce/restore is triggered from many separate places — checkout,
// 6+ payment gateway callbacks (JazzCash, Easypaisa, Safepay, PayFast,
// Stripe, etc.), admin status changes, admin order deletion. Trying to
// infer "was stock already reduced for this order" separately in each of
// those places is exactly how bugs like this happen (a broken manual
// restore loop in one gateway, a missing reduce call in another). An
// explicit flag on the order itself makes every reduce/restore call safe
// to call from anywhere, any number of times, with no risk of double
// counting — Order::reduceStock() and restoreStock() both check and set
// this flag internally.
return new class extends Migration {
    public function up(): void {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'stock_reduced')) {
                $table->boolean('stock_reduced')->default(false)->after('payment_status');
            }
        });
    }
    public function down(): void {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'stock_reduced')) $table->dropColumn('stock_reduced');
        });
    }
};
