<?php
namespace App\Http\Controllers\Shop;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Info/About', ['settings'=>Setting::allKeyed(),'content'=>['about_tagline'=>Setting::get('about_tagline','Wear Your Status.'),'about_mission'=>Setting::get('about_mission','Founded with a simple goal: give our customers premium quality products at honest prices.'),'about_mission2'=>Setting::get('about_mission2','From premium clothing to luxury perfumes, signature watches to exclusive accessories.')]]);
    }
    public function contact()
    {
        return Inertia::render('Info/Contact', ['settings'=>Setting::allKeyed()]);
    }
    private function policyPage(string $view, array $page)
    {
        return Inertia::render('Info/Policy', ['settings'=>Setting::allKeyed(),'page'=>$page]);
    }
    public function returnPolicy()
    {
        return $this->policyPage('Info/Policy', [
            'title'=>'Return & Exchange Policy','subtitle'=>'ریٹرن، ایکسچینج اور ریفنڈ پالیسی','icon'=>'↩️','updated'=>'August 2026',
            'sections'=>[
                ['title'=>'Return Period / ریٹرن کی مدت','content'=>"• Clothing (کپڑے): 7 days from purchase\n• Shoes (جوتے): 30 days from purchase\n• Other products: As per warranty terms"],
                ['title'=>'Return Conditions / شرائط','content'=>"• Original receipt/invoice required (اصل رسید لازمی)\n• Product unused, unwashed, unworn\n• No damage or alterations\n• Original packaging, tags and labels intact\n• Subject to company inspection and approval"],
                ['title'=>'Customized Products','content'=>"Custom-made items cannot be returned unless there is a manufacturing defect.\nکسٹمائزڈ مصنوعات عام طور پر ریٹرن نہیں ہوتیں۔"],
                ['title'=>'Perfumes / پرفیوم','content'=>"Sealed packaging once opened — no return or exchange, except proven manufacturing defect.\nSealed Packaging کھولنے کے بعد ریٹرن نہیں ہوگا۔"],
                ['title'=>'Watches / گھڑیاں','content'=>"Returns per product warranty. Original invoice + warranty card required. Physical/water damage voids warranty.\nWarranty Claim کے لیے اصل Invoice اور Warranty Card درکار ہے۔"],
                ['title'=>'Defective Products','content'=>"Contact Customer Service immediately upon receiving a defective product. We will arrange Exchange, Repair, Replacement, or Refund after inspection."],
                ['title'=>'Refunds / رقم کی واپسی','content'=>"Approved returns: Refund, Exchange, or Store Credit as per payment method and product condition. Cash refund not guaranteed on every return."],
                ['title'=>'Return Shipping','content'=>"Return shipping costs depend on reason for return. Company not responsible for returns lost if proper process not followed."],
            ],
        ]);
    }
    public function privacyPolicy()
    {
        $s=Setting::get('site_name','MILLIONAIRE'); $e=Setting::get('email','support@millionaire.pk');
        return $this->policyPage('Info/Policy', [
            'title'=>'Privacy Policy','subtitle'=>'How we collect, use and protect your personal data','icon'=>'🔒','updated'=>'August 2026',
            'sections'=>[
                ['title'=>'Information We Collect','content'=>"• Name, email, phone number\n• Delivery address\n• Payment info (processed securely, not stored by us)\n• Order history\n• Device & browsing data (analytics)"],
                ['title'=>'How We Use Your Data','content'=>"• Process and deliver orders\n• Send order confirmations\n• Customer support\n• Promotional offers (opt-in only)\n• Improve our services"],
                ['title'=>'Data Sharing','content'=>"We never sell your data. Shared only with:\n• Delivery partners (for shipping)\n• Payment processors (PayFast, JazzCash)\n• Google Analytics (anonymized)\n• Legal authorities (when required by law)"],
                ['title'=>'Cookies','content'=>"We use cookies for:\n• Cart functionality (functional)\n• Login sessions (functional)\n• Google Analytics (analytics)\n• Facebook Pixel, TikTok Pixel (marketing)\n\nYou can disable cookies in browser settings."],
                ['title'=>'Data Security','content'=>"• SSL/TLS encryption on all pages\n• Secure PCI-compliant payment processing\n• Regular security audits\n• Staff access controls"],
                ['title'=>'Your Rights','content'=>"You can request:\n• Access to your data\n• Correction of incorrect data\n• Account deletion\n• Unsubscribe from marketing\n\nContact: {$e}"],
                ['title'=>'Contact','content'=>"{$s}\nEmail: {$e}\nPhone: ".Setting::get('phone','+92 300 0000000')],
            ],
        ]);
    }
    public function termsOfService()
    {
        $s=Setting::get('site_name','MILLIONAIRE');
        return $this->policyPage('Info/Policy', [
            'title'=>'Terms of Service','subtitle'=>'Please read before using our website','icon'=>'📋','updated'=>'August 2026',
            'sections'=>[
                ['title'=>'Acceptance','content'=>"By using {$s} website, you agree to these terms. If you disagree, please do not use our site."],
                ['title'=>'Products & Pricing','content'=>"• All prices in Pakistani Rupees (Rs)\n• Prices may change without notice\n• Images for illustration; actual product may vary slightly\n• We may limit quantities"],
                ['title'=>'Orders & Payment','content'=>"• Orders confirmed after payment received\n• We may cancel orders due to stock unavailability\n• Full payment required before dispatch (online orders)\n• COD payment required upon delivery"],
                ['title'=>'Delivery','content'=>"• Delivery times are estimates only\n• {$s} not liable for courier delays\n• Customer must be available to receive order"],
                ['title'=>'Prohibited Use','content'=>"You may not:\n• Violate any laws\n• Submit false information\n• Attempt to hack our services\n• Copy our content without permission"],
                ['title'=>'Intellectual Property','content'=>"All content (text, images, logo, design) is property of {$s}. No reproduction without written permission."],
                ['title'=>'Limitation of Liability','content'=>"{$s} liability is limited to the purchase price paid. We are not liable for indirect or consequential damages."],
                ['title'=>'Governing Law','content'=>"These terms are governed by the laws of Pakistan."],
            ],
        ]);
    }
    public function shippingPolicy()
    {
        return $this->policyPage('Info/Policy', [
            'title'=>'Shipping Policy','subtitle'=>'Delivery times, costs and information','icon'=>'🚚','updated'=>'August 2026',
            'sections'=>[
                ['title'=>'Delivery Times','content'=>"• Lahore, Karachi, Islamabad: 2-3 business days\n• Other major cities: 3-5 business days\n• Remote areas: 5-7 business days\n\nOrders before 2PM processed same day."],
                ['title'=>'Delivery Charges','content'=>"• Standard delivery: Rs 200\n• Free delivery on orders above Rs 5,000\n• Same-day delivery (Lahore): Rs 500"],
                ['title'=>'Order Tracking','content'=>"After dispatch you receive SMS with tracking number. Track at: millionaire.pk/track-order"],
                ['title'=>'Delivery Partners','content'=>"We use TCS, Leopards, PostEx, M&P depending on your location."],
                ['title'=>'Failed Delivery','content'=>"3 delivery attempts made. Contact via SMS/phone. Returned orders require reshipping fee."],
                ['title'=>'Damaged in Transit','content'=>"Take photos immediately. Do not accept if severely damaged. Contact us within 24 hours for replacement/refund."],
            ],
        ]);
    }
    public function paymentPolicy()
    {
        return $this->policyPage('Info/Policy', [
            'title'=>'Payment Policy','subtitle'=>'Accepted payment methods and security information','icon'=>'💳','updated'=>'August 2026',
            'sections'=>[
                ['title'=>'Payment Methods','content'=>"• Cash on Delivery (COD)\n• PayFast — Visa, Mastercard, EFT\n• JazzCash — Mobile wallet & card\n• Easypaisa — Mobile wallet\n• Bank Transfer\n• Safepay"],
                ['title'=>'Online Payment Security','content'=>"• SSL/TLS encryption on all transactions\n• We never store card details\n• PCI-DSS compliant payment gateways\n• 3D Secure authentication for cards"],
                ['title'=>'Bank Transfer','content'=>"1. Place order\n2. Transfer to our bank account\n3. Upload payment proof\n4. Order processed after confirmation"],
                ['title'=>'Payment Failures','content'=>"No amount deducted (or refunded within 3-5 days if charged). Try different payment method or contact support."],
                ['title'=>'Refund Timeline','content'=>"• PayFast: 3-5 business days\n• JazzCash/Easypaisa: 1-3 business days\n• Bank Transfer: 3-7 business days\n• COD: Store credit or bank transfer"],
            ],
        ]);
    }
}
