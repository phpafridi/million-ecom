<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// ChatController reads/writes a richer schema than the original chat_sessions /
// chat_messages / chat_faqs migration actually created — same category of bug
// found earlier in order_returns and variant_attributes. This is what throws
// the 500 on POST /chat/start: it tries to insert user_id, visitor_name,
// visitor_email, bot_step (none of which exist) and a status of 'bot' into a
// column whose enum only permits waiting/active/closed.
return new class extends Migration {
    public function up(): void {
        Schema::table('chat_sessions', function (Blueprint $table) {
            if (!Schema::hasColumn('chat_sessions', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('session_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('chat_sessions', 'visitor_name')) {
                $table->string('visitor_name')->nullable()->after('name');
            }
            if (!Schema::hasColumn('chat_sessions', 'visitor_email')) {
                $table->string('visitor_email')->nullable()->after('email');
            }
            if (!Schema::hasColumn('chat_sessions', 'bot_step')) {
                $table->unsignedTinyInteger('bot_step')->default(0)->after('status');
            }
            if (!Schema::hasColumn('chat_sessions', 'closed_at')) {
                $table->timestamp('closed_at')->nullable()->after('agent_joined_at');
            }
        });

        // The status column was a strict MySQL ENUM('waiting','active','closed'),
        // but the controller also needs to store 'bot'. Converting to a plain
        // VARCHAR is simpler and safer than altering the enum definition (which
        // requires doctrine/dbal for Schema::table()->change()).
        DB::statement("ALTER TABLE chat_sessions MODIFY status VARCHAR(20) NOT NULL DEFAULT 'bot'");

        Schema::table('chat_messages', function (Blueprint $table) {
            if (!Schema::hasColumn('chat_messages', 'sender_type')) {
                $table->string('sender_type', 20)->default('visitor')->after('session_id');
            }
            if (!Schema::hasColumn('chat_messages', 'sender_id')) {
                $table->foreignId('sender_id')->nullable()->after('sender_type')->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('chat_messages', 'message_type')) {
                $table->string('message_type', 20)->default('text')->after('message');
            }
            if (!Schema::hasColumn('chat_messages', 'options')) {
                $table->text('options')->nullable()->after('message_type');
            }
        });

        Schema::table('chat_faqs', function (Blueprint $table) {
            if (!Schema::hasColumn('chat_faqs', 'keywords')) {
                $table->text('keywords')->nullable()->after('answer');
            }
        });
    }

    public function down(): void {
        Schema::table('chat_sessions', function (Blueprint $table) {
            foreach (['visitor_name', 'visitor_email', 'bot_step', 'closed_at'] as $col) {
                if (Schema::hasColumn('chat_sessions', $col)) $table->dropColumn($col);
            }
            if (Schema::hasColumn('chat_sessions', 'user_id')) $table->dropConstrainedForeignId('user_id');
        });
        DB::statement("ALTER TABLE chat_sessions MODIFY status ENUM('waiting','active','closed') NOT NULL DEFAULT 'waiting'");
        Schema::table('chat_messages', function (Blueprint $table) {
            if (Schema::hasColumn('chat_messages', 'sender_id')) $table->dropConstrainedForeignId('sender_id');
            foreach (['sender_type', 'message_type', 'options'] as $col) {
                if (Schema::hasColumn('chat_messages', $col)) $table->dropColumn($col);
            }
        });
        Schema::table('chat_faqs', function (Blueprint $table) {
            if (Schema::hasColumn('chat_faqs', 'keywords')) $table->dropColumn('keywords');
        });
    }
};
