<?php
// ═══════════════════════════════════════════════════════════
// ADD THESE ROUTES TO YOUR EXISTING routes/web.php
// ═══════════════════════════════════════════════════════════

use App\Http\Controllers\Shop\{
    NewsletterController,
    OrderTrackingController,
    AccountController,
};

// ── ORDER TRACKING (Public — no login needed) ────────────────
Route::get('/track-order',          [OrderTrackingController::class, 'index'])->name('track.index');
Route::post('/track-order',         [OrderTrackingController::class, 'track'])->name('track.search');
Route::get('/track/{token}',        [OrderTrackingController::class, 'show'])->name('track.show');

// ── NEWSLETTER ───────────────────────────────────────────────
Route::post('/newsletter/subscribe',        [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{token}',[NewsletterController::class, 'unsubscribe'])->name('newsletter.unsubscribe');

// ── CUSTOMER ACCOUNT (Replace existing account routes) ───────
Route::middleware('auth')->group(function () {
    Route::get('/account',                  [AccountController::class, 'index'])->name('account.index');
    Route::get('/account/orders',           [AccountController::class, 'orders'])->name('account.orders');
    Route::get('/account/orders/{id}',      [AccountController::class, 'orderShow'])->name('account.orders.show');
    Route::get('/account/wishlist',         [AccountController::class, 'wishlist'])->name('account.wishlist');
    Route::get('/account/loyalty',          [AccountController::class, 'loyalty'])->name('account.loyalty');
    Route::get('/account/profile',          [AccountController::class, 'profile'])->name('account.profile');
    Route::post('/account/profile',         [AccountController::class, 'updateProfile'])->name('account.profile.update');
    Route::post('/account/avatar',          [AccountController::class, 'uploadAvatar'])->name('account.avatar');
    Route::post('/account/addresses',       [AccountController::class, 'storeAddress'])->name('account.addresses.store');
    Route::delete('/account/addresses/{id}',[AccountController::class, 'destroyAddress'])->name('account.addresses.destroy');
});
