<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Order::addStatusHistory() and the OrderStatusHistory model both already
// existed and were being called from PayFastController, but the actual
// database table they depend on was never created — calling this method
// anywhere would throw a hard SQL error, not just silently do nothing.
return new class extends Migration {
    public function up(): void {
        if (!Schema::hasTable('order_status_histories')) {
            Schema::create('order_status_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->string('status');
                $table->text('note')->nullable();
                $table->string('created_by')->default('system');
                // Model has $timestamps = false and sets created_at itself via
                // cast, but never passes a value explicitly on create() — a DB
                // default keeps it from silently being null every time.
                $table->timestamp('created_at')->useCurrent();
                $table->index('order_id');
            });
        }
    }
    public function down(): void {
        Schema::dropIfExists('order_status_histories');
    }
};
