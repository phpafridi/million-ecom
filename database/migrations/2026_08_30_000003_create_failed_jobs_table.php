<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tracks jobs that exhausted all retries — used by `php artisan queue:work`
// and `queue:failed` / `queue:retry` commands. Needed alongside the jobs
// table for the database queue driver to work correctly.
return new class extends Migration {
    public function up(): void {
        if (!Schema::hasTable('failed_jobs')) {
            Schema::create('failed_jobs', function (Blueprint $table) {
                $table->id();
                $table->string('uuid')->unique();
                $table->text('connection');
                $table->text('queue');
                $table->longText('payload');
                $table->longText('exception');
                $table->timestamp('failed_at')->useCurrent();
            });
        }
    }
    public function down(): void {
        Schema::dropIfExists('failed_jobs');
    }
};
