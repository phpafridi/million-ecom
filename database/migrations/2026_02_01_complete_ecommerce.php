<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ── Staff roles on users ──────────────────────────────────────
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_staff'))      $table->boolean('is_staff')->default(false)->after('role');
            if (!Schema::hasColumn('users', 'staff_role'))    $table->string('staff_role')->nullable()->after('is_staff');
            if (!Schema::hasColumn('users', 'permissions'))   $table->json('permissions')->nullable()->after('staff_role');
            if (!Schema::hasColumn('users', 'is_active'))     $table->boolean('is_active')->default(true)->after('permissions');
            if (!Schema::hasColumn('users', 'last_login_at')) $table->timestamp('last_login_at')->nullable()->after('is_active');
        });

        // ── Order extra fields ────────────────────────────────────────
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'tracking_number')) $table->string('tracking_number')->nullable()->after('status');
            if (!Schema::hasColumn('orders', 'courier'))         $table->string('courier')->nullable()->after('tracking_number');
            if (!Schema::hasColumn('orders', 'shipped_at'))      $table->timestamp('shipped_at')->nullable();
            if (!Schema::hasColumn('orders', 'delivered_at'))    $table->timestamp('delivered_at')->nullable();
            if (!Schema::hasColumn('orders', 'cancelled_reason'))$table->string('cancelled_reason')->nullable();
            if (!Schema::hasColumn('orders', 'admin_notes'))     $table->text('admin_notes')->nullable();
            if (!Schema::hasColumn('orders', 'refund_amount'))   $table->decimal('refund_amount', 10, 2)->default(0);
            if (!Schema::hasColumn('orders', 'refunded_at'))     $table->timestamp('refunded_at')->nullable();
        });

        // ── Support tickets ───────────────────────────────────────────
        if (!Schema::hasTable('support_tickets')) {
            Schema::create('support_tickets', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('ticket_number')->unique();
                $table->string('name');
                $table->string('email');
                $table->string('phone')->nullable();
                $table->unsignedBigInteger('order_id')->nullable();
                $table->string('subject');
                $table->text('message');
                $table->string('status')->default('open');
                $table->string('priority')->default('normal');
                $table->unsignedBigInteger('assigned_to')->nullable();
                $table->timestamp('resolved_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('support_ticket_replies')) {
            Schema::create('support_ticket_replies', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ticket_id')->constrained('support_tickets')->cascadeOnDelete();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->text('message');
                $table->boolean('is_staff')->default(false);
                $table->timestamps();
            });
        }

        // ── Abandoned carts ───────────────────────────────────────────
        if (!Schema::hasTable('abandoned_carts')) {
            Schema::create('abandoned_carts', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('email')->nullable();
                $table->json('cart_data');
                $table->decimal('total', 10, 2)->default(0);
                $table->boolean('reminder_sent')->default(false);
                $table->timestamp('reminder_sent_at')->nullable();
                $table->boolean('recovered')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('abandoned_carts');
        Schema::dropIfExists('support_ticket_replies');
        Schema::dropIfExists('support_tickets');
    }
};
