import { Head, Link } from '@inertiajs/react'
import { IconArrowLeft } from '@tabler/icons-react'
import StorefrontLayout from '@/Layouts/StorefrontLayout'
import type { PageProps } from '@/types'

interface CategoryLite {
    id: number; name: string; slug: string
    image?: string; mobile_image?: string
}

interface Props extends PageProps {
    category: CategoryLite
    children: CategoryLite[]
    settings: Record<string, string>
}

export default function CategoryLanding({ category, children, settings, auth }: Props) {
    return (
        <StorefrontLayout auth={auth} settings={settings}>
            <Head title={category.name} />

            <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-2">
                <Link href="/" className="no-underline flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--color-body-text)' }}>
                    <IconArrowLeft size={16} />
                    <span>{category.name}</span>
                </Link>
            </div>

            {/* Same full-cover treatment as the homepage category section —
                stacked one by one on mobile, 2-across on desktop. Every
                subcategory link goes through /category/{slug} again rather
                than straight to /shop, so this stays correct even if a
                subcategory ever gets children of its own later — the
                controller decides whether to show another landing page or
                go straight to products. */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {children.map(child => (
                    <Link key={child.id} href={`/category/${child.slug}`}
                        className="relative block no-underline overflow-hidden group"
                        style={{ height: 'clamp(180px,32vw,260px)' }}>
                        <picture>
                            <source media="(min-width: 1024px)" srcSet={child.image ?? '/images/placeholder.jpg'} />
                            <img src={child.mobile_image ?? child.image ?? '/images/placeholder.jpg'} alt={child.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                style={{ objectPosition: 'center 20%' }} loading="lazy" />
                        </picture>
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)' }} />
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'18px 20px' }}>
                            <span style={{ display:'block', color:'#fff', fontSize:19, fontWeight:500, lineHeight:1.2 }}>{child.name}</span>
                            <span style={{ display:'block', color:'rgba(255,255,255,0.85)', fontSize:12, marginTop:4 }}>Shop the collection →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </StorefrontLayout>
    )
}
