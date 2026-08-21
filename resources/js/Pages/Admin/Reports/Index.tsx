import { Head, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { useState } from 'react'
import { IconDownload, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Props {
    from:string; to:string
    revenueDaily:Array<{date:string;orders:number;revenue:number}>
    byPayment:Array<{payment_method:string;orders:number;revenue:number}>
    byCity:Array<{city:string;orders:number;revenue:number}>
    topProducts:Array<{product_name:string;qty:number;revenue:number}>
    byStatus:Record<string,number>
    lowStock:Array<{id:number;name:string;stock:number;sku:string}>
    kpis:{total_revenue:number;total_orders:number;avg_order:number;new_customers:number;this_month:number;last_month:number}
}

const COLORS=['#C9A84C','#0a0a0a','#3B82F6','#10B981','#F59E0B','#EF4444']
const fmt=(n:number)=>'Rs '+Math.round(n).toLocaleString('en-PK')

export default function Reports({from,to,revenueDaily,byPayment,topProducts,byStatus,lowStock,kpis}:Props) {
    const ap='/ml-admin'
    const [df,setDf]=useState(from)
    const [dt,setDt]=useState(to)
    const growth=kpis.last_month>0?((kpis.this_month-kpis.last_month)/kpis.last_month*100):0
    const statusData=Object.entries(byStatus).map(([name,value])=>({name,value}))

    function applyFilter(){ router.get(`${ap}/reports`,{from:df,to:dt},{preserveState:true}) }

    const KCard=({label,value,sub,up}:{label:string;value:string;sub?:string;up?:boolean})=>(
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
            <p className="font-black text-[26px] text-gray-900">{value}</p>
            {sub&&<p className={`text-[12px] font-semibold mt-1 flex items-center gap-1 ${up===true?'text-green-600':up===false?'text-red-500':'text-gray-400'}`}>
                {up===true?<IconTrendingUp size={13}/>:up===false?<IconTrendingDown size={13}/>:null}{sub}
            </p>}
        </div>
    )

    return (
        <AdminLayout title="Reports">
            <Head title="Reports"/>
            {/* Date filter */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
                    <label className="text-[12px] font-bold text-gray-500">From</label>
                    <input type="date" value={df} onChange={e=>setDf(e.target.value)} className="text-[13px] outline-none border-none bg-transparent"/>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
                    <label className="text-[12px] font-bold text-gray-500">To</label>
                    <input type="date" value={dt} onChange={e=>setDt(e.target.value)} className="text-[13px] outline-none border-none bg-transparent"/>
                </div>
                <button onClick={applyFilter} className="h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer" style={{background:'var(--color-primary)',color:'var(--color-primary-text)'}}>Apply</button>
                <a href={`${ap}/reports/export?from=${df}&to=${dt}`} className="h-10 px-5 rounded-xl font-bold text-[13px] border border-gray-200 text-gray-600 bg-white cursor-pointer flex items-center gap-2 no-underline">
                    <IconDownload size={15}/> Export CSV
                </a>
                {[['Today',0],['7d',7],['30d',30],['90d',90]].map(([l,d])=>(
                    <button key={l} onClick={()=>{ const f=new Date(); f.setDate(f.getDate()-(d as number)); const fd=f.toISOString().split('T')[0]; const td=new Date().toISOString().split('T')[0]; router.get(`${ap}/reports`,{from:fd,to:td},{preserveState:true}) }}
                        className="h-9 px-3 rounded-lg text-[12px] font-bold border border-gray-200 text-gray-600 bg-white cursor-pointer hover:bg-gray-50">{l}</button>
                ))}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                <KCard label="Revenue" value={fmt(kpis.total_revenue)} sub={`${growth>0?'+':''}${growth.toFixed(1)}% vs last month`} up={growth>0}/>
                <KCard label="Orders" value={String(kpis.total_orders)}/>
                <KCard label="Avg Order" value={fmt(kpis.avg_order)}/>
                <KCard label="New Customers" value={String(kpis.new_customers)} up={kpis.new_customers>0}/>
                <KCard label="This Month" value={fmt(kpis.this_month)}/>
                <KCard label="Last Month" value={fmt(kpis.last_month)}/>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <h3 className="font-black text-[15px] text-gray-800 mb-4">Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueDaily}>
                        <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15}/><stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
                        <XAxis dataKey="date" tick={{fontSize:10}} tickFormatter={d=>d.slice(5)}/>
                        <YAxis tick={{fontSize:10}} tickFormatter={v=>'Rs '+Math.round(v/1000)+'k'}/>
                        <Tooltip formatter={(v:any)=>[fmt(v),'Revenue']}/>
                        <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rg)"/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Top Products */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-black text-[15px] text-gray-800 mb-4">Top Selling Products</h3>
                    {topProducts.length===0?<p className="text-gray-400 text-[13px]">No sales data yet</p>:
                    <div className="space-y-3">
                        {topProducts.slice(0,8).map((p,i)=>(
                            <div key={p.product_name} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[11px] font-black flex items-center justify-center flex-shrink-0">{i+1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[13px] text-gray-800 truncate">{p.product_name}</p>
                                    <div className="h-1.5 bg-gray-100 rounded-full mt-1"><div className="h-full rounded-full" style={{width:`${topProducts[0]?.revenue>0?(p.revenue/topProducts[0].revenue*100):0}%`,background:'var(--color-primary)'}}/></div>
                                </div>
                                <div className="text-right flex-shrink-0"><p className="font-black text-[13px] text-gray-800">{fmt(p.revenue)}</p><p className="text-[11px] text-gray-400">{p.qty} sold</p></div>
                            </div>
                        ))}
                    </div>}
                </div>

                {/* Order Status Pie */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-black text-[15px] text-gray-800 mb-4">Order Status</h3>
                    {statusData.length>0?(
                        <>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                    {statusData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                                </Pie><Tooltip/></PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-1.5 mt-2">
                                {statusData.map((s,i)=>(
                                    <div key={s.name} className="flex items-center justify-between text-[12px]">
                                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:COLORS[i%COLORS.length]}}/><span className="text-gray-600 capitalize">{s.name}</span></div>
                                        <span className="font-bold text-gray-800">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ):<p className="text-gray-400 text-[13px]">No orders yet</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Payment methods chart */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-black text-[15px] text-gray-800 mb-4">Revenue by Payment</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={byPayment}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
                            <XAxis dataKey="payment_method" tick={{fontSize:10}}/>
                            <YAxis tick={{fontSize:10}} tickFormatter={v=>'Rs '+Math.round(v/1000)+'k'}/>
                            <Tooltip formatter={(v:any)=>[fmt(v),'Revenue']}/>
                            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[5,5,0,0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-black text-[15px] text-gray-800 mb-4">⚠️ Low Stock Alert</h3>
                    {lowStock.length===0?<p className="text-green-600 font-semibold text-[13px]">✅ All products well stocked</p>:(
                        <div className="space-y-2">
                            {lowStock.map(p=>(
                                <div key={p.id} className="flex items-center justify-between">
                                    <div><p className="font-semibold text-[13px] text-gray-800">{p.name}</p>{p.sku&&<p className="text-[11px] text-gray-400">SKU: {p.sku}</p>}</div>
                                    <span className={`text-[12px] font-black px-3 py-1 rounded-full ${p.stock===0?'bg-red-100 text-red-600':'bg-amber-100 text-amber-700'}`}>{p.stock===0?'Out of Stock':`${p.stock} left`}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
