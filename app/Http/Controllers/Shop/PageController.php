<?php
namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Inertia\Inertia;

class PageController extends Controller
{
    private function s(string $key, string $default): string
    {
        return Setting::get($key, $default);
    }

    public function about()
    {
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        $tagline  = $this->s('about_tagline', 'Pakistan\'s premium lifestyle store — founded on the belief that luxury should be accessible to everyone who values quality.');
        return Inertia::render('Info/About', [
            'settings' => Setting::allKeyed(),
            'seo'      => [
                'title'       => 'About Us | ' . $siteName,
                'description' => substr(strip_tags($tagline), 0, 160),
            ],
            'content'  => [
                'about_hero_title1' => $this->s('about_hero_title1', 'Wear Your'),
                'about_hero_title2' => $this->s('about_hero_title2', 'Status.'),
                'about_tagline'  => $this->s('about_tagline',  'Pakistan\'s premium lifestyle store — founded on the belief that luxury should be accessible to everyone who values quality.'),

                'about_stat1_value' => $this->s('about_stat1_value', '50,000+'), 'about_stat1_label' => $this->s('about_stat1_label', 'Happy Customers'),
                'about_stat2_value' => $this->s('about_stat2_value', '1,000+'),  'about_stat2_label' => $this->s('about_stat2_label', 'Premium Products'),
                'about_stat3_value' => $this->s('about_stat3_value', '7'),       'about_stat3_label' => $this->s('about_stat3_label', 'Product Categories'),
                'about_stat4_value' => $this->s('about_stat4_value', '4.9★'),    'about_stat4_label' => $this->s('about_stat4_label', 'Average Rating'),

                'about_mission_heading' => $this->s('about_mission_heading', 'Premium lifestyle. Honest prices.'),
                'about_mission'  => $this->s('about_mission',  'MILLIONAIRE was founded with one goal — make premium quality fashion and lifestyle products accessible to every Pakistani who knows their worth.'),
                'about_mission2' => $this->s('about_mission2', 'From signature clothing to luxury perfumes, premium watches to designer sunglasses — every product is carefully selected to match the MILLIONAIRE standard.'),
                'about_vision_heading' => $this->s('about_vision_heading', 'Pakistan\'s most trusted premium store.'),
                'about_vision'   => $this->s('about_vision',   'We are building a brand that Pakistanis trust for quality, speed and service. Every order we fulfill is a step toward that vision.'),
                'about_vision2'  => $this->s('about_vision2',  'Whether you shop from Karachi, Lahore or a small city, MILLIONAIRE delivers the same premium experience to your doorstep.'),

                'about_values_eyebrow' => $this->s('about_values_eyebrow', 'Why MILLIONAIRE'),
                'about_values_title'   => $this->s('about_values_title', 'The MILLIONAIRE Promise'),
                'about_value1_icon' => $this->s('about_value1_icon', '💎'), 'about_value1_title' => $this->s('about_value1_title', 'Premium Quality'), 'about_value1_desc' => $this->s('about_value1_desc', 'Every product is hand-selected and verified for authenticity. We never compromise on quality.'),
                'about_value2_icon' => $this->s('about_value2_icon', '🚚'), 'about_value2_title' => $this->s('about_value2_title', 'Fast Delivery'), 'about_value2_desc' => $this->s('about_value2_desc', 'Lahore, Karachi, Islamabad — 2 to 3 business days. All other cities within 5 days.'),
                'about_value3_icon' => $this->s('about_value3_icon', '🔒'), 'about_value3_title' => $this->s('about_value3_title', 'Secure Payments'), 'about_value3_desc' => $this->s('about_value3_desc', 'PayFast, JazzCash, Easypaisa, Bank Transfer, COD — all payments secured and verified.'),
                'about_value4_icon' => $this->s('about_value4_icon', '↩️'), 'about_value4_title' => $this->s('about_value4_title', 'Easy Returns'), 'about_value4_desc' => $this->s('about_value4_desc', '7-day hassle-free returns on clothing. 30 days on shoes. Your satisfaction is guaranteed.'),
                'about_value5_icon' => $this->s('about_value5_icon', '🎧'), 'about_value5_title' => $this->s('about_value5_title', '24/7 Support'), 'about_value5_desc' => $this->s('about_value5_desc', 'Our team is always available via WhatsApp, live chat, or email to assist you.'),
                'about_value6_icon' => $this->s('about_value6_icon', '✅'), 'about_value6_title' => $this->s('about_value6_title', '100% Genuine'), 'about_value6_desc' => $this->s('about_value6_desc', 'Every item is 100% authentic. No replicas, no fakes — ever.'),

                'about_team_eyebrow' => $this->s('about_team_eyebrow', 'The Team'),
                'about_team_title'   => $this->s('about_team_title', 'People Behind MILLIONAIRE'),
                'about_team1_emoji' => $this->s('about_team1_emoji', '👑'), 'about_team1_name' => $this->s('about_team1_name', 'Salman Afridi'), 'about_team1_role' => $this->s('about_team1_role', 'Founder & CEO'),
                'about_team2_emoji' => $this->s('about_team2_emoji', '📦'), 'about_team2_name' => $this->s('about_team2_name', 'Operations'), 'about_team2_role' => $this->s('about_team2_role', 'Warehouse & Fulfillment'),
                'about_team3_emoji' => $this->s('about_team3_emoji', '🎧'), 'about_team3_name' => $this->s('about_team3_name', 'Customer Care'), 'about_team3_role' => $this->s('about_team3_role', 'Support Team'),

                'about_cta_eyebrow'  => $this->s('about_cta_eyebrow', 'Start Shopping'),
                'about_cta_title'    => $this->s('about_cta_title', 'Ready to wear your status?'),
                'about_cta_subtitle' => $this->s('about_cta_subtitle', 'Join 50,000+ customers who trust MILLIONAIRE for premium lifestyle products.'),
            ],
        ]);
    }

    public function contact()
    {
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        $subtitle = $this->s('contact_hero_subtitle', 'Questions about your order, products, or anything else? Our team responds within 1 hour during business hours.');
        return Inertia::render('Info/Contact', [
            'settings' => Setting::allKeyed(),
            'seo'      => [
                'title'       => 'Contact Us | ' . $siteName,
                'description' => substr(strip_tags($subtitle), 0, 160),
            ],
            'content'  => [
                'contact_hero_eyebrow'  => $this->s('contact_hero_eyebrow', 'Get in Touch'),
                'contact_hero_title1'   => $this->s('contact_hero_title1', "We're here to help"),
                'contact_hero_title2'   => $this->s('contact_hero_title2', 'anytime.'),
                'contact_hero_subtitle' => $this->s('contact_hero_subtitle', 'Questions about your order, products, or anything else? Our team responds within 1 hour during business hours.'),

                'contact_hours1_day' => $this->s('contact_hours1_day', 'Monday – Saturday'), 'contact_hours1_time' => $this->s('contact_hours1_time', '10:00 AM – 8:00 PM'),
                'contact_hours2_day' => $this->s('contact_hours2_day', 'Sunday'),             'contact_hours2_time' => $this->s('contact_hours2_time', '12:00 PM – 6:00 PM'),
                'contact_hours3_day' => $this->s('contact_hours3_day', 'WhatsApp / Live Chat'), 'contact_hours3_time' => $this->s('contact_hours3_time', '24 / 7'),

                'contact_response_note' => $this->s('contact_response_note', 'We respond within 1 hour · Mon–Sat 10AM–8PM'),
            ],
        ]);
    }

    private function policy(array $page)
    {
        $siteName = Setting::get('site_name', 'MILLIONAIRE');
        return Inertia::render('Info/Policy', [
            'settings' => Setting::allKeyed(),
            'page'     => $page,
            'seo'      => [
                'title'       => $page['title'] . ' | ' . $siteName,
                'description' => substr(strip_tags($page['subtitle'] ?? ''), 0, 160),
            ],
        ]);
    }

    public function returnPolicy()
    {
        abort_unless(Setting::get('policy_return_enabled', '1') !== '0', 404);
        $s = Setting::get('site_name', 'MILLIONAIRE');
        return $this->policy([
            'title'    => $this->s('policy_return_title',    'Return & Exchange Policy'),
            'subtitle' => $this->s('policy_return_subtitle', 'Our commitment to your satisfaction'),
            'icon'     => '↩️',
            'updated'  => 'August 2026',
            'sections' => [
                ['title' => $this->s('policy_return_s1_title', 'Return Period'),
                 'content'=> $this->s('policy_return_s1', "• Clothing: 7 days from the date of purchase\n• Shoes: 30 days from the date of purchase\n• Other products: As per product warranty terms\n\nReturns requested after the applicable period will not be accepted.")],
                ['title' => $this->s('policy_return_s2_title', 'Return Conditions'),
                 'content'=> $this->s('policy_return_s2', "To be eligible for a return, the item must meet all of the following conditions:\n\n• Original receipt or invoice required\n• Product must be unused, unwashed and unworn\n• No damage, alterations or modifications\n• Original packaging, tags and labels must be intact\n• All returns are subject to inspection and approval by {$s}")],
                ['title' => $this->s('policy_return_s3_title', 'Customized Products'),
                 'content'=> $this->s('policy_return_s3', "Products made to custom specifications — including specific sizes, colors or designs ordered on request — are not eligible for return or exchange, unless there is a proven manufacturing defect.")],
                ['title' => $this->s('policy_return_s4_title', 'Perfumes & Fragrances'),
                 'content'=> $this->s('policy_return_s4', "Once the sealed packaging of a perfume or fragrance product has been opened or the product has been used, it cannot be returned or exchanged.\n\nReturns are only accepted in cases of a proven manufacturing defect, with the original sealed packaging intact.")],
                ['title' => $this->s('policy_return_s5_title', 'Watches & Accessories'),
                 'content'=> $this->s('policy_return_s5', "Watch returns and warranty claims are handled as per the product warranty terms.\n\n• Original invoice and warranty card required for all warranty claims\n• Physical damage, water damage or unauthorized repairs will void the warranty\n• Cosmetic wear and tear is not covered under warranty")],
                ['title' => $this->s('policy_return_s6_title', 'Defective Products'),
                 'content'=> $this->s('policy_return_s6', "If you receive a defective or damaged product, contact our Customer Service team immediately upon delivery.\n\nDo not use the product. After inspection and verification, we will arrange one of the following:\n\n• Exchange for the same product\n• Repair (where applicable)\n• Replacement with equivalent product\n• Full refund")],
                ['title' => $this->s('policy_return_s7_title', 'Refunds'),
                 'content'=> $this->s('policy_return_s7', "Upon approval of a return, we will process your refund as follows:\n\n• Online payments (PayFast, JazzCash, Easypaisa): Refunded to original payment method within 3-7 business days\n• Bank Transfer: Refunded to your bank account within 3-7 business days\n• Cash on Delivery: Refunded as Store Credit or bank transfer\n\nCash refunds are not guaranteed for all return scenarios. {$s} reserves the right to offer store credit in lieu of a cash refund.")],
                ['title' => $this->s('policy_return_s8_title', 'Return Shipping'),
                 'content'=> $this->s('policy_return_s8', "For online orders, return shipping costs depend on the reason for the return:\n\n• Manufacturing defect or wrong item sent: {$s} covers return shipping\n• Change of mind or size exchange: Customer covers return shipping\n\n{$s} is not responsible for returns lost in transit. Always use a trackable shipping method and retain your receipt.")],
            ],
        ]);
    }

    public function privacyPolicy()
    {
        abort_unless(Setting::get('policy_privacy_enabled', '1') !== '0', 404);
        $s = Setting::get('site_name', 'MILLIONAIRE');
        $e = Setting::get('email', 'support@millionaire.pk');
        return $this->policy([
            'title'    => $this->s('policy_privacy_title',    'Privacy Policy'),
            'subtitle' => $this->s('policy_privacy_subtitle', 'How we collect, use and protect your personal information'),
            'icon'     => '🔒',
            'updated'  => 'August 2026',
            'sections' => [
                ['title'  => $this->s('policy_privacy_s1_title', 'Information We Collect'),
                 'content' => $this->s('policy_privacy_s1', "When you use our website or place an order, we may collect the following information:\n\n• Full name, email address and phone number\n• Delivery address and city\n• Payment information (processed securely via third-party gateways — not stored by us)\n• Order history and product preferences\n• Device information and browsing data (via cookies and analytics tools)")],
                ['title'  => $this->s('policy_privacy_s2_title', 'How We Use Your Information'),
                 'content' => $this->s('policy_privacy_s2', "We use the information we collect to:\n\n• Process and deliver your orders\n• Send order confirmation, tracking updates and delivery notifications\n• Provide customer support and respond to enquiries\n• Send promotional offers and newsletters (only if you have opted in)\n• Improve our website, products and services\n• Comply with legal and regulatory obligations")],
                ['title'  => $this->s('policy_privacy_s3_title', 'Data Sharing'),
                 'content' => $this->s('policy_privacy_s3', "We never sell your personal data to third parties. We only share your information with:\n\n• Delivery and courier partners — to fulfill and ship your orders\n• Payment processors (PayFast, JazzCash, Easypaisa) — for secure payment processing\n• Analytics services (Google Analytics) — using anonymized data only\n• Legal authorities — when required by applicable law")],
                ['title'  => $this->s('policy_privacy_s4_title', 'Cookies'),
                 'content' => $this->s('policy_privacy_s4', "We use cookies to enhance your browsing experience:\n\n• Functional cookies: Keep items in your cart and maintain your login session\n• Analytics cookies: Google Analytics — help us understand website traffic (anonymized)\n• Marketing cookies: Facebook Pixel, TikTok Pixel — help us measure the effectiveness of our advertising\n\nYou can disable cookies in your browser settings. Note that disabling functional cookies may affect the shopping experience.")],
                ['title'  => $this->s('policy_privacy_s5_title', 'Data Security'),
                 'content' => $this->s('policy_privacy_s5', "We take data security seriously and implement the following measures:\n\n• SSL/TLS encryption on all pages and transactions\n• Secure, PCI-DSS compliant payment processing\n• Regular security audits and updates\n• Strict staff access controls and data handling policies")],
                ['title'  => $this->s('policy_privacy_s6_title', 'Your Rights'),
                 'content' => $this->s('policy_privacy_s6', "You have the following rights regarding your personal data:\n\n• Access: Request a copy of the personal data we hold about you\n• Correction: Request corrections to any inaccurate data\n• Deletion: Request deletion of your account and associated data\n• Opt-out: Unsubscribe from marketing emails at any time\n\nTo exercise any of these rights, please contact us at {$e}")],
            ],
        ]);
    }

    public function termsOfService()
    {
        abort_unless(Setting::get('policy_terms_enabled', '1') !== '0', 404);
        $s = Setting::get('site_name', 'MILLIONAIRE');
        return $this->policy([
            'title'    => $this->s('policy_terms_title',    'Terms of Service'),
            'subtitle' => $this->s('policy_terms_subtitle', 'Please read these terms carefully before using our website'),
            'icon'     => '📋',
            'updated'  => 'August 2026',
            'sections' => [
                ['title'  => $this->s('policy_terms_s1_title', 'Acceptance of Terms'),
                 'content' => $this->s('policy_terms_s1', "By accessing and using the {$s} website, you confirm that you have read, understood and agreed to be bound by these Terms of Service.\n\nIf you do not agree to these terms, please discontinue use of our website immediately.")],
                ['title'  => $this->s('policy_terms_s2_title', 'Products & Pricing'),
                 'content' => $this->s('policy_terms_s2', "• All prices are displayed in Pakistani Rupees (Rs)\n• Prices may be changed without prior notice\n• Product images are for illustration purposes only — actual products may vary slightly in color or appearance\n• {$s} reserves the right to limit order quantities at any time\n• We are not responsible for typographical errors in product descriptions or pricing")],
                ['title'  => $this->s('policy_terms_s3_title', 'Orders & Payment'),
                 'content' => $this->s('policy_terms_s3', "• An order is confirmed only after payment is received (or Cash on Delivery is selected at checkout)\n• {$s} reserves the right to cancel any order due to stock unavailability or payment issues\n• Full payment is required before dispatch for all online payment methods\n• Cash on Delivery orders require full payment to the courier upon delivery\n• We reserve the right to refuse service to anyone at our discretion")],
                ['title'  => $this->s('policy_terms_s4_title', 'Delivery'),
                 'content' => $this->s('policy_terms_s4', "• Delivery timeframes are estimates only and are not guaranteed\n• {$s} is not liable for delays caused by courier services, weather, or other external factors\n• The customer must ensure someone is available to receive the order at the delivery address\n• Failed delivery attempts may result in the order being returned and a reshipping fee being charged")],
                ['title'  => $this->s('policy_terms_s5_title', 'Prohibited Use'),
                 'content' => $this->s('policy_terms_s5', "You agree not to use our website to:\n\n• Violate any applicable laws or regulations\n• Submit false, misleading or fraudulent information\n• Attempt to hack, disrupt or damage our website or servers\n• Copy, reproduce or distribute our content without written permission\n• Impersonate any person or entity")],
                ['title'  => $this->s('policy_terms_s6_title', 'Intellectual Property'),
                 'content' => $this->s('policy_terms_s6', "All content on this website — including text, images, logos, product descriptions and design — is the property of {$s} and is protected by intellectual property laws.\n\nNo content may be reproduced, distributed, copied or used without prior written permission from {$s}.")],
                ['title'  => $this->s('policy_terms_s7_title', 'Limitation of Liability'),
                 'content' => $this->s('policy_terms_s7', "{$s}'s total liability to you for any claim arising from the use of our website or products shall not exceed the purchase price you paid for the relevant order.\n\nWe are not liable for any indirect, incidental, consequential or special damages arising from the use of our website, products or services.")],
                ['title'  => $this->s('policy_terms_s8_title', 'Governing Law'),
                 'content' => $this->s('policy_terms_s8', "These Terms of Service are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan.\n\nAny disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.")],
            ],
        ]);
    }

    public function shippingPolicy()
    {
        abort_unless(Setting::get('policy_shipping_enabled', '1') !== '0', 404);
        $s = Setting::get('site_name', 'MILLIONAIRE');
        return $this->policy([
            'title'    => $this->s('policy_shipping_title',    'Shipping Policy'),
            'subtitle' => $this->s('policy_shipping_subtitle', 'Delivery timeframes, costs and important information'),
            'icon'     => '🚚',
            'updated'  => 'August 2026',
            'sections' => [
                ['title'  => $this->s('policy_shipping_s1_title', 'Delivery Timeframes'),
                 'content' => $this->s('policy_shipping_s1', "• Lahore, Karachi, Islamabad: 2-3 business days\n• Other major cities: 3-5 business days\n• Remote or rural areas: 5-7 business days\n\nOrders placed before 2:00 PM on a business day are processed and dispatched the same day. Orders placed after 2:00 PM or on weekends are processed the next business day.\n\nPlease note: Timeframes are estimates and may be affected by courier delays, public holidays or high-demand periods.")],
                ['title'  => $this->s('policy_shipping_s2_title', 'Delivery Charges'),
                 'content' => $this->s('policy_shipping_s2', "• Standard delivery: Rs 200 per order\n• Free delivery on orders above Rs 5,000\n• Same-day delivery (Lahore only, subject to availability): Rs 500\n\nDelivery charges are calculated and displayed at checkout before payment.")],
                ['title'  => $this->s('policy_shipping_s3_title', 'Order Tracking'),
                 'content' => $this->s('policy_shipping_s3', "Once your order has been dispatched, you will receive:\n\n• An SMS notification with your tracking number and courier details\n• An email confirmation with shipment information\n\nYou can track your order at any time by visiting our Track Order page and entering your order ID or email address.")],
                ['title'  => $this->s('policy_shipping_s4_title', 'Delivery Partners'),
                 'content' => $this->s('policy_shipping_s4', "{$s} works with Pakistan's leading courier services to ensure reliable delivery:\n\n• TCS\n• Leopards Courier\n• PostEx\n• M&P\n\nThe courier assigned to your order depends on your location and the size of your order.")],
                ['title'  => $this->s('policy_shipping_s5_title', 'Failed Delivery'),
                 'content' => $this->s('policy_shipping_s5', "If a delivery attempt is unsuccessful:\n\n• The courier will attempt delivery up to 3 times\n• You will be contacted via phone or SMS before each attempt\n• After 3 failed attempts, the order will be returned to us\n• A reshipping fee will be charged to resend a returned order\n\nPlease ensure your phone number and delivery address are correct when placing an order.")],
                ['title'  => $this->s('policy_shipping_s6_title', 'Damaged in Transit'),
                 'content' => $this->s('policy_shipping_s6', "If your order arrives visibly damaged:\n\n• Do not accept the delivery if the outer packaging is severely damaged\n• Take clear photos of the packaging and product immediately\n• Contact us within 24 hours of delivery with photos and your order number\n• We will arrange a replacement or refund after reviewing your claim")],
            ],
        ]);
    }

    public function paymentPolicy()
    {
        abort_unless(Setting::get('policy_payment_enabled', '1') !== '0', 404);
        $s = Setting::get('site_name', 'MILLIONAIRE');
        return $this->policy([
            'title'    => $this->s('policy_payment_title',    'Payment Policy'),
            'subtitle' => $this->s('policy_payment_subtitle', 'Accepted payment methods, security and refund timelines'),
            'icon'     => '💳',
            'updated'  => 'August 2026',
            'sections' => [
                ['title'  => $this->s('policy_payment_s1_title', 'Accepted Payment Methods'),
                 'content' => $this->s('policy_payment_s1', "{$s} accepts the following payment methods:\n\n• Cash on Delivery (COD) — Pay when your order arrives\n• PayFast — Visa, Mastercard, EFT and SnapScan\n• JazzCash — Mobile wallet and JazzCash card\n• Easypaisa — Mobile wallet\n• Bank Transfer — Direct bank deposit\n• Safepay — Pakistani debit and credit cards")],
                ['title'  => $this->s('policy_payment_s2_title', 'Cash on Delivery'),
                 'content' => $this->s('policy_payment_s2', "• Available across Pakistan\n• Pay in cash to the courier upon delivery\n• Exact amount preferred — couriers may not carry change\n• No advance payment required\n• COD orders are confirmed by our team via phone or WhatsApp before dispatch")],
                ['title'  => $this->s('policy_payment_s3_title', 'Online Payment Security'),
                 'content' => $this->s('policy_payment_s3', "All online payments on {$s} are secured by:\n\n• SSL/TLS encryption on all pages and transactions\n• We never store your card details — all card data is handled by our payment partners\n• PCI-DSS compliant payment gateways\n• 3D Secure authentication for card payments\n\nYour financial information is never visible to or stored by {$s}.")],
                ['title'  => $this->s('policy_payment_s4_title', 'Bank Transfer'),
                 'content' => $this->s('policy_payment_s4', "To pay by bank transfer:\n\n1. Place your order on our website\n2. Transfer the exact order total to our bank account (details provided at checkout)\n3. Upload a photo of your payment receipt in your order dashboard\n4. Your order will be processed and dispatched after payment confirmation (within 1-2 business hours)\n\nOrders paid by bank transfer will not be dispatched until payment is confirmed.")],
                ['title'  => $this->s('policy_payment_s5_title', 'Payment Failures'),
                 'content' => $this->s('policy_payment_s5', "If your payment fails during checkout:\n\n• No amount will be deducted from your account\n• If a deduction does occur, it will be automatically reversed within 3-5 business days\n• Try an alternative payment method or contact your bank\n• Contact our support team if the issue persists")],
                ['title'  => $this->s('policy_payment_s6_title', 'Refund Timelines'),
                 'content' => $this->s('policy_payment_s6', "Approved refunds are processed within the following timeframes:\n\n• PayFast (Card/EFT): 3-5 business days\n• JazzCash: 1-3 business days\n• Easypaisa: 1-3 business days\n• Bank Transfer: 3-7 business days\n• Cash on Delivery: Store credit or bank transfer (3-5 business days)\n\nRefund timelines may vary depending on your bank or payment provider.")],
            ],
        ]);
    }
}
