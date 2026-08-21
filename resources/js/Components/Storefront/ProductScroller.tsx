import { useState, useRef } from 'react'
import { Link } from '@inertiajs/react'
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import ProductCard from './ProductCard'
import { ProductCardSkeleton } from '@/Components/ui/Skeleton'
import type { Product } from '@/types'

interface Props {
    title: string
    eyebrow: string
    viewAllHref?: string
    products: Product[]
    whatsapp?: string
    loading?: boolean
}

export default function ProductScroller({ title, eyebrow, viewAllHref, products, whatsapp, loading }: Props) {
    const trackRef = useRef<HTMLDivElement>(null)
    const [page, setPage]     = useState(0)
    const perPage             = 5
    const items               = loading ? Array(perPage).fill(null) : products.slice(0, 12)
    const totalPages          = Math.ceil(items.length / perPage)
    const canLeft             = page > 0
    const canRight            = page < totalPages - 1

    function go(dir: 1 | -1) {
        setPage(p => Math.max(0, Math.min(totalPages - 1, p + dir)))
    }

    if (!loading && products.length === 0) return null

    const pad = 'clamp(16px, 5vw, 48px)'
    const gap  = 12

    return (
        <section style={{ padding: '32px 0', width: '100%', boxSizing: 'border-box' }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:`0 ${pad}`, marginBottom:22 }}>
                <div>
                    <p style={{ fontSize:11, fontWeight:800, color:'var(--color-primary)', textTransform:'uppercase', letterSpacing:'0.12em', margin:'0 0 4px' }}>{eyebrow}</p>
                    <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:900, color:'#111', margin:0, fontFamily:'Manrope,sans-serif', lineHeight:1.1 }}>{title}</h2>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    {viewAllHref && (
                        <Link href={viewAllHref} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, color:'#111', textDecoration:'none', whiteSpace:'nowrap' }}>
                            View all <IconArrowRight size={15}/>
                        </Link>
                    )}
                    <div style={{ display:'flex', gap:6 }}>
                        {([[-1,canLeft],[1,canRight]] as [number,boolean][]).map(([d,can])=>(
                            <button key={d} onClick={()=>go(d as 1|-1)}
                                style={{ width:36, height:36, borderRadius:'50%', border:`1.5px solid ${can?'#111':'#E5E7EB'}`, background:can?'#111':'white', color:can?'white':'#D1D5DB', display:'flex', alignItems:'center', justifyContent:'center', cursor:can?'pointer':'default', transition:'all 0.2s' }}>
                                {d===-1 ? <IconChevronLeft size={16}/> : <IconChevronRight size={16}/>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cards — NO horizontal scroll, paginate instead */}
            <div style={{ padding:`0 ${pad}`, overflow:'hidden' }}>
                <div ref={trackRef}
                    style={{
                        display:'grid',
                        gridTemplateColumns:`repeat(${perPage}, 1fr)`,
                        gap,
                    }}>
                    {items.slice(page * perPage, (page + 1) * perPage).map((p, i) => (
                        <div key={(p as any)?.id ?? i}>
                            {loading || !p ? <ProductCardSkeleton /> : <ProductCard product={p as Product} whatsapp={whatsapp}/>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dot indicators */}
            {totalPages > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:20 }}>
                    {Array(totalPages).fill(0).map((_,i)=>(
                        <button key={i} onClick={()=>setPage(i)}
                            style={{ width: i===page?24:8, height:8, borderRadius:100, background:i===page?'var(--color-primary)':'#D1D5DB', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }}/>
                    ))}
                </div>
            )}
        </section>
    )
}
