<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'collection'))           $table->string('collection')->nullable()->after('category_id');
            if (!Schema::hasColumn('products', 'color_name'))           $table->string('color_name')->nullable()->after('collection');
            if (!Schema::hasColumn('products', 'color_code'))           $table->string('color_code')->nullable()->after('color_name');
            if (!Schema::hasColumn('products', 'fabric'))               $table->string('fabric')->nullable()->after('color_code');
            if (!Schema::hasColumn('products', 'fabric_composition'))   $table->string('fabric_composition')->nullable()->after('fabric');
            if (!Schema::hasColumn('products', 'gsm'))                  $table->string('gsm')->nullable()->after('fabric_composition');
            if (!Schema::hasColumn('products', 'fabric_width'))         $table->string('fabric_width')->nullable()->after('gsm');
            if (!Schema::hasColumn('products', 'fit'))                  $table->string('fit')->nullable()->after('fabric_width');
            if (!Schema::hasColumn('products', 'care_instructions'))    $table->text('care_instructions')->nullable()->after('fit');
            if (!Schema::hasColumn('products', 'made_in'))              $table->string('made_in')->default('Pakistan')->after('care_instructions');
            if (!Schema::hasColumn('products', 'tags'))                 $table->json('tags')->nullable()->after('made_in');
            if (!Schema::hasColumn('products', 'available_sizes'))      $table->json('available_sizes')->nullable()->after('tags');
        });

        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'gender'))             $table->string('gender')->nullable()->after('slug'); // men/women/unisex
            if (!Schema::hasColumn('categories', 'brand_line'))         $table->string('brand_line')->nullable()->after('gender'); // millionaire_cloth etc
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $cols = ['collection','color_name','color_code','fabric','fabric_composition','gsm','fabric_width','fit','care_instructions','made_in','tags','available_sizes'];
            $existing = array_filter($cols, fn($c) => Schema::hasColumn('products', $c));
            if ($existing) $table->dropColumn(array_values($existing));
        });
    }
};
