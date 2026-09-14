<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class TailorStatusController extends Controller
{
    /**
     * Renders the actual "Tailor Orders" page in the customer's account
     * area — the page itself then calls checkStatus() below via a
     * client-side fetch to load the real data, so this render stays
     * fast and doesn't block on the external POS API.
     */
    public function index()
    {
        return \Inertia\Inertia::render('Account/TailorOrders');
    }

    /**
     * Called by the customer's browser (from their Account → Tailor
     * Orders tab). This method makes the actual call to the POS API,
     * server-side — the API key lives only here, in Laravel's own .env,
     * and never reaches the browser at all.
     */
    public function checkStatus(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Not logged in'], 401);
        }

        // Cached briefly per-user — avoids hammering the POS API if
        // someone refreshes the tab repeatedly, while still staying
        // reasonably current (tailor status doesn't change second to
        // second).
        $cacheKey = 'tailor_status_' . $user->id;

        $data = Cache::remember($cacheKey, 120, function () use ($user) {
            try {
                $response = Http::timeout(10)->withHeaders([
                    'x-api-key' => config('services.pos.tailor_status_key'),
                ])->get('https://pos.millionairepk.com/api/public/tailor-status', [
                    'email' => $user->email,
                    'phone' => $user->phone ?? null,
                ]);

                if (!$response->successful()) {
                    return null;
                }

                return $response->json();
            } catch (\Throwable $e) {
                \Log::warning('Tailor status check failed: ' . $e->getMessage());
                return null;
            }
        });

        if ($data === null) {
            return response()->json(['error' => 'Could not check tailor status right now'], 502);
        }

        // $data['found']    — bool, whether any customer record was matched
        // $data['customer'] — name, phone
        // $data['orders']   — array of tailor orders with status, dates, balance_due
        return response()->json($data);
    }
}
