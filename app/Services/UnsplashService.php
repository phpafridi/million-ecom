<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UnsplashService
{
    // Unsplash's free tier allows 50 requests/hour — well within what a
    // single full reseed needs (categories + subcategories + products is
    // under that), but caching each query's result means a second reseed
    // run doesn't burn through the quota again for images already found.
    public function photoUrl(string $query): ?string
    {
        $key = config('services.unsplash.key');
        if (!$key) return null;

        $cacheKey = 'unsplash_' . md5($query);
        return \Illuminate\Support\Facades\Cache::remember($cacheKey, now()->addDays(30), function () use ($query, $key) {
            try {
                $response = Http::withHeaders(['Authorization' => "Client-ID {$key}"])
                    ->timeout(10)
                    ->get('https://api.unsplash.com/search/photos', [
                        'query'    => $query,
                        'per_page' => 1,
                        'orientation' => 'portrait',
                    ]);

                if (!$response->successful()) {
                    Log::warning("Unsplash search failed for '{$query}': " . $response->status());
                    return null;
                }

                $results = $response->json('results');
                return $results[0]['urls']['regular'] ?? null;
            } catch (\Throwable $e) {
                Log::warning("Unsplash search exception for '{$query}': " . $e->getMessage());
                return null;
            }
        });
    }
}
