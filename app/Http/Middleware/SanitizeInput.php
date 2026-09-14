<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeInput
{
    // Fields deliberately excluded — these legitimately need to carry
    // markup or special characters that stripping would break: password
    // fields (any characters are valid), and rich-text fields explicitly
    // meant to allow safe HTML (handled separately with a proper HTML
    // purifier if ever needed, not blanket tag-stripping).
    private array $excluded = [
        'password', 'password_confirmation', 'current_password',
    ];

    public function handle(Request $request, Closure $next)
    {
        $input = $request->all();
        array_walk_recursive($input, function (&$value, $key) {
            if (!is_string($value) || in_array($key, $this->excluded, true)) {
                return;
            }
            // strip_tags removes actual HTML/script tags entirely (the
            // part that actually executes in a browser) rather than
            // just escaping them — this runs BEFORE validation/storage,
            // on top of (not instead of) Blade/React's own output
            // escaping, which still applies as a second layer.
            $value = strip_tags($value);
        });
        $request->merge($input);

        return $next($request);
    }
}
