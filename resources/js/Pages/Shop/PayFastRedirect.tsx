import { useEffect, useRef } from 'react'
import { Head } from '@inertiajs/react'

interface Props {
    payfast_url: string
    data: Record<string, string>
    order: { id: number; total: number; name: string }
    sandbox: boolean
}

export default function PayFastRedirect({ payfast_url, data, order, sandbox }: Props) {
    const formRef = useRef<HTMLFormElement>(null)

    // Auto-submit form after 1.5 seconds (gives user time to see the page)
    useEffect(() => {
        const timer = setTimeout(() => {
            formRef.current?.submit()
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    const fmt = (n: number) => `Rs ${Number(n).toLocaleString('en-PK')}`

    return (
        <>
            <Head title="Redirecting to PayFast..." />

            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ background: 'var(--color-body-bg, #f5f5f0)' }}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-md w-full text-center">

                    {/* PayFast Logo */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{ background: '#00b8f1' }}>
                        <span className="text-white font-black text-xl">PF</span>
                    </div>

                    {/* Sandbox warning */}
                    {sandbox && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5">
                            <p className="text-amber-700 text-[12px] font-bold">
                                🧪 SANDBOX MODE — No real money will be charged
                            </p>
                        </div>
                    )}

                    {/* Order summary */}
                    <h1 className="font-black text-[20px] mb-1" style={{ color: 'var(--color-dark-bg)' }}>
                        Redirecting to PayFast
                    </h1>
                    <p className="text-gray-500 text-[14px] mb-5">
                        Secure payment for Order #{order.id}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                        <div className="flex justify-between text-[13.5px]">
                            <span className="text-gray-500">Customer</span>
                            <span className="font-semibold text-gray-800">{order.name}</span>
                        </div>
                        <div className="flex justify-between text-[13.5px]">
                            <span className="text-gray-500">Order</span>
                            <span className="font-semibold text-gray-800">#{order.id}</span>
                        </div>
                        <div className="flex justify-between text-[15px] font-black border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-700">Amount</span>
                            <span style={{ color: 'var(--color-primary)' }}>{fmt(order.total)}</span>
                        </div>
                    </div>

                    {/* Loading indicator */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-5 h-5 border-2 border-gray-200 rounded-full animate-spin"
                            style={{ borderTopColor: '#00b8f1' }} />
                        <span className="text-[13px] text-gray-500 font-medium">
                            Redirecting in a moment…
                        </span>
                    </div>

                    {/* Manual submit button (fallback) */}
                    <button onClick={() => formRef.current?.submit()}
                        className="w-full h-12 rounded-xl font-bold text-[14px] text-white border-none cursor-pointer transition-all hover:opacity-90"
                        style={{ background: '#00b8f1' }}>
                        Continue to PayFast →
                    </button>

                    <p className="text-[11px] text-gray-400 mt-4">
                        🔒 You will be redirected to PayFast's secure payment page.<br />
                        Your card details are never shared with us.
                    </p>

                    {/* Hidden auto-submit form */}
                    <form ref={formRef} method="POST" action={payfast_url} style={{ display: 'none' }}>
                        {Object.entries(data).map(([key, value]) => (
                            <input key={key} type="hidden" name={key} value={value} />
                        ))}
                    </form>
                </div>
            </div>
        </>
    )
}
