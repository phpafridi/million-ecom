<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('variant_attributes', function (Blueprint $table) {
            if (!Schema::hasColumn('variant_attributes', 'is_required'))
                $table->boolean('is_required')->default(false)->after('name');
            if (!Schema::hasColumn('variant_attributes', 'display_type'))
                $table->string('display_type')->default('button')->after('is_required'); // button, color, dropdown
        });
    }
    public function down(): void {}
};
