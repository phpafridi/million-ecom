<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Analytics/Index', [
            'settings' => Setting::allKeyed(),
            'ga_data'  => null, // Extend later with GA4 Data API
        ]);
    }
}
