<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin','customer'])->default('customer')->after('email');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('role');
            }
        });
    }
    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $cols = array_filter(['role','phone'], fn($c) => Schema::hasColumn('users', $c));
            if ($cols) $table->dropColumn($cols);
        });
    }
};
