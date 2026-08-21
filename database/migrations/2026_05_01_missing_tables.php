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
        if (!Schema::hasTable('chat_sessions')) {
            Schema::create('chat_sessions', function (Blueprint $table) {
                $table->id();
                $table->string('session_id')->unique();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('visitor_name')->nullable();
                $table->string('visitor_email')->nullable();
                $table->string('status')->default('bot');
                $table->unsignedBigInteger('agent_id')->nullable();
                $table->integer('bot_step')->default(0);
                $table->timestamp('agent_joined_at')->nullable();
                $table->timestamp('closed_at')->nullable();
                $table->integer('rating')->nullable();
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('chat_messages')) {
            Schema::create('chat_messages', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('session_id');
                $table->string('sender_type');
                $table->unsignedBigInteger('sender_id')->nullable();
                $table->text('message');
                $table->string('message_type')->default('text');
                $table->json('options')->nullable();
                $table->boolean('is_read')->default(false);
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('chat_faqs')) {
            Schema::create('chat_faqs', function (Blueprint $table) {
                $table->id();
                $table->string('question');
                $table->text('answer');
                $table->string('category')->default('general');
                $table->json('keywords')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->integer('helpful_count')->default(0);
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('support_tickets')) {
            Schema::create('support_tickets', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable();
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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_staff'))     $table->boolean('is_staff')->default(false)->after('role');
            if (!Schema::hasColumn('users', 'staff_role'))   $table->string('staff_role')->nullable()->after('is_staff');
            if (!Schema::hasColumn('users', 'permissions'))  $table->json('permissions')->nullable()->after('staff_role');
            if (!Schema::hasColumn('users', 'is_active'))    $table->boolean('is_active')->default(true)->after('permissions');
            if (!Schema::hasColumn('users', 'is_online'))    $table->boolean('is_online')->default(false)->after('is_active');
            if (!Schema::hasColumn('users', 'last_seen_at')) $table->timestamp('last_seen_at')->nullable();
        });
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'tracking_number'))  $table->string('tracking_number')->nullable();
            if (!Schema::hasColumn('orders', 'courier'))          $table->string('courier')->nullable();
            if (!Schema::hasColumn('orders', 'shipped_at'))       $table->timestamp('shipped_at')->nullable();
            if (!Schema::hasColumn('orders', 'delivered_at'))     $table->timestamp('delivered_at')->nullable();
            if (!Schema::hasColumn('orders', 'admin_notes'))      $table->text('admin_notes')->nullable();
            if (!Schema::hasColumn('orders', 'cancelled_reason')) $table->string('cancelled_reason')->nullable();
        });
    }
    public function down(): void {}
};
