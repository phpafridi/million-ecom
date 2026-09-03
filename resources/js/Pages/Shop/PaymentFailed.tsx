import { Head, Link } from '@inertiajs/react'
import { IconX, IconRefresh, IconBrandWhatsapp, IconPhone } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'

interface Props { auth: any; settings: Record<string, string>; reason?: string }

export default function PaymentFailed({ auth, settings, reason }: Props) {
    const whatsapp = settings?.whatsapp_number ?? ''
    const phone    = settings?.phone ?? ''

    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Payment Failed"/>
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <IconX size={38} className="text-red-500"/>
                </div>
                <h1 className="font-manrope font-black text-[28px] mb-3" style={{ color: 'var(--color-body-text)' }}>Payment Failed</h1>
                <p className="text-gray-500 text-[15px] mb-2">Your payment was not completed.</p>
                {reason && <p className="text-red-500 text-[13px] mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{reason}</p>}
                <p className="text-gray-400 text-[13px] mb-8">Your order has NOT been placed. No charges were made. Please try again or choose a different payment method.</p>

                <div className="space-y-3 mb-6">
                    <Link href="/cart"
                        className="flex items-center justify-center gap-2 h-12 w-full font-black text-[14px] rounded-xl no-underline transition-all"
                        style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                        <IconRefresh size={18}/> Try Again
                    </Link>
                    {whatsapp && (
                        <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I had a payment issue and need help completing my order.')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 h-11 w-full bg-[#25D366] text-white font-bold text-[13.5px] rounded-xl no-underline hover:bg-[#1da853] transition-colors">
                            <IconBrandWhatsapp size={18}/> Get Help on WhatsApp
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`}
                            className="flex items-center justify-center gap-2 h-11 w-full border-2 border-gray-200 text-gray-700 font-semibold text-[13.5px] rounded-xl no-underline hover:border-gray-300 transition-colors">
                            <IconPhone size={16}/> Call Us
                        </a>
                    )}
                </div>
                <Link href="/" className="text-[13px] text-gray-400 no-underline hover:underline">← Back to Home</Link>
            </div>
        </StorefrontLayout>
    )
}
