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

    // These two just render a different page with the same full settings
    // dump — every settings page picks out only the specific keys it
    // cares about. All three post to the same update() below, so there's
    // only ever one source of truth for how a setting actually gets saved,
    // regardless of which page it was edited from.
    public function branding()
    {
        return Inertia::render('Admin/Branding/Index', [
            'settings' => Setting::allKeyed(),
        ]);
    }

    public function notifications()
    {
        return Inertia::render('Admin/Notifications/Index', [
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
            'admin_email'            => 'nullable|email|max:100',
            'loyalty_enabled'        => 'nullable|string',
            'loyalty_points_rate'    => 'nullable|integer|min:1',
            'loyalty_redeem_enabled' => 'nullable|string',
            'loyalty_min_redeem'     => 'nullable|integer|min:1',
            'low_stock_threshold'    => 'nullable|integer|min:0',
            'mail_host'              => 'nullable|string|max:200',
            'mail_port'              => 'nullable|integer',
            'mail_username'          => 'nullable|string|max:200',
            'mail_password'          => 'nullable|string|max:200',
            'mail_encryption'        => 'nullable|string',
            'mail_from_address'      => 'nullable|email|max:200',
            'mail_from_name'         => 'nullable|string|max:100',
            'email_notify_customer'  => 'nullable|string',
            'email_notify_admin'     => 'nullable|string',
            'email_notify_on'        => 'nullable|string',
            'email_footer_text'      => 'nullable|string|max:200',
            'email_show_logo'        => 'nullable|string',
            'email_header_title'     => 'nullable|string|max:100',
            'email_primary_color'    => 'nullable|string|max:20',
            'email_accent_color'     => 'nullable|string|max:20',
            'whatsapp_enabled'       => 'nullable|string',
            'whatsapp_api_key'       => 'nullable|string|max:500',
            'whatsapp_phone_id'      => 'nullable|string|max:100',
            'whatsapp_admin_phone'   => 'nullable|string|max:20',
            'whatsapp_notify_customer'=> 'nullable|string',
            'whatsapp_notify_admin'  => 'nullable|string',
            'whatsapp_notify_on'     => 'nullable|string',
            'whatsapp_order_template'=> 'nullable|string|max:1000',
            'whatsapp_ship_template' => 'nullable|string|max:1000',
            'whatsapp_deliver_template'=> 'nullable|string|max:1000',
            'whatsapp_cancel_template'=> 'nullable|string|max:1000',
            'sms_enabled'            => 'nullable|string',
            'sms_provider'           => 'nullable|string|max:50',
            'sms_api_key'            => 'nullable|string|max:500',
            'sms_api_secret'         => 'nullable|string|max:500',
            'sms_api_url'            => 'nullable|string|max:500',
            'sms_sender_id'          => 'nullable|string|max:20',
            'sms_notify_on'          => 'nullable|string',
            'login_max_attempts'     => 'nullable|integer|min:1|max:20',
            'login_lockout_minutes'  => 'nullable|integer|min:1',
            'admin_max_attempts'     => 'nullable|integer|min:1|max:10',
            'admin_lockout_minutes'  => 'nullable|integer|min:1',
            'admin_email'            => 'nullable|email|max:100',
            'mail_host'              => 'nullable|string|max:200',
            'mail_port'              => 'nullable|integer',
            'mail_username'          => 'nullable|string|max:200',
            'mail_password'          => 'nullable|string|max:200',
            'mail_encryption'        => 'nullable|string',
            'mail_from_address'      => 'nullable|email|max:200',
            'mail_from_name'         => 'nullable|string|max:100',
            'email_notify_customer'  => 'nullable|string',
            'email_notify_admin'     => 'nullable|string',
            'email_notify_on'        => 'nullable|string',
            'email_footer_text'      => 'nullable|string|max:200',
            'email_show_logo'        => 'nullable|string',
            'email_header_title'     => 'nullable|string|max:100',
            'email_primary_color'    => 'nullable|string|max:20',
            'email_accent_color'     => 'nullable|string|max:20',
            'whatsapp_enabled'       => 'nullable|string',
            'whatsapp_api_key'       => 'nullable|string|max:500',
            'whatsapp_phone_id'      => 'nullable|string|max:100',
            'whatsapp_admin_phone'   => 'nullable|string|max:20',
            'whatsapp_notify_customer'=> 'nullable|string',
            'whatsapp_notify_admin'  => 'nullable|string',
            'whatsapp_notify_on'     => 'nullable|string',
            'whatsapp_order_template'=> 'nullable|string|max:1000',
            'whatsapp_ship_template' => 'nullable|string|max:1000',
            'whatsapp_deliver_template'=> 'nullable|string|max:1000',
            'whatsapp_cancel_template'=> 'nullable|string|max:1000',
            'sms_enabled'            => 'nullable|string',
            'sms_provider'           => 'nullable|string|max:50',
            'sms_api_key'            => 'nullable|string|max:500',
            'sms_api_secret'         => 'nullable|string|max:500',
            'sms_api_url'            => 'nullable|string|max:500',
            'sms_sender_id'          => 'nullable|string|max:20',
            'sms_notify_on'          => 'nullable|string',
            'sms_order_template'     => 'nullable|string|max:500',
            'sms_ship_template'      => 'nullable|string|max:500',
            'sms_deliver_template'   => 'nullable|string|max:500',
            'sms_cancel_template'    => 'nullable|string|max:500',
            'address'                => 'nullable|string|max:300',
            // Previously just 'nullable|string|max:20' — accepted literally
            // any text under 20 characters, including a country name typed
            // in by mistake instead of an actual number. That produced a
            // broken wa.me link (WhatsApp's own redirect tried to interpret
            // the non-numeric value as a username instead of a phone
            // number). Now requires an actual phone number shape.
            'whatsapp_number'        => 'nullable|string|max:20|regex:/^\+?[0-9]{7,15}$/',
            'delivery_threshold'      => 'nullable|numeric',
            'login_max_attempts'      => 'nullable|integer|min:1|max:20',
            'login_lockout_minutes'   => 'nullable|integer|min:1|max:1440',
            'admin_max_attempts'      => 'nullable|integer|min:1|max:10',
            'admin_lockout_minutes'   => 'nullable|integer|min:1|max:1440',
            'shipping_fee'           => 'nullable|numeric',
            'shipping_fee'           => 'nullable|numeric',
            'facebook_url'           => 'nullable|url',
            'instagram_url'          => 'nullable|url',
            'twitter_url'            => 'nullable|url',
            'youtube_url'            => 'nullable|url',
            'topbar_message'         => 'nullable|string|max:200',
            'sale_enabled'           => 'nullable|string',
            'sale_label'             => 'nullable|string|max:100',
            'sale_badge'             => 'nullable|string|max:100',
            'sale_ends_at'           => 'nullable|string|max:30',
            'sale_bg'                => 'nullable|string|max:20',
            'sale_text_color'        => 'nullable|string|max:20',
            'sale_discount'          => 'nullable|integer|min:0|max:99',
            'admin_path'             => 'nullable|string|max:50|alpha_dash',
            'show_whatsapp_button'   => 'nullable|in:0,1',
            'show_facebook_button'   => 'nullable|in:0,1',
            'show_instagram_button'  => 'nullable|in:0,1',
            'show_phone_button'      => 'nullable|in:0,1',
            'product_contact_method' => 'nullable|string|in:whatsapp,messenger,phone,email,none',
            'product_card_contact'   => 'nullable|string|in:whatsapp,messenger,phone,none',
            'messenger_url'          => 'nullable|url',
            // Was configurable from a page (WhatsApp/Index.tsx) but missing
            // from this whitelist entirely, so it silently never actually
            // saved despite the product page genuinely reading it.
            'whatsapp_product_msg'   => 'nullable|string|max:500',
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
            'header_title_color'     => 'nullable|string|max:20',
            'search_text_color'      => 'nullable|string|max:20',
            // Floating button controls — enable/disable, corner, and size
            // for Chat, Cart, and WhatsApp independently, so they can be
            // positioned without overlapping each other.
            'chat_float_enabled'     => 'nullable|in:0,1',
            'chat_float_position'    => 'nullable|in:left,right',
            'chat_float_size'        => 'nullable|in:sm,md,lg',
            'cart_float_enabled'     => 'nullable|in:0,1',
            'cart_float_position'    => 'nullable|in:left,right',
            'cart_float_size'        => 'nullable|in:sm,md,lg',
            'whatsapp_float_enabled' => 'nullable|in:0,1',
            'whatsapp_float_position'=> 'nullable|in:left,right',
            'whatsapp_float_size'    => 'nullable|in:sm,md,lg',
            'header_subtitle_color'  => 'nullable|string|max:20',
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
            'category_page_bg_color'  => 'nullable|string|max:20',
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
            'category_page_bg_color' => 'nullable|string|max:20',

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
            'home_divider_text'      => 'nullable|string|max:80',
            'logo'                   => 'nullable|image|max:2048',
        ]);

        $oldAdminPath     = Setting::get('admin_path', 'tijar-admin');
        $newAdminPath     = $data['admin_path'] ?? $oldAdminPath;
        $adminPathChanged = $newAdminPath !== $oldAdminPath;

        $keys = [
            'site_name','site_tagline','phone','email','admin_email','address','whatsapp_number','mail_host','mail_port','mail_username','mail_password','mail_encryption','mail_from_address','mail_from_name','email_notify_customer','email_notify_admin','email_notify_on','email_footer_text','email_show_logo','email_header_title','email_primary_color','email_accent_color','whatsapp_enabled','whatsapp_api_key','whatsapp_phone_id','whatsapp_admin_phone','whatsapp_notify_customer','whatsapp_notify_admin','whatsapp_notify_on','whatsapp_order_template','whatsapp_ship_template','whatsapp_deliver_template','whatsapp_cancel_template','sms_enabled','sms_provider','sms_api_key','sms_api_secret','sms_api_url','sms_sender_id','sms_notify_on','sms_order_template','sms_ship_template','sms_deliver_template','sms_cancel_template',
            'delivery_threshold','shipping_fee','login_max_attempts','login_lockout_minutes','admin_max_attempts','admin_lockout_minutes','facebook_url','instagram_url',
            'twitter_url','youtube_url','topbar_message','admin_path','sale_enabled','sale_label','sale_badge','sale_ends_at','sale_bg','sale_text_color','sale_discount',
            'show_whatsapp_button','show_facebook_button','show_instagram_button',
            'show_phone_button','product_contact_method','product_card_contact','messenger_url','whatsapp_product_msg',
            'trust_1_icon','trust_1_title','trust_1_sub',
            'trust_2_icon','trust_2_title','trust_2_sub',
            'trust_3_icon','trust_3_title','trust_3_sub',
            'trust_4_icon','trust_4_title','trust_4_sub',
            'trust_5_icon','trust_5_title','trust_5_sub',
            'trust_bar_bg','trust_icon_color','trust_title_color','trust_sub_color','header_title_color','header_subtitle_color','search_text_color',
            'chat_float_enabled','chat_float_position','chat_float_size',
            'cart_float_enabled','cart_float_position','cart_float_size',
            'whatsapp_float_enabled','whatsapp_float_position','whatsapp_float_size',
            'ticker_bg','ticker_live_bg','ticker_live_text','ticker_text_color',
            'brands_show','brands_title','brands_subtitle','brands_items','home_divider_text',
            'ticker_items',
            'topbar_bg','theme_primary','theme_primary_dark','theme_primary_text',
            'theme_accent','theme_dark_bg','theme_dark_bg2','theme_body_bg','theme_border_radius',
            'category_page_bg_color',
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

        \App\Models\Setting::clearCache();
        \App\Models\Setting::clearCache();
        \App\Models\Setting::clearCache();
        return back()->with('success', 'Settings saved.');
    }
}
