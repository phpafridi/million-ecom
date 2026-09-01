<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ReviewController::store() had zero duplicate-review protection, and the
// audit's proposed fix (checking user_id/ip_address, flagging
// verified_purchase) referenced columns that don't actually exist on this
// table yet. Adding user_id and ip_address here; verified-purchase status
// is derived from order_id (which already existed but was never populated)
// rather than a separate flag that could go stale.
return new class extends Migration {
    public function up(): void {
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('product_id')->constrained()->nullOnDelete();
            }
            if (!Schema::hasColumn('reviews', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('email');
            }
        });
    }
    public function down(): void {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'user_id')) $table->dropConstrainedForeignId('user_id');
            if (Schema::hasColumn('reviews', 'ip_address')) $table->dropColumn('ip_address');
        });
    }
};
