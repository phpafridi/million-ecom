<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

/**
 * Restores About / Contact / Privacy / Terms / Return / Shipping / Payment
 * page content back to the original default text. Safe to run anytime —
 * it OVERWRITES whatever is currently saved for these specific keys with
 * the known-good original content. It does not touch any other settings
 * (theme, shipping fee, site name, etc).
 *
 * Run with:  php artisan db:seed --class=PageContentSeeder
 */
class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
        'about_hero_title1' => 'Wear Your',
        'about_hero_title2' => 'Status.',
        'about_tagline' => 'Pakistan\'s premium lifestyle store — founded on the belief that luxury should be accessible to everyone who values quality.',
        'about_stat1_value' => '50,000+',
        'about_stat1_label' => 'Happy Customers',
        'about_stat2_value' => '1,000+',
        'about_stat2_label' => 'Premium Products',
        'about_stat3_value' => '7',
        'about_stat3_label' => 'Product Categories',
        'about_stat4_value' => '4.9★',
        'about_stat4_label' => 'Average Rating',
        'about_mission_heading' => 'Premium lifestyle. Honest prices.',
        'about_mission' => 'MILLIONAIRE was founded with one goal — make premium quality fashion and lifestyle products accessible to every Pakistani who knows their worth.',
        'about_mission2' => 'From signature clothing to luxury perfumes, premium watches to designer sunglasses — every product is carefully selected to match the MILLIONAIRE standard.',
        'about_vision_heading' => 'Pakistan\'s most trusted premium store.',
        'about_vision' => 'We are building a brand that Pakistanis trust for quality, speed and service. Every order we fulfill is a step toward that vision.',
        'about_vision2' => 'Whether you shop from Karachi, Lahore or a small city, MILLIONAIRE delivers the same premium experience to your doorstep.',
        'about_values_eyebrow' => 'Why MILLIONAIRE',
        'about_values_title' => 'The MILLIONAIRE Promise',
        'about_value1_icon' => '💎',
        'about_value1_title' => 'Premium Quality',
        'about_value1_desc' => 'Every product is hand-selected and verified for authenticity. We never compromise on quality.',
        'about_value2_icon' => '🚚',
        'about_value2_title' => 'Fast Delivery',
        'about_value2_desc' => 'Lahore, Karachi, Islamabad — 2 to 3 business days. All other cities within 5 days.',
        'about_value3_icon' => '🔒',
        'about_value3_title' => 'Secure Payments',
        'about_value3_desc' => 'PayFast, JazzCash, Easypaisa, Bank Transfer, COD — all payments secured and verified.',
        'about_value4_icon' => '↩️',
        'about_value4_title' => 'Easy Returns',
        'about_value4_desc' => '7-day hassle-free returns on clothing. 30 days on shoes. Your satisfaction is guaranteed.',
        'about_value5_icon' => '🎧',
        'about_value5_title' => '24/7 Support',
        'about_value5_desc' => 'Our team is always available via WhatsApp, live chat, or email to assist you.',
        'about_value6_icon' => '✅',
        'about_value6_title' => '100% Genuine',
        'about_value6_desc' => 'Every item is 100% authentic. No replicas, no fakes — ever.',
        'about_team_eyebrow' => 'The Team',
        'about_team_title' => 'People Behind MILLIONAIRE',
        'about_team1_emoji' => '👑',
        'about_team1_name' => 'Salman Afridi',
        'about_team1_role' => 'Founder & CEO',
        'about_team2_emoji' => '📦',
        'about_team2_name' => 'Operations',
        'about_team2_role' => 'Warehouse & Fulfillment',
        'about_team3_emoji' => '🎧',
        'about_team3_name' => 'Customer Care',
        'about_team3_role' => 'Support Team',
        'about_cta_eyebrow' => 'Start Shopping',
        'about_cta_title' => 'Ready to wear your status?',
        'about_cta_subtitle' => 'Join 50,000+ customers who trust MILLIONAIRE for premium lifestyle products.',
        'contact_hero_eyebrow' => 'Get in Touch',
        'contact_hero_title1' => 'We\'re here to help',
        'contact_hero_title2' => 'anytime.',
        'contact_hero_subtitle' => 'Questions about your order, products, or anything else? Our team responds within 1 hour during business hours.',
        'contact_hours1_day' => 'Monday – Saturday',
        'contact_hours1_time' => '10:00 AM – 8:00 PM',
        'contact_hours2_day' => 'Sunday',
        'contact_hours2_time' => '12:00 PM – 6:00 PM',
        'contact_hours3_day' => 'WhatsApp / Live Chat',
        'contact_hours3_time' => '24 / 7',
        'contact_response_note' => 'We respond within 1 hour · Mon–Sat 10AM–8PM',
        'policy_return_title' => 'Return & Exchange Policy',
        'policy_return_subtitle' => 'Our commitment to your satisfaction',
        'policy_return_s1_title' => 'Return Period',
        'policy_return_s1' => '• Clothing: 7 days from the date of purchase
• Shoes: 30 days from the date of purchase
• Other products: As per product warranty terms

Returns requested after the applicable period will not be accepted.',
        'policy_return_s2_title' => 'Return Conditions',
        'policy_return_s2' => 'To be eligible for a return, the item must meet all of the following conditions:

• Original receipt or invoice required
• Product must be unused, unwashed and unworn
• No damage, alterations or modifications
• Original packaging, tags and labels must be intact
• All returns are subject to inspection and approval by MILLIONAIRE',
        'policy_return_s3_title' => 'Customized Products',
        'policy_return_s3' => 'Products made to custom specifications — including specific sizes, colors or designs ordered on request — are not eligible for return or exchange, unless there is a proven manufacturing defect.',
        'policy_return_s4_title' => 'Perfumes & Fragrances',
        'policy_return_s4' => 'Once the sealed packaging of a perfume or fragrance product has been opened or the product has been used, it cannot be returned or exchanged.

Returns are only accepted in cases of a proven manufacturing defect, with the original sealed packaging intact.',
        'policy_return_s5_title' => 'Watches & Accessories',
        'policy_return_s5' => 'Watch returns and warranty claims are handled as per the product warranty terms.

• Original invoice and warranty card required for all warranty claims
• Physical damage, water damage or unauthorized repairs will void the warranty
• Cosmetic wear and tear is not covered under warranty',
        'policy_return_s6_title' => 'Defective Products',
        'policy_return_s6' => 'If you receive a defective or damaged product, contact our Customer Service team immediately upon delivery.

Do not use the product. After inspection and verification, we will arrange one of the following:

• Exchange for the same product
• Repair (where applicable)
• Replacement with equivalent product
• Full refund',
        'policy_return_s7_title' => 'Refunds',
        'policy_return_s7' => 'Upon approval of a return, we will process your refund as follows:

• Online payments (PayFast, JazzCash, Easypaisa): Refunded to original payment method within 3-7 business days
• Bank Transfer: Refunded to your bank account within 3-7 business days
• Cash on Delivery: Refunded as Store Credit or bank transfer

Cash refunds are not guaranteed for all return scenarios. MILLIONAIRE reserves the right to offer store credit in lieu of a cash refund.',
        'policy_return_s8_title' => 'Return Shipping',
        'policy_return_s8' => 'For online orders, return shipping costs depend on the reason for the return:

• Manufacturing defect or wrong item sent: MILLIONAIRE covers return shipping
• Change of mind or size exchange: Customer covers return shipping

MILLIONAIRE is not responsible for returns lost in transit. Always use a trackable shipping method and retain your receipt.',
        'policy_privacy_title' => 'Privacy Policy',
        'policy_privacy_subtitle' => 'How we collect, use and protect your personal information',
        'policy_privacy_s1_title' => 'Information We Collect',
        'policy_privacy_s1' => 'When you use our website or place an order, we may collect the following information:

• Full name, email address and phone number
• Delivery address and city
• Payment information (processed securely via third-party gateways — not stored by us)
• Order history and product preferences
• Device information and browsing data (via cookies and analytics tools)',
        'policy_privacy_s2_title' => 'How We Use Your Information',
        'policy_privacy_s2' => 'We use the information we collect to:

• Process and deliver your orders
• Send order confirmation, tracking updates and delivery notifications
• Provide customer support and respond to enquiries
• Send promotional offers and newsletters (only if you have opted in)
• Improve our website, products and services
• Comply with legal and regulatory obligations',
        'policy_privacy_s3_title' => 'Data Sharing',
        'policy_privacy_s3' => 'We never sell your personal data to third parties. We only share your information with:

• Delivery and courier partners — to fulfill and ship your orders
• Payment processors (PayFast, JazzCash, Easypaisa) — for secure payment processing
• Analytics services (Google Analytics) — using anonymized data only
• Legal authorities — when required by applicable law',
        'policy_privacy_s4_title' => 'Cookies',
        'policy_privacy_s4' => 'We use cookies to enhance your browsing experience:

• Functional cookies: Keep items in your cart and maintain your login session
• Analytics cookies: Google Analytics — help us understand website traffic (anonymized)
• Marketing cookies: Facebook Pixel, TikTok Pixel — help us measure the effectiveness of our advertising

You can disable cookies in your browser settings. Note that disabling functional cookies may affect the shopping experience.',
        'policy_privacy_s5_title' => 'Data Security',
        'policy_privacy_s5' => 'We take data security seriously and implement the following measures:

• SSL/TLS encryption on all pages and transactions
• Secure, PCI-DSS compliant payment processing
• Regular security audits and updates
• Strict staff access controls and data handling policies',
        'policy_privacy_s6_title' => 'Your Rights',
        'policy_privacy_s6' => 'You have the following rights regarding your personal data:

• Access: Request a copy of the personal data we hold about you
• Correction: Request corrections to any inaccurate data
• Deletion: Request deletion of your account and associated data
• Opt-out: Unsubscribe from marketing emails at any time

To exercise any of these rights, please contact us at support@millionaire.pk',
        'policy_terms_title' => 'Terms of Service',
        'policy_terms_subtitle' => 'Please read these terms carefully before using our website',
        'policy_terms_s1_title' => 'Acceptance of Terms',
        'policy_terms_s1' => 'By accessing and using the MILLIONAIRE website, you confirm that you have read, understood and agreed to be bound by these Terms of Service.

If you do not agree to these terms, please discontinue use of our website immediately.',
        'policy_terms_s2_title' => 'Products & Pricing',
        'policy_terms_s2' => '• All prices are displayed in Pakistani Rupees (Rs)
• Prices may be changed without prior notice
• Product images are for illustration purposes only — actual products may vary slightly in color or appearance
• MILLIONAIRE reserves the right to limit order quantities at any time
• We are not responsible for typographical errors in product descriptions or pricing',
        'policy_terms_s3_title' => 'Orders & Payment',
        'policy_terms_s3' => '• An order is confirmed only after payment is received (or Cash on Delivery is selected at checkout)
• MILLIONAIRE reserves the right to cancel any order due to stock unavailability or payment issues
• Full payment is required before dispatch for all online payment methods
• Cash on Delivery orders require full payment to the courier upon delivery
• We reserve the right to refuse service to anyone at our discretion',
        'policy_terms_s4_title' => 'Delivery',
        'policy_terms_s4' => '• Delivery timeframes are estimates only and are not guaranteed
• MILLIONAIRE is not liable for delays caused by courier services, weather, or other external factors
• The customer must ensure someone is available to receive the order at the delivery address
• Failed delivery attempts may result in the order being returned and a reshipping fee being charged',
        'policy_terms_s5_title' => 'Prohibited Use',
        'policy_terms_s5' => 'You agree not to use our website to:

• Violate any applicable laws or regulations
• Submit false, misleading or fraudulent information
• Attempt to hack, disrupt or damage our website or servers
• Copy, reproduce or distribute our content without written permission
• Impersonate any person or entity',
        'policy_terms_s6_title' => 'Intellectual Property',
        'policy_terms_s6' => 'All content on this website — including text, images, logos, product descriptions and design — is the property of MILLIONAIRE and is protected by intellectual property laws.

No content may be reproduced, distributed, copied or used without prior written permission from MILLIONAIRE.',
        'policy_terms_s7_title' => 'Limitation of Liability',
        'policy_terms_s7' => 'MILLIONAIRE\'s total liability to you for any claim arising from the use of our website or products shall not exceed the purchase price you paid for the relevant order.

We are not liable for any indirect, incidental, consequential or special damages arising from the use of our website, products or services.',
        'policy_terms_s8_title' => 'Governing Law',
        'policy_terms_s8' => 'These Terms of Service are governed by and construed in accordance with the laws of the Islamic Republic of Pakistan.

Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.',
        'policy_shipping_title' => 'Shipping Policy',
        'policy_shipping_subtitle' => 'Delivery timeframes, costs and important information',
        'policy_shipping_s1_title' => 'Delivery Timeframes',
        'policy_shipping_s1' => '• Lahore, Karachi, Islamabad: 2-3 business days
• Other major cities: 3-5 business days
• Remote or rural areas: 5-7 business days

Orders placed before 2:00 PM on a business day are processed and dispatched the same day. Orders placed after 2:00 PM or on weekends are processed the next business day.

Please note: Timeframes are estimates and may be affected by courier delays, public holidays or high-demand periods.',
        'policy_shipping_s2_title' => 'Delivery Charges',
        'policy_shipping_s2' => '• Standard delivery: Rs 200 per order
• Free delivery on orders above Rs 5,000
• Same-day delivery (Lahore only, subject to availability): Rs 500

Delivery charges are calculated and displayed at checkout before payment.',
        'policy_shipping_s3_title' => 'Order Tracking',
        'policy_shipping_s3' => 'Once your order has been dispatched, you will receive:

• An SMS notification with your tracking number and courier details
• An email confirmation with shipment information

You can track your order at any time by visiting our Track Order page and entering your order ID or email address.',
        'policy_shipping_s4_title' => 'Delivery Partners',
        'policy_shipping_s4' => 'MILLIONAIRE works with Pakistan\'s leading courier services to ensure reliable delivery:

• TCS
• Leopards Courier
• PostEx
• M&P

The courier assigned to your order depends on your location and the size of your order.',
        'policy_shipping_s5_title' => 'Failed Delivery',
        'policy_shipping_s5' => 'If a delivery attempt is unsuccessful:

• The courier will attempt delivery up to 3 times
• You will be contacted via phone or SMS before each attempt
• After 3 failed attempts, the order will be returned to us
• A reshipping fee will be charged to resend a returned order

Please ensure your phone number and delivery address are correct when placing an order.',
        'policy_shipping_s6_title' => 'Damaged in Transit',
        'policy_shipping_s6' => 'If your order arrives visibly damaged:

• Do not accept the delivery if the outer packaging is severely damaged
• Take clear photos of the packaging and product immediately
• Contact us within 24 hours of delivery with photos and your order number
• We will arrange a replacement or refund after reviewing your claim',
        'policy_payment_title' => 'Payment Policy',
        'policy_payment_subtitle' => 'Accepted payment methods, security and refund timelines',
        'policy_payment_s1_title' => 'Accepted Payment Methods',
        'policy_payment_s1' => 'MILLIONAIRE accepts the following payment methods:

• Cash on Delivery (COD) — Pay when your order arrives
• PayFast — Visa, Mastercard, EFT and SnapScan
• JazzCash — Mobile wallet and JazzCash card
• Easypaisa — Mobile wallet
• Bank Transfer — Direct bank deposit
• Safepay — Pakistani debit and credit cards',
        'policy_payment_s2_title' => 'Cash on Delivery',
        'policy_payment_s2' => '• Available across Pakistan
• Pay in cash to the courier upon delivery
• Exact amount preferred — couriers may not carry change
• No advance payment required
• COD orders are confirmed by our team via phone or WhatsApp before dispatch',
        'policy_payment_s3_title' => 'Online Payment Security',
        'policy_payment_s3' => 'All online payments on MILLIONAIRE are secured by:

• SSL/TLS encryption on all pages and transactions
• We never store your card details — all card data is handled by our payment partners
• PCI-DSS compliant payment gateways
• 3D Secure authentication for card payments

Your financial information is never visible to or stored by MILLIONAIRE.',
        'policy_payment_s4_title' => 'Bank Transfer',
        'policy_payment_s4' => 'To pay by bank transfer:

1. Place your order on our website
2. Transfer the exact order total to our bank account (details provided at checkout)
3. Upload a photo of your payment receipt in your order dashboard
4. Your order will be processed and dispatched after payment confirmation (within 1-2 business hours)

Orders paid by bank transfer will not be dispatched until payment is confirmed.',
        'policy_payment_s5_title' => 'Payment Failures',
        'policy_payment_s5' => 'If your payment fails during checkout:

• No amount will be deducted from your account
• If a deduction does occur, it will be automatically reversed within 3-5 business days
• Try an alternative payment method or contact your bank
• Contact our support team if the issue persists',
        'policy_payment_s6_title' => 'Refund Timelines',
        'policy_payment_s6' => 'Approved refunds are processed within the following timeframes:

• PayFast (Card/EFT): 3-5 business days
• JazzCash: 1-3 business days
• Easypaisa: 1-3 business days
• Bank Transfer: 3-7 business days
• Cash on Delivery: Store credit or bank transfer (3-5 business days)

Refund timelines may vary depending on your bank or payment provider.',
        ];

        foreach ($defaults as $key => $value) {
            Setting::set($key, $value);
        }

        // Make sure all policy pages are visible again in case any got
        // accidentally hidden.
        foreach ([
            'policy_return_enabled',
            'policy_privacy_enabled',
            'policy_terms_enabled',
            'policy_shipping_enabled',
            'policy_payment_enabled',
        ] as $toggle) {
            Setting::set($toggle, '1');
        }

        $this->command?->info('Restored ' . count($defaults) . ' page-content fields and re-enabled all policy pages.');
    }
}
