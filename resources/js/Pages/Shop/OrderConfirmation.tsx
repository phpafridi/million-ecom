import { Head, Link } from '@inertiajs/react'
import { IconCheck, IconShoppingBag, IconHome } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import type { PageProps } from '@/types'

interface Props extends PageProps {
    order: { id: number; total: number; payment_method: string; shipping_address: any }
    settings: Record<string, string>
}

export default function OrderConfirmation({ order, settings, auth }: Props) {
    const fmt = (n: number) => `Rs ${n.toLocaleString('en-PK')}`
    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={`Order #${order.id} Confirmed`} />
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
                        style={{ background: 'var(--color-primary)' }}>
                        <IconCheck size={36} style={{ color: 'var(--color-primary-text)' }} strokeWidth={3} />
                    </div>
                    <h1 className="font-manrope font-black text-[26px] text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 text-[14px] mb-6">
                        Thank you, <strong>{order.shipping_address?.name}</strong>! Your order <strong>#{order.id}</strong> has been placed.
                    </p>
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left mb-6 space-y-2.5">
                        <div className="flex justify-between text-[13.5px]">
                            <span className="text-gray-500">Order #</span><span className="font-bold">{order.id}</span>
                        </div>
                        <div className="flex justify-between text-[13.5px]">
                            <span className="text-gray-500">Total</span><span className="font-bold">{fmt(order.total)}</span>
                        </div>
                        <div className="flex justify-between text-[13.5px]">
                            <span className="text-gray-500">Payment</span><span className="font-bold capitalize">{order.payment_method.replace('_',' ')}</span>
                        </div>
                        <div className="flex justify-between text-[13.5px]">
                            <span className="text-gray-500">Deliver to</span>
                            <span className="font-bold text-right">{order.shipping_address?.address}, {order.shipping_address?.city}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/" className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-[13px] no-underline">
                            <IconHome size={16} /> Home
                        </Link>
                        <Link href="/shop" className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-black text-[13px] no-underline"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                            <IconShoppingBag size={16} /> Shop More
                        </Link>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
