<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('blocked_ips', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->unique();
            $table->string('reason', 200)->nullable();
            $table->enum('type', ['ddos','spam','manual','auto'])->default('manual');
            $table->integer('hit_count')->default(0);
            $table->foreignId('blocked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('expires_at')->nullable(); // null = permanent
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['ip_address','is_active']);
        });
    }
    public function down(): void { Schema::dropIfExists('blocked_ips'); }
};
