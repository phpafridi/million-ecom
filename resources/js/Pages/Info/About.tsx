import { Head, Link } from '@inertiajs/react'
import { IconShieldCheck, IconTruck, IconHeadset, IconStar, IconBrandWhatsapp } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import type { PageProps } from '@/types'

interface Props extends PageProps { settings: Record<string, string>; content?: Record<string, string> }

export default function About({ settings, content, auth }: Props) {
    const whatsapp = settings?.whatsapp_number ?? '923001234567'

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="About Us" />

            {/* Hero */}
            <div className="relative h-[220px] sm:h-[300px] md:h-[360px] overflow-hidden bg-[var(--color-dark-bg2, #070b14)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark-bg2, #070b14)] via-[rgba(7,11,20,0.7)] to-transparent z-10" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,200,255,0.012)_2px,rgba(0,200,255,0.012)_4px)]" />
                <div className="relative z-20 h-full flex items-center px-4 sm:px-6 lg:px-16">
                    <div>
                        <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                            <div className="w-6 sm:w-7 h-[2px] bg-[var(--color-primary, #00c8ff)]" style={{ boxShadow: '0 0 8px #00c8ff' }} />
                            <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary, #00c8ff)] uppercase tracking-[.18em]">Our Story</span>
                        </div>
                        <h1 className="font-manrope font-black text-white leading-none tracking-tight mb-3 sm:mb-4"
                            style={{ fontSize: 'clamp(28px, 6vw, 52px)' }}>
                            About <span style={{color:"var(--color-primary)"}}>Us</span>
                        </h1>
                        <p className="text-[13px] sm:text-[15px] text-white/55 max-w-[90vw] sm:max-w-[500px] leading-relaxed">
                            {content?.about_tagline ?? 'Your trusted online store.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12 max-w-6xl mx-auto">
                {/* Mission */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 items-center">
                    <div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary, #00c8ff)] uppercase tracking-wider mb-2">Our Mission</div>
                        <h2 className="font-manrope font-black text-[24px] sm:text-[28px] lg:text-[32px] text-gray-900 tracking-tight mb-3 sm:mb-4 leading-tight">
                            Making premium tech <span className="text-[var(--color-primary, #00c8ff)]">accessible</span> to everyone
                        </h2>
                        <p className="text-[13px] sm:text-[14.5px] text-gray-600 leading-[1.8] mb-3 sm:mb-4">
                            {content?.about_mission ?? 'We were founded with a simple goal: give our customers access to quality products at honest prices.'}
                        </p>
                        <p className="text-[13px] sm:text-[14.5px] text-gray-600 leading-[1.8]">
                            {content?.about_mission2 ?? "From Apple MacBooks to Sony headphones, gaming PCs to printers — we stock everything and back it with a service team that actually picks up the phone."}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                            { num: '50,000+', label: 'Happy Customers' },
                            { num: '12,000+', label: 'Products Listed' },
                            { num: '8+',      label: 'Years in Business' },
                            { num: '99%',     label: 'Positive Feedback' },
                        ].map(s => (
                            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:border-[var(--color-primary, #00c8ff)] hover:shadow-[0_4px_20px_rgba(0,200,255,0.08)] transition-all">
                                <div className="font-manrope font-black text-[24px] sm:text-[28px] lg:text-[32px] text-[var(--color-primary, #00c8ff)] mb-1">{s.num}</div>
                                <div className="text-[11.5px] sm:text-[13px] font-semibold text-gray-600">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div className="mb-12 sm:mb-16">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="text-[10px] sm:text-[11px] font-bold text-[var(--color-primary, #00c8ff)] uppercase tracking-wider mb-2">Why Choose Us</div>
                        <h2 className="font-manrope font-black text-[22px] sm:text-[28px] text-gray-900 tracking-tight">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                        {[
                            { icon: IconShieldCheck, title: '100% Genuine',  desc: 'Every product is verified and sourced directly from official distributors.',      color: 'text-[var(--color-primary, #00c8ff)]', bg: 'bg-[rgba(0,200,255,0.06)]' },
                            { icon: IconTruck,       title: 'Fast Delivery', desc: 'Free delivery on orders over Rs 15,000. Same-day in major cities.',               color: 'text-green-500',   bg: 'bg-green-50' },
                            { icon: IconHeadset,     title: '24/7 Support',  desc: 'Our expert team is always available via phone, WhatsApp, or in-store.',            color: 'text-purple-500',  bg: 'bg-purple-50' },
                            { icon: IconStar,        title: 'Best Prices',   desc: 'We match or beat any verified competitor price. Quality without compromise.',      color: 'text-amber-500',   bg: 'bg-amber-50' },
                        ].map(v => (
                            <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-[var(--color-primary, #00c8ff)] hover:shadow-[0_4px_20px_rgba(0,200,255,0.08)] transition-all">
                                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[13px] ${v.bg} flex items-center justify-center mb-3 sm:mb-4`}>
                                    <v.icon size={22} className={v.color} />
                                </div>
                                <h3 className="font-manrope font-bold text-[15px] sm:text-[16px] text-gray-900 mb-1.5 sm:mb-2">{v.title}</h3>
                                <p className="text-[12.5px] sm:text-[13px] text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-[var(--color-dark-bg, #0a0e1a)] to-[#0d1a2e] rounded-[18px] sm:rounded-[20px] p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 border border-[var(--color-dark-bg, #0a0e1a)]">
                    <div>
                        <h3 className="font-manrope font-black text-[20px] sm:text-[24px] text-white mb-2">Ready to shop?</h3>
                        <p className="text-[13px] sm:text-[14px] text-white/60">Browse our full catalogue or chat with our experts on WhatsApp.</p>
                    </div>
                    <div className="flex gap-2.5 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                        <Link href="/shop" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] sm:text-[13.5px] px-4 sm:px-6 h-[46px] sm:h-[48px] rounded-[12px] transition-all no-underline">
                            Browse Products
                        </Link>
                        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da853] text-white font-bold text-[13px] sm:text-[13.5px] px-4 sm:px-6 h-[46px] sm:h-[48px] rounded-[12px] transition-all no-underline">
                            <IconBrandWhatsapp size={19} /> WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
