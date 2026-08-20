import { Head } from '@inertiajs/react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import AccountSidebar from './Partials/AccountSidebar'
import { IconStar, IconTrendingUp, IconGift, IconArrowUp, IconArrowDown } from '@tabler/icons-react'

interface Transaction {
    id: number; type: string; points: number; description: string
    created_at: string; order?: { id: number }
}
interface Level { name: string; color: string; next: number | null; progress: number }

interface Props {
    points: number; points_value: number; total_earned: number
    level: Level; transactions: { data: Transaction[]; current_page: number; last_page: number }
    settings: Record<string, string>; auth: any
}

const LEVELS = [
    { name: 'Bronze',   min: 0,    max: 499,  color: '#CD7F32', perks: ['1 point per Rs 10 spent', 'Birthday bonus 50 pts'] },
    { name: 'Silver',   min: 500,  max: 1999, color: '#6B7280', perks: ['1.5x points multiplier',  'Free shipping on orders 2000+', 'Early sale access'] },
    { name: 'Gold',     min: 2000, max: 4999, color: '#F59E0B', perks: ['2x points multiplier',    'Free shipping always', 'Priority support', 'Exclusive offers'] },
    { name: 'Platinum', min: 5000, max: null, color: '#8B5CF6', perks: ['3x points multiplier',    'Free shipping always', 'VIP support', 'Early product access', 'Birthday gift'] },
]

export default function Loyalty({ points, points_value, total_earned, level, transactions, settings, auth }: Props) {
    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title="Loyalty Points" />
            <div className="min-h-screen py-8 px-4" style={{ background: 'var(--color-body-bg)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <AccountSidebar auth={auth} active="loyalty" />

                        <div className="lg:col-span-3 space-y-5">

                            {/* Points Balance Card */}
                            <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                                style={{ background: `linear-gradient(135deg, ${level.color} 0%, ${level.color}cc 100%)` }}>
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5"
                                    style={{ transform: 'translate(30%, -30%)' }} />
                                <p className="text-white/70 text-[13px] font-medium mb-1">{level.name} Member</p>
                                <div className="flex items-end gap-4 mb-4">
                                    <div>
                                        <p className="font-black text-5xl leading-none">{points.toLocaleString()}</p>
                                        <p className="text-white/60 text-[13px] mt-1">points available</p>
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-white/80 text-[14px]">≈ Rs {points_value.toLocaleString()}</p>
                                        <p className="text-white/50 text-[11px]">redeemable value</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-white/70 text-[12px]">
                                    <IconTrendingUp size={14} />
                                    <span>{total_earned.toLocaleString()} total points earned</span>
                                </div>
                                {level.next && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-[11px] text-white/60 mb-1.5">
                                            <span>Progress to next level</span>
                                            <span>{level.progress}% · {(level.next - total_earned).toLocaleString()} pts needed</span>
                                        </div>
                                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-white rounded-full transition-all duration-700"
                                                style={{ width: `${level.progress}%` }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* How to earn */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <h3 className="font-black text-[16px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>
                                    How to Earn Points
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { label: 'Every Purchase', value: '1 pt / Rs 10', icon: '🛍️' },
                                        { label: 'Write a Review', value: '25 points',    icon: '⭐' },
                                        { label: 'Refer a Friend', value: '100 points',   icon: '👥' },
                                        { label: 'Birthday Bonus', value: '50 points',    icon: '🎂' },
                                        { label: 'First Purchase', value: '50 points',    icon: '🎉' },
                                        { label: 'Social Share',   value: '10 points',    icon: '📱' },
                                    ].map(e => (
                                        <div key={e.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                            <span className="text-xl">{e.icon}</span>
                                            <div>
                                                <p className="font-bold text-[12.5px]" style={{ color: 'var(--color-dark-bg)' }}>{e.label}</p>
                                                <p className="text-[11.5px] font-semibold" style={{ color: 'var(--color-primary)' }}>{e.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Level Benefits */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <h3 className="font-black text-[16px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>
                                    Membership Levels
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {LEVELS.map(l => (
                                        <div key={l.name}
                                            className={`rounded-xl p-4 border-2 transition-all ${level.name === l.name ? 'shadow-md' : 'border-gray-100'}`}
                                            style={level.name === l.name ? { borderColor: l.color, background: l.color + '08' } : {}}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <IconStar size={14} style={{ color: l.color }} fill={l.color} />
                                                <p className="font-black text-[13px]" style={{ color: l.color }}>{l.name}</p>
                                            </div>
                                            <p className="text-gray-400 text-[10.5px] mb-2">
                                                {l.min.toLocaleString()}{l.max ? `–${l.max.toLocaleString()}` : '+'} pts
                                            </p>
                                            <ul className="space-y-1">
                                                {l.perks.map(p => (
                                                    <li key={p} className="text-[10.5px] text-gray-600 flex items-start gap-1">
                                                        <span style={{ color: l.color }} className="mt-0.5">✓</span> {p}
                                                    </li>
                                                ))}
                                            </ul>
                                            {level.name === l.name && (
                                                <div className="mt-2 pt-2 border-t" style={{ borderColor: l.color + '30' }}>
                                                    <p className="text-[10px] font-bold" style={{ color: l.color }}>Your current level</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                                <h3 className="font-black text-[16px] mb-4" style={{ color: 'var(--color-dark-bg)' }}>
                                    Points History
                                </h3>
                                {transactions.data.length === 0 ? (
                                    <div className="text-center py-10">
                                        <IconGift size={36} className="text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400 text-[13.5px]">No transactions yet. Start shopping to earn points!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {transactions.data.map(t => (
                                            <div key={t.id} className="flex items-center justify-between py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                                        ${t.type === 'earned' ? 'bg-green-50' : 'bg-red-50'}`}>
                                                        {t.type === 'earned'
                                                            ? <IconArrowUp size={16} className="text-green-500" />
                                                            : <IconArrowDown size={16} className="text-red-500" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[13px]" style={{ color: 'var(--color-dark-bg)' }}>
                                                            {t.description}
                                                        </p>
                                                        <p className="text-gray-400 text-[11.5px]">{t.created_at}</p>
                                                    </div>
                                                </div>
                                                <p className={`font-black text-[15px] ${t.type === 'earned' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {t.type === 'earned' ? '+' : ''}{t.points} pts
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    )
}
