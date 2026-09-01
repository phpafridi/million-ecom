<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// The only unique constraint on this table was (session_id, product_id).
// Once WishlistController starts looking items up by user_id for logged-in
// customers (this fix), a customer wishlisting the same product from two
// different devices/sessions could otherwise create duplicate rows for the
// same account. NULL user_id values (guests) are unaffected — MySQL allows
// multiple NULLs in a unique index.
return new class extends Migration {
    public function up(): void {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->unique(['user_id', 'product_id'], 'wishlists_user_product_unique');
        });
    }
    public function down(): void {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropUnique('wishlists_user_product_unique');
        });
    }
};
