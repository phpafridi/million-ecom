<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\{Order, Setting, Wishlist, Product, UserAddress, LoyaltyTransaction};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash, Storage};
use Inertia\Inertia;

class AccountController extends Controller
{
    // Auth handled by route middleware

    // ── Dashboard ────────────────────────────────────────────────────
    public function index()
    {
        $user   = auth()->user();
        $orders = Order::where('user_id', $user->id)
            ->withCount('items')
            ->latest()
            ->take(5)
            ->get();

        // One query for both counts instead of two separate ones against
        // the same table.
        $summary = Order::where('user_id', $user->id)
            ->selectRaw('COUNT(*) as total_orders, SUM(CASE WHEN status != "cancelled" THEN total ELSE 0 END) as total_spent')
            ->first();

        $stats = [
            'total_orders'    => (int) ($summary->total_orders ?? 0),
            'total_spent'     => (float) ($summary->total_spent ?? 0),
            'loyalty_points'  => $user->loyalty_points,
            'points_value'    => $user->points_value,
            'level'           => $user->level,
            // Tied to the logged-in account, not the browser session — a
            // wishlist built as a guest and then merged on login (see
            // LoginController) needs to keep counting correctly afterward.
            'wishlist_count'  => Wishlist::where('user_id', $user->id)->count(),
        ];

        return Inertia::render('Account/Index', [
            'orders'   => $orders->map(fn($o) => $this->formatOrder($o)),
            'stats'    => $stats,
            'settings' => Setting::allKeyed(),
        ]);
    }

    // ── Orders list ──────────────────────────────────────────────────
    public function orders(Request $request)
    {
        $query = Order::where('user_id', auth()->id())
            ->withCount('items')
            ->latest();

        if ($status = $request->status) {
            $query->where('status', $status);
        }

        return Inertia::render('Account/Orders', [
            'orders'   => $query->paginate(10)->withQueryString(),
            'filters'  => $request->only(['status']),
            'settings' => Setting::allKeyed(),
        ]);
    }

    // ── Single order detail ──────────────────────────────────────────
    public function orderShow(int $id)
    {
        $order = Order::where('user_id', auth()->id())
            ->with(['items.product.productImages', 'statusHistory', 'returns'])
            ->findOrFail($id);

        return Inertia::render('Account/OrderDetail', [
            'order'    => $this->formatOrderDetail($order),
            'settings' => Setting::allKeyed(),
        ]);
    }

    // ── Wishlist ─────────────────────────────────────────────────────
    public function wishlist()
    {
        // This account page is only reachable while logged in, so query by
        // the account directly — same bug as everywhere else in this pass
        // (session_id doesn't survive login/session regeneration).
        $items = Wishlist::where('user_id', auth()->id())
            ->with('product.productImages', 'product.category')
            ->get();

        return Inertia::render('Account/Wishlist', [
            'items'    => $items->map(fn($w) => [
                'id'      => $w->id,
                'product' => [
                    'id'           => $w->product->id,
                    'name'         => $w->product->name,
                    'slug'         => $w->product->slug,
                    'price'        => $w->product->price,
                    'compare_price'=> $w->product->compare_price,
                    'discount_pct' => $w->product->discount_pct,
                    'first_image'  => $w->product->first_image,
                    'stock'        => $w->product->stock,
                    'category'     => $w->product->category?->name,
                ],
            ])->toArray(),
            'settings' => Setting::allKeyed(),
        ]);
    }

    // ── Loyalty points ───────────────────────────────────────────────
    public function loyalty()
    {
        $user = auth()->user();
        $transactions = LoyaltyTransaction::where('user_id', $user->id)
            ->with('order')
            ->latest()
            ->paginate(15);

        return Inertia::render('Account/Loyalty', [
            'points'       => $user->loyalty_points,
            'points_value' => $user->points_value,
            'total_earned' => $user->total_points_earned,
            'level'        => $user->level,
            'transactions' => $transactions,
            'settings'     => Setting::allKeyed(),
        ]);
    }

    // ── Profile ──────────────────────────────────────────────────────
    public function profile()
    {
        $user = auth()->user();
        return Inertia::render('Account/Profile', [
            'user'      => [
                'id'                   => $user->id,
                'name'                 => $user->name,
                'email'                => $user->email,
                'phone'                => $user->phone,
                'avatar_url'           => $user->avatar_url,
                'date_of_birth'        => $user->date_of_birth?->format('Y-m-d'),
                'gender'               => $user->gender,
                'address'              => $user->address,
                'city'                 => $user->city,
                'newsletter_subscribed'=> $user->newsletter_subscribed,
                'loyalty_points'       => $user->loyalty_points,
                'level'                => $user->level,
            ],
            'addresses' => $user->addresses()->get(),
            'settings'  => Setting::allKeyed(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'name'             => 'required|string|max:100',
            'email'            => "required|email|unique:users,email,{$user->id}",
            'phone'            => 'nullable|string|max:20',
            'date_of_birth'    => 'nullable|date|before:today',
            'gender'           => 'nullable|in:male,female,other',
            'address'          => 'nullable|string|max:500',
            'city'             => 'nullable|string|max:100',
            'current_password' => 'nullable|string',
            'password'         => 'nullable|string|min:8|confirmed',
            'newsletter_subscribed' => 'boolean',
        ]);

        if (!empty($data['password'])) {
            if (!Hash::check($data['current_password'] ?? '', $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }
            $user->password = Hash::make($data['password']);
        }

        unset($data['current_password'], $data['password'], $data['password_confirmation']);

        // Newsletter subscription tracking
        if (isset($data['newsletter_subscribed']) && $data['newsletter_subscribed'] && !$user->newsletter_subscribed) {
            $data['newsletter_subscribed_at'] = now();
        }

        $user->fill($data)->save();

        return back()->with('success', 'Profile updated successfully.');
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate(['avatar' => 'required|image|max:2048']);
        $user = auth()->user();

        if ($user->avatar) Storage::disk('public')->delete($user->avatar);

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Avatar updated.');
    }

    // ── Addresses ────────────────────────────────────────────────────
    public function storeAddress(Request $request)
    {
        $data = $request->validate([
            'label'     => 'required|string|max:50',
            'full_name' => 'required|string|max:100',
            'phone'     => 'required|string|max:20',
            'address'   => 'required|string|max:500',
            'city'      => 'required|string|max:100',
            'is_default'=> 'boolean',
        ]);

        if ($data['is_default'] ?? false) {
            auth()->user()->addresses()->update(['is_default' => false]);
        }

        auth()->user()->addresses()->create($data);
        return back()->with('success', 'Address saved.');
    }

    public function destroyAddress(int $id)
    {
        auth()->user()->addresses()->findOrFail($id)->delete();
        return back()->with('success', 'Address removed.');
    }

    // ── Format helpers ───────────────────────────────────────────────
    private function formatOrder($order): array
    {
        return [
            'id'             => $order->id,
            'order_number'   => $order->order_number ?? ('MLN-' . str_pad($order->id, 5, '0', STR_PAD_LEFT)),
            'tracking_token' => $order->tracking_token,
            'status'         => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'total'          => $order->total,
            'items_count'    => $order->items_count,
            'created_at'     => $order->created_at->format('M d, Y'),
        ];
    }

    private function formatOrderDetail(Order $order): array
    {
        $statusOrder = ['pending' => 0, 'processing' => 1, 'shipped' => 2, 'delivered' => 3];
        $currentStep = $statusOrder[$order->status] ?? 0;

        return [
            'id'             => $order->id,
            'order_number'   => $order->order_number ?? ('MLN-' . str_pad($order->id, 5, '0', STR_PAD_LEFT)),
            'tracking_token' => $order->tracking_token,
            'status'         => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'customer_name'  => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'customer_email' => $order->customer_email,
            'customer_address'=> $order->customer_address,
            'city'           => $order->city,
            'subtotal'       => $order->subtotal,
            'shipping'       => $order->shipping,
            'discount'       => $order->discount ?? 0,
            'coupon_code'    => $order->coupon_code,
            'total'          => $order->total,
            'notes'          => $order->notes,
            'created_at'     => $order->created_at->format('M d, Y h:i A'),
            'current_step'   => $currentStep,
            'cancelled'      => $order->status === 'cancelled',
            'items'          => $order->items->map(fn($item) => [
                'name'     => $item->product_name,
                'quantity' => $item->quantity,
                'price'    => $item->price,
                'subtotal' => $item->subtotal,
                'image'    => $item->product?->productImages->first()?->url,
                'slug'     => $item->product?->slug,
            ])->toArray(),
            'history' => $order->statusHistory->map(fn($h) => [
                'status'     => $h->status,
                'note'       => $h->note,
                'created_by' => $h->created_by,
                'date'       => \Carbon\Carbon::parse($h->created_at)->format('M d, Y h:i A'),
            ])->toArray(),
            'returns' => $order->returns,
        ];
    }
}
