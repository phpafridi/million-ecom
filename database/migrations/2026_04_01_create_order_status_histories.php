<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('order_status_histories')) {
            Schema::create('order_status_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->string('status');
                $table->text('note')->nullable();
                $table->string('created_by')->default('system');
                $table->timestamps();
            });
        }

        // Also add missing order columns safely
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'tracking_number')) $table->string('tracking_number')->nullable()->after('status');
            if (!Schema::hasColumn('orders', 'courier'))         $table->string('courier')->nullable();
            if (!Schema::hasColumn('orders', 'shipped_at'))      $table->timestamp('shipped_at')->nullable();
            if (!Schema::hasColumn('orders', 'delivered_at'))    $table->timestamp('delivered_at')->nullable();
            if (!Schema::hasColumn('orders', 'admin_notes'))     $table->text('admin_notes')->nullable();
        });

        // Staff fields on users
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_staff'))    $table->boolean('is_staff')->default(false)->after('role');
            if (!Schema::hasColumn('users', 'staff_role'))  $table->string('staff_role')->nullable()->after('is_staff');
            if (!Schema::hasColumn('users', 'permissions')) $table->json('permissions')->nullable()->after('staff_role');
            if (!Schema::hasColumn('users', 'is_active'))   $table->boolean('is_active')->default(true)->after('permissions');
            if (!Schema::hasColumn('users', 'is_online'))   $table->boolean('is_online')->default(false)->after('is_active');
            if (!Schema::hasColumn('users', 'last_seen_at'))$table->timestamp('last_seen_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
    }
};
