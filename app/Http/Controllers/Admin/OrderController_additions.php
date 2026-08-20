<?php
// ═══════════════════════════════════════════════════════════
// ADD THIS LOGIC TO YOUR EXISTING Admin/OrderController.php
// In the update() method, after $order->update($data):
// ═══════════════════════════════════════════════════════════

// 1. Log status change to history
if (isset($data['status']) && $data['status'] !== $oldStatus) {
    $order->addStatusHistory(
        $data['status'],
        $request->input('status_note'),
        auth()->user()->name
    );

    // 2. Award loyalty points when order is DELIVERED
    if ($data['status'] === 'delivered' && $order->user_id) {
        $user = \App\Models\User::find($order->user_id);
        if ($user) {
            // 1 point per Rs 10 spent
            $points = (int) floor($order->total / 10);
            if ($points > 0) {
                $user->addPoints(
                    $points,
                    "Points earned for Order #{$order->id}",
                    $order->id
                );
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════
// ALSO ADD TO YOUR CartController checkout() method
// After the order is created, add initial status history:
// ═══════════════════════════════════════════════════════════

// $order->addStatusHistory('pending', 'Order placed by customer', 'customer');

// ═══════════════════════════════════════════════════════════
// AND UPDATE THE ORDER QUERY in Admin/OrderController index()
// to include the tracking_token in the response:
// ═══════════════════════════════════════════════════════════

// Add 'tracking_token' to the order data returned to Inertia
