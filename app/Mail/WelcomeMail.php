<?php
namespace App\Mail;
use App\Models\{User, Setting};
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class WelcomeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    public function __construct(public User $user) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "Welcome to " . Setting::get('site_name', 'MILLIONAIRE') . "!");
    }

    public function content(): Content {
        $s = Setting::allKeyed();
        $logoRaw = $s['logo_url'] ?? null;
        return new Content(view: 'emails.welcome', with: [
            'user'         => $this->user,
            'storeName'    => $s['site_name']       ?? 'MILLIONAIRE',
            'logoUrl'      => $logoRaw ? (str_starts_with($logoRaw, 'http') ? $logoRaw : url($logoRaw)) : null,
            'primaryColor' => $s['theme_dark_bg']   ?? '#0a0a0a',
            'accentColor'  => $s['theme_primary']   ?? '#C9A84C',
            'whatsapp'     => $s['whatsapp_number'] ?? '',
            'phone'        => $s['phone']           ?? '',
            'email'        => $s['email']           ?? '',
            'shopUrl'      => url('/shop'),
        ]);
    }
}
