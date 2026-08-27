<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 30)->nullable()->unique();
            $table->string('tracking_token', 20)->nullable()->unique();
            $table->string('tracking_number', 100)->nullable();
            $table->string('courier', 100)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone', 20);
            $table->string('customer_email')->nullable();
            $table->string('customer_address', 500);
            $table->string('city', 100)->nullable();
            $table->string('payment_method', 50)->default('cod');
            $table->enum('payment_status', ['pending','paid','failed','refunded'])->default('pending');
            $table->enum('status', ['pending','processing','shipped','delivered','cancelled'])->default('pending');
            $table->string('return_status', 30)->nullable();
            $table->text('notes')->nullable();
            $table->string('coupon_code', 50)->nullable();
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('shipping', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('payment_proof')->nullable();
            $table->json('tracking_history')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('orders'); }
};