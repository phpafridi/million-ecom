<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'payment_method'))
                $table->string('payment_method')->default('cod')->after('status');
            if (!Schema::hasColumn('orders', 'payment_status'))
                $table->string('payment_status')->default('pending')->after('payment_method');
            if (!Schema::hasColumn('orders', 'payment_reference'))
                $table->string('payment_reference')->nullable()->after('payment_status');
            if (!Schema::hasColumn('orders', 'notes'))
                $table->text('notes')->nullable()->after('payment_reference');
            if (!Schema::hasColumn('orders', 'shipping_address'))
                $table->json('shipping_address')->nullable()->after('notes');
            if (!Schema::hasColumn('orders', 'subtotal'))
                $table->decimal('subtotal', 12, 2)->default(0)->after('shipping_address');
            if (!Schema::hasColumn('orders', 'shipping_cost'))
                $table->decimal('shipping_cost', 12, 2)->default(0)->after('subtotal');
            if (!Schema::hasColumn('orders', 'total'))
                $table->decimal('total', 12, 2)->default(0)->after('shipping_cost');
        });
    }
    public function down(): void {}
};
