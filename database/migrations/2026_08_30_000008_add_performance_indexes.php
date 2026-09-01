<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Deliberately narrower than the audit's original suggestion: skipped
// single-column indexes on order_items.order_id/product_id,
// products.category_id, orders.user_id, and chat_sessions.agent_id —
// all foreign key columns, which MySQL's InnoDB engine already indexes
// automatically as a requirement of the FK constraint itself. Adding
// explicit duplicates there would just waste disk space and slow down
// writes for no read benefit. Composite indexes that happen to include
// one of those columns (e.g. orders(user_id, created_at)) are kept —
// those are genuinely different from the single-column FK index and
// still provide real value for queries filtering/sorting on both
// columns together.
return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('payment_status');
            $table->index('payment_method');
            $table->index('customer_phone');
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
            $table->index(['status', 'payment_method']);
            $table->index(['status', 'created_at']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('is_featured');
            $table->index(['is_active', 'stock']);
            $table->index(['is_active', 'is_featured']);
            $table->index(['is_active', 'created_at']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index(['product_id', 'is_approved']);
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->index('ip_address');
        });

        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('coupons', function (Blueprint $table) {
            $table->index(['code', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['payment_method']);
            $table->dropIndex(['customer_phone']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropIndex(['status', 'payment_method']);
            $table->dropIndex(['status', 'created_at']);
        });
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['is_active', 'stock']);
            $table->dropIndex(['is_active', 'is_featured']);
            $table->dropIndex(['is_active', 'created_at']);
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['product_id', 'is_approved']);
        });
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['ip_address']);
        });
        Schema::table('chat_sessions', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropIndex(['code', 'is_active']);
        });
    }
};
