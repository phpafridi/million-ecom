import { Head, Link } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'

interface Section { title: string; content: string }
interface PolicyPage { title: string; subtitle: string; icon: string; updated?: string; sections: Section[] }
interface Props { settings: Record<string, string>; page: PolicyPage; auth?: any }

export default function Policy({ settings, page, auth }: Props) {
    const siteName = settings?.site_name ?? 'MILLIONAIRE'

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={`${page.title} — ${siteName}`} />

            {/* Hero */}
            <div style={{ background: 'var(--color-dark-bg, #0a0a0a)', padding: 'clamp(56px,9vw,100px) clamp(20px,5vw,48px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 860, position: 'relative' }}>
                    <div style={{ fontSize: 44, marginBottom: 16 }}>{page.icon}</div>
                    <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,48px)', color: 'white', margin: '0 0 12px', lineHeight: 1.05 }}>{page.title}</h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{page.subtitle}</p>
                    {page.updated && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>Last updated: {page.updated}</p>}
                </div>
            </div>

            {/* Breadcrumb */}
            <div style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', padding: '12px clamp(20px,5vw,48px)' }}>
                <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9CA3AF' }}>
                    <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <span style={{ color: '#374151', fontWeight: 600 }}>{page.title}</span>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(40px,6vw,72px) clamp(20px,5vw,48px)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {page.sections.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: 'var(--color-primary-text, #0a0a0a)', marginTop: 2 }}>
                                {i + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontWeight: 800, fontSize: 17, color: '#111', margin: '0 0 10px', fontFamily: 'Manrope, sans-serif' }}>{s.title}</h2>
                                <div style={{ fontSize: 14.5, color: '#4B5563', lineHeight: 1.85, whiteSpace: 'pre-line', background: '#F9FAFB', borderRadius: 14, padding: '16px 20px', borderLeft: '3px solid var(--color-primary)' }}>
                                    {s.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Related policies */}
                <div style={{ marginTop: 56, padding: '24px', background: 'var(--color-dark-bg, #0a0a0a)', borderRadius: 20 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>Other Policies</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {[['Return Policy','/pages/return-policy'],['Privacy Policy','/pages/privacy-policy'],['Terms of Service','/pages/terms'],['Shipping Policy','/pages/shipping-policy'],['Payment Policy','/pages/payment-policy']].map(([l,h]) => (
                            <Link key={l} href={h} style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>{l}</Link>
                        ))}
                    </div>
                </div>

                {/* Contact note */}
                <div style={{ marginTop: 20, padding: '20px 24px', background: '#F9FAFB', borderRadius: 16, border: '1px solid #E5E7EB', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                        Questions about this policy?{' '}
                        <a href={`mailto:${settings?.email ?? 'support@millionaire.pk'}`} style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                            {settings?.email ?? 'support@millionaire.pk'}
                        </a>
                        {' '}or{' '}
                        <Link href="/support" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>submit a support ticket</Link>
                    </p>
                </div>
            </div>
        </StorefrontLayout>
    )
}
