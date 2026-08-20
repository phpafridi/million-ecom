<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ── Add profile fields to users (safe — checks before adding) ──
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'phone'))                    $table->string('phone')->nullable()->after('email');
            if (!Schema::hasColumn('users', 'avatar'))                   $table->string('avatar')->nullable()->after('phone');
            if (!Schema::hasColumn('users', 'date_of_birth'))            $table->date('date_of_birth')->nullable()->after('avatar');
            if (!Schema::hasColumn('users', 'gender'))                   $table->string('gender')->nullable()->after('date_of_birth');
            if (!Schema::hasColumn('users', 'address'))                  $table->text('address')->nullable()->after('gender');
            if (!Schema::hasColumn('users', 'city'))                     $table->string('city')->nullable()->after('address');
            if (!Schema::hasColumn('users', 'loyalty_points'))           $table->integer('loyalty_points')->default(0)->after('city');
            if (!Schema::hasColumn('users', 'total_points_earned'))      $table->integer('total_points_earned')->default(0)->after('loyalty_points');
            if (!Schema::hasColumn('users', 'newsletter_subscribed'))    $table->boolean('newsletter_subscribed')->default(false)->after('total_points_earned');
            if (!Schema::hasColumn('users', 'newsletter_subscribed_at')) $table->timestamp('newsletter_subscribed_at')->nullable()->after('newsletter_subscribed');
        });

        // ── Add tracking fields to orders (safe) ────────────────────────
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'tracking_token'))    $table->string('tracking_token', 64)->nullable()->unique()->after('id');
            if (!Schema::hasColumn('orders', 'coupon_code'))       $table->string('coupon_code')->nullable()->after('notes');
            if (!Schema::hasColumn('orders', 'discount'))          $table->decimal('discount', 12, 2)->default(0)->after('coupon_code');
            if (!Schema::hasColumn('orders', 'city'))              $table->string('city')->nullable()->after('customer_address');
            if (!Schema::hasColumn('orders', 'tracking_history'))  $table->json('tracking_history')->nullable()->after('city');
        });

        // ── Loyalty points ledger ────────────────────────────────────────
        if (!Schema::hasTable('loyalty_transactions')) {
            Schema::create('loyalty_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
                $table->string('type'); // earned, redeemed, expired, bonus
                $table->integer('points');
                $table->string('description');
                $table->timestamps();
            });
        }

        // ── Newsletter subscribers ───────────────────────────────────────
        if (!Schema::hasTable('newsletter_subscribers')) {
            Schema::create('newsletter_subscribers', function (Blueprint $table) {
                $table->id();
                $table->string('email')->unique();
                $table->string('name')->nullable();
                $table->string('token', 64)->nullable()->unique();
                $table->boolean('is_active')->default(true);
                $table->timestamp('subscribed_at')->useCurrent();
                $table->timestamp('unsubscribed_at')->nullable();
                $table->timestamps();
            });
        }

        // ── Order status history ─────────────────────────────────────────
        if (!Schema::hasTable('order_status_history')) {
            Schema::create('order_status_history', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->cascadeOnDelete();
                $table->string('status');
                $table->string('note')->nullable();
                $table->string('created_by')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }

        // ── Saved addresses ──────────────────────────────────────────────
        if (!Schema::hasTable('user_addresses')) {
            Schema::create('user_addresses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('label')->default('Home');
                $table->string('full_name');
                $table->string('phone');
                $table->text('address');
                $table->string('city');
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('order_status_history');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('loyalty_transactions');

        Schema::table('orders', function (Blueprint $table) {
            $cols = ['tracking_token','coupon_code','discount','city','tracking_history'];
            $existing = array_filter($cols, fn($c) => Schema::hasColumn('orders', $c));
            if ($existing) $table->dropColumn(array_values($existing));
        });

        Schema::table('users', function (Blueprint $table) {
            $cols = ['avatar','date_of_birth','gender','address','city',
                     'loyalty_points','total_points_earned','newsletter_subscribed','newsletter_subscribed_at'];
            $existing = array_filter($cols, fn($c) => Schema::hasColumn('users', $c));
            if ($existing) $table->dropColumn(array_values($existing));
        });
    }
};
