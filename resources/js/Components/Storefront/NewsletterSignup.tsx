import { useForm, usePage } from '@inertiajs/react'
import { IconMail, IconCheck } from '@tabler/icons-react'

interface Props {
    variant?: 'banner' | 'footer' | 'inline'
}

export default function NewsletterSignup({ variant = 'banner' }: Props) {
    const { props } = usePage<any>()
    const message = props.flash?.newsletter_message as string | undefined

    const { data, setData, post, processing, reset } = useForm({
        email: '',
        name: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/newsletter/subscribe', { onSuccess: () => reset() })
    }

    if (variant === 'footer') {
        return (
            <div>
                <p className="font-bold text-[14px] text-white mb-2">Stay in the loop</p>
                <p className="text-white/50 text-[12px] mb-3">Exclusive offers, new arrivals, style tips.</p>
                {message ? (
                    <div className="flex items-center gap-2 text-green-400 text-[13px] font-semibold">
                        <IconCheck size={16} /> {message}
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex gap-2">
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="Your email address"
                            required
                            className="flex-1 h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-[13px] focus:outline-none focus:border-white/40"
                        />
                        <button type="submit" disabled={processing}
                            className="h-10 px-4 rounded-xl font-bold text-[12.5px] shrink-0"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            {processing ? '...' : 'Subscribe'}
                        </button>
                    </form>
                )}
            </div>
        )
    }

    // Banner variant (homepage section)
    return (
        <section className="py-16 px-4" style={{ background: 'var(--color-dark-bg)' }}>
            <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                    style={{ background: 'var(--color-primary)' }}>
                    <IconMail size={26} color="white" />
                </div>
                <h2 className="font-black text-3xl text-white mb-3">
                    Get Exclusive Offers
                </h2>
                <p className="text-white/50 text-[15px] mb-8">
                    Join thousands of style-conscious shoppers. Be first to know about new arrivals, flash sales, and VIP deals.
                </p>

                {message ? (
                    <div className="flex items-center justify-center gap-3 text-green-400 font-bold text-[16px]">
                        <IconCheck size={22} /> {message}
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Your name (optional)"
                            className="h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-[13.5px] focus:outline-none focus:border-white/40 flex-1"
                        />
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="Your email address"
                            required
                            className="h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-[13.5px] focus:outline-none focus:border-white/40 flex-1"
                        />
                        <button type="submit" disabled={processing}
                            className="h-12 px-6 rounded-xl font-bold text-[14px] shrink-0 disabled:opacity-60"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            {processing ? 'Joining...' : 'Join Now'}
                        </button>
                    </form>
                )}
                <p className="text-white/30 text-[11.5px] mt-4">No spam. Unsubscribe anytime.</p>
            </div>
        </section>
    )
}
