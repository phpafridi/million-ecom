<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'settings' => Setting::allKeyed(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'site_name'              => 'nullable|string|max:100',
            'site_tagline'           => 'nullable|string|max:200',
            'phone'                  => 'nullable|string|max:30',
            'email'                  => 'nullable|email|max:100',
            'address'                => 'nullable|string|max:300',
            'whatsapp_number'        => 'nullable|string|max:20',
            'delivery_threshold'     => 'nullable|numeric',
            'shipping_fee'           => 'nullable|numeric',
            'shipping_fee'           => 'nullable|numeric',
            'facebook_url'           => 'nullable|url',
            'instagram_url'          => 'nullable|url',
            'twitter_url'            => 'nullable|url',
            'youtube_url'            => 'nullable|url',
            'topbar_message'         => 'nullable|string|max:200',
            'admin_path'             => 'nullable|string|max:50|alpha_dash',
            'show_whatsapp_button'   => 'nullable|in:0,1',
            'show_facebook_button'   => 'nullable|in:0,1',
            'show_instagram_button'  => 'nullable|in:0,1',
            'show_phone_button'      => 'nullable|in:0,1',
            'product_contact_method' => 'nullable|string|in:whatsapp,messenger,phone,email,none',
            'product_card_contact'   => 'nullable|string|in:whatsapp,messenger,phone,none',
            'messenger_url'          => 'nullable|url',
            'trust_1_icon'           => 'nullable|string|max:10',
            'trust_1_title'          => 'nullable|string|max:50',
            'trust_1_sub'            => 'nullable|string|max:100',
            'trust_2_icon'           => 'nullable|string|max:10',
            'trust_2_title'          => 'nullable|string|max:50',
            'trust_2_sub'            => 'nullable|string|max:100',
            'trust_3_icon'           => 'nullable|string|max:10',
            'trust_3_title'          => 'nullable|string|max:50',
            'trust_3_sub'            => 'nullable|string|max:100',
            'trust_4_icon'           => 'nullable|string|max:10',
            'trust_4_title'          => 'nullable|string|max:50',
            'trust_4_sub'            => 'nullable|string|max:100',
            'trust_5_icon'           => 'nullable|string|max:10',
            'trust_5_title'          => 'nullable|string|max:50',
            'trust_5_sub'            => 'nullable|string|max:100',
            'ticker_items'           => 'nullable|string|max:500',
            'trust_bar_bg'           => 'nullable|string|max:20',
            'trust_icon_color'       => 'nullable|string|max:20',
            'trust_title_color'      => 'nullable|string|max:20',
            'trust_sub_color'        => 'nullable|string|max:20',
            'ticker_bg'              => 'nullable|string|max:20',
            'ticker_live_bg'         => 'nullable|string|max:20',
            'ticker_live_text'       => 'nullable|string|max:20',
            'ticker_text_color'       => 'nullable|string|max:20',
            // Navbar
            'navbar_bg'               => 'nullable|string|max:20',
            'navbar_text_color'       => 'nullable|string|max:20',
            'navbar_border_color'     => 'nullable|string|max:20',
            'subnav_bg'               => 'nullable|string|max:20',
            'logo_box_bg'             => 'nullable|string|max:20',
            // Theme
            'topbar_bg'               => 'nullable|string|max:20',
            'theme_primary'           => 'nullable|string|max:20',
            'theme_primary_dark'      => 'nullable|string|max:20',
            'theme_primary_text'      => 'nullable|string|max:20',
            'theme_accent'            => 'nullable|string|max:20',
            'theme_dark_bg'           => 'nullable|string|max:20',
            'theme_dark_bg2'          => 'nullable|string|max:20',
            'theme_body_bg'           => 'nullable|string|max:20',
            'theme_border_radius'     => 'nullable|string|max:5',
            // Cart & Chat
            'cart_bubble_color'       => 'nullable|string|max:20',
            'cart_bubble_text_color'  => 'nullable|string|max:20',
            'cart_bubble_icon'        => 'nullable|string|max:10',
            'chat_bubble_color'       => 'nullable|string|max:20',
            'chat_bubble_icon'        => 'nullable|string|max:10',
            // Tracking
            'ga_enabled'              => 'nullable|string|max:1',
            'ga_measurement_id'       => 'nullable|string|max:30',
            'ga_api_secret'           => 'nullable|string|max:100',
            'gtm_enabled'             => 'nullable|string|max:1',
            'gtm_id'                  => 'nullable|string|max:20',
            'fb_pixel_enabled'        => 'nullable|string|max:1',
            'fb_pixel_id'             => 'nullable|string|max:30',
            'tiktok_pixel_enabled'    => 'nullable|string|max:1',
            'tiktok_pixel_id'         => 'nullable|string|max:30',

            // Theme Colors
            'topbar_bg'           => 'nullable|string|max:20',
            'theme_primary'       => 'nullable|string|max:20',
            'theme_primary_dark'  => 'nullable|string|max:20',
            'theme_primary_text'  => 'nullable|string|max:20',
            'theme_accent'        => 'nullable|string|max:20',
            'theme_dark_bg'       => 'nullable|string|max:20',
            'theme_dark_bg2'      => 'nullable|string|max:20',
            'theme_body_bg'       => 'nullable|string|max:20',
            'theme_border_radius' => 'nullable|string|max:5',

            // Analytics
            'ga_enabled'             => 'nullable|string|max:1',
            'ga_measurement_id'      => 'nullable|string|max:30',
            'ga_api_secret'          => 'nullable|string|max:100',
            'gtm_enabled'            => 'nullable|string|max:1',
            'gtm_id'                 => 'nullable|string|max:20',
            'fb_pixel_enabled'       => 'nullable|string|max:1',
            'fb_pixel_id'            => 'nullable|string|max:30',
            'tiktok_pixel_enabled'   => 'nullable|string|max:1',
            'tiktok_pixel_id'        => 'nullable|string|max:30',
            'brands_show'            => 'nullable|string|max:1',
            'brands_title'           => 'nullable|string|max:50',
            'brands_subtitle'        => 'nullable|string|max:50',
            'brands_items'           => 'nullable|string|max:300',
            'logo'                   => 'nullable|image|max:2048',
        ]);

        $oldAdminPath     = Setting::get('admin_path', 'tijar-admin');
        $newAdminPath     = $data['admin_path'] ?? $oldAdminPath;
        $adminPathChanged = $newAdminPath !== $oldAdminPath;

        $keys = [
            'site_name','site_tagline','phone','email','address','whatsapp_number',
            'delivery_threshold','shipping_fee','facebook_url','instagram_url',
            'twitter_url','youtube_url','topbar_message','admin_path',
            'show_whatsapp_button','show_facebook_button','show_instagram_button',
            'show_phone_button','product_contact_method','product_card_contact','messenger_url',
            'trust_1_icon','trust_1_title','trust_1_sub',
            'trust_2_icon','trust_2_title','trust_2_sub',
            'trust_3_icon','trust_3_title','trust_3_sub',
            'trust_4_icon','trust_4_title','trust_4_sub',
            'trust_5_icon','trust_5_title','trust_5_sub',
            'trust_bar_bg','trust_icon_color','trust_title_color','trust_sub_color',
            'ticker_bg','ticker_live_bg','ticker_live_text','ticker_text_color',
            'brands_show','brands_title','brands_subtitle','brands_items',
            'ticker_items',
            'topbar_bg','theme_primary','theme_primary_dark','theme_primary_text',
            'theme_accent','theme_dark_bg','theme_dark_bg2','theme_body_bg','theme_border_radius',
            'ga_enabled','ga_measurement_id','ga_api_secret',
            'gtm_enabled','gtm_id',
            'fb_pixel_enabled','fb_pixel_id',
            'tiktok_pixel_enabled','tiktok_pixel_id',
        ];

        foreach ($keys as $key) {
            if (array_key_exists($key, $data)) {
                Setting::set($key, (string) ($data[$key] ?? ''));
            }
        }

        if ($request->hasFile('logo')) {
            $url = ImageService::process($request->file('logo'), 'settings', 'logo', 'logo_' . time());
            Setting::set('logo_url', $url);
        }

        if ($adminPathChanged) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect("/{$newAdminPath}/login")
                ->with('success', "Admin URL changed. Please log in at /{$newAdminPath}");
        }

        return back()->with('success', 'Settings saved.');
    }
}
