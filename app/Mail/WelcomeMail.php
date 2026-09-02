<?php
namespace App\Mail;
use App\Models\{User, Setting};
use App\Traits\EmailBrandingHelper;
use Illuminate\Mail\Mailable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailables\{Content, Envelope};
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;

class WelcomeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels, EmailBrandingHelper;
    public function __construct(public User $user) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "Welcome to " . Setting::get('site_name', 'MILLIONAIRE') . "!");
    }

    public function content(): Content {
        $s = Setting::allKeyed();
        return new Content(view: 'emails.welcome', with: array_merge($this->emailBranding($s), [
            'user'     => $this->user,
            'whatsapp' => $s['whatsapp_number'] ?? '',
            'phone'    => $s['phone']           ?? '',
            'email'    => $s['email']           ?? '',
            'shopUrl'  => url('/shop'),
        ]));
    }
}
