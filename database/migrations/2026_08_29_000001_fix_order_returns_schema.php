<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// The original order_returns migration (2024_01_01_000024) created a table with
// order_id/user_id/reason/details/status/refund_amount/restock/processed_at/admin_notes.
// But the actual return-processing feature (OrderController::storeReturn, the
// OrderReturn model, and the admin Returns list page) was built against a richer
// per-item schema — order_item_id, quantity, notes, refund_method, processed_by,
// approved_at, refunded_at, return_number — none of which exist yet. That mismatch
// is what throws "Unknown column 'order_item_id'" when processing a return.
// This migration adds every missing column without touching existing data.
return new class extends Migration {
    public function up(): void {
        Schema::table('order_returns', function (Blueprint $table) {
            if (!Schema::hasColumn('order_returns', 'order_item_id')) {
                $table->foreignId('order_item_id')->nullable()->after('order_id')
                    ->constrained('order_items')->nullOnDelete();
            }
            if (!Schema::hasColumn('order_returns', 'quantity')) {
                $table->unsignedInteger('quantity')->default(1)->after('order_item_id');
            }
            if (!Schema::hasColumn('order_returns', 'notes')) {
                $table->text('notes')->nullable()->after('reason');
            }
            if (!Schema::hasColumn('order_returns', 'refund_method')) {
                $table->enum('refund_method', ['original', 'store_credit', 'cash', 'none'])
                    ->default('original')->after('status');
            }
            if (!Schema::hasColumn('order_returns', 'processed_by')) {
                $table->foreignId('processed_by')->nullable()->after('restock')
                    ->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('order_returns', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('processed_at');
            }
            if (!Schema::hasColumn('order_returns', 'refunded_at')) {
                $table->timestamp('refunded_at')->nullable()->after('approved_at');
            }
            if (!Schema::hasColumn('order_returns', 'return_number')) {
                $table->string('return_number', 30)->nullable()->unique()->after('id');
            }
        });
    }

    public function down(): void {
        Schema::table('order_returns', function (Blueprint $table) {
            foreach (['order_item_id', 'quantity', 'notes', 'refund_method', 'processed_by', 'approved_at', 'refunded_at', 'return_number'] as $col) {
                if (Schema::hasColumn('order_returns', $col)) {
                    if (in_array($col, ['order_item_id', 'processed_by'])) {
                        $table->dropConstrainedForeignId($col);
                    } else {
                        $table->dropColumn($col);
                    }
                }
            }
        });
    }
};
