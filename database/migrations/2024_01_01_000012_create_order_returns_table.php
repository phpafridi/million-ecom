<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('order_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
            $table->integer('quantity')->default(1);
            $table->string('reason');
            $table->text('notes')->nullable();
            $table->string('status')->default('requested'); // requested, approved, rejected, completed
            $table->string('refund_method')->nullable(); // original, store_credit, cash
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->boolean('restock')->default(true); // put items back in inventory
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });

        // Add inventory hold/reserve columns to products
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'stock_reserved')) {
                $table->integer('stock_reserved')->default(0)->after('stock');
            }
            if (!Schema::hasColumn('products', 'stock_sold')) {
                $table->integer('stock_sold')->default(0)->after('stock_reserved');
            }
        });

        // Add return_status to orders
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'return_status')) {
                $table->string('return_status')->nullable()->after('status');
            }
        });
    }
    public function down(): void {
        Schema::dropIfExists('order_returns');
    }
};
