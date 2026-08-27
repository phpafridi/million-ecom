<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    const CACHE_KEY = 'ml_settings_all';
    const CACHE_TTL = 3600; // 1 hour - settings rarely change

    public static function get(string $key, string $default = ''): string
    {
        return static::allKeyed()[$key] ?? $default;
    }

    public static function set(string $key, string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        static::clearCache();
    }

    public static function allKeyed(): array
    {
        return Cache::remember(static::CACHE_KEY, static::CACHE_TTL, function () {
            try {
                return static::pluck('value', 'key')->toArray();
            } catch (\Throwable $e) {
                return [];
            }
        });
    }

    public static function clearCache(): void
    {
        Cache::forget(static::CACHE_KEY);
    }
}
