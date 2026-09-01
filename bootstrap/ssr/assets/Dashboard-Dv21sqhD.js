import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, L as Link_default } from "../ssr.js";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Cell } from "recharts";
import { IconTrendingUp, IconShoppingBag, IconUsers, IconPackage, IconAlertTriangle, IconStar, IconEye } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-Dg6pcwSH.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
function Dashboard({ stats, revenueChart, topProducts, recentOrders, lowStock }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const statCards = [
    { label: "Total Revenue", value: fmt(stats.revenue), icon: IconTrendingUp, change: "+12%", color: "var(--color-primary)" },
    { label: "Total Orders", value: stats.orders, icon: IconShoppingBag, change: stats.pending_orders > 0 ? `${stats.pending_orders} pending` : null, color: "#8b5cf6" },
    { label: "Customers", value: stats.customers, icon: IconUsers, change: null, color: "#10b981" },
    { label: "Active Products", value: stats.products, icon: IconPackage, change: null, color: "#f59e0b" }
  ];
  const CustomTooltip = ({ active, payload, label }) => {
    var _a;
    if (!active || !(payload == null ? void 0 : payload.length)) return null;
    return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--color-dark-bg)] rounded-xl px-4 py-3 text-white shadow-xl border border-white/10", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black uppercase tracking-wider text-white/50 mb-1", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-[15px] font-black", children: fmt(((_a = payload[0]) == null ? void 0 : _a.value) ?? 0) }),
      payload[1] && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-white/60", children: [
        payload[1].value,
        " orders"
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Dashboard", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Dashboard" }),
    (stats.pending_orders > 0 || stats.pending_reviews > 0) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-5", children: [
      stats.pending_orders > 0 && /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `${ap}/orders?status=pending`,
          className: "flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-[13px] font-semibold no-underline hover:bg-amber-100 transition-colors",
          children: [
            /* @__PURE__ */ jsx(IconAlertTriangle, { size: 16 }),
            " ",
            stats.pending_orders,
            " pending order",
            stats.pending_orders > 1 ? "s" : "",
            " need attention"
          ]
        }
      ),
      stats.pending_reviews > 0 && /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `${ap}/reviews`,
          className: "flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-300 rounded-xl text-blue-800 text-[13px] font-semibold no-underline hover:bg-blue-100 transition-colors",
          children: [
            /* @__PURE__ */ jsx(IconStar, { size: 16 }),
            " ",
            stats.pending_reviews,
            " review",
            stats.pending_reviews > 1 ? "s" : "",
            " pending approval"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5", children: statCards.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-3.5", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0",
          style: { background: s.color + "18" },
          children: /* @__PURE__ */ jsx(s.icon, { size: 21, style: { color: s.color } })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-500 font-semibold truncate", children: s.label }),
        /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[20px] leading-none mt-1", style: { color: "var(--color-dark-bg)" }, children: s.value }),
        s.change && /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-green-500 mt-1", children: s.change })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px]", style: { color: "var(--color-dark-bg)" }, children: "Revenue (12 months)" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mt-0.5", children: "Monthly revenue trend" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[18px]", style: { color: "var(--color-primary)" }, children: fmt(stats.revenue) }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: "Total all time" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxs(AreaChart, { data: revenueChart, margin: { top: 5, right: 5, left: 5, bottom: 5 }, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "revGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "var(--color-primary)", stopOpacity: 0.25 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "var(--color-primary)", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "month", tick: { fontSize: 11, fill: "#999" }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11, fill: "#999" }, axisLine: false, tickLine: false, tickFormatter: (v) => `Rs ${v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : v}` }),
          /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "var(--color-primary)", strokeWidth: 2.5, fill: "url(#revGrad)", dot: false, activeDot: { r: 5 } })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px] mb-4", style: { color: "var(--color-dark-bg)" }, children: "Top Products" }),
        topProducts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-[200px] text-gray-300 text-[13px]", children: "No sales yet" }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxs(BarChart, { data: topProducts, layout: "vertical", margin: { top: 0, right: 10, left: 0, bottom: 0 }, children: [
          /* @__PURE__ */ jsx(XAxis, { type: "number", tick: { fontSize: 10 }, axisLine: false, tickLine: false, tickFormatter: (v) => `${v}` }),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              type: "category",
              dataKey: "name",
              tick: { fontSize: 10, fill: "#666" },
              axisLine: false,
              tickLine: false,
              width: 70,
              tickFormatter: (v) => v.length > 10 ? v.slice(0, 10) + "…" : v
            }
          ),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => [`${v} sold`, "Units"] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "sold", radius: [0, 6, 6, 0], children: topProducts.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: "var(--color-primary)", fillOpacity: 1 - i * 0.15 }, i)) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Recent Orders" }),
          /* @__PURE__ */ jsx(Link_default, { href: `${ap}/orders`, className: "text-[12.5px] font-bold no-underline hover:underline", style: { color: "var(--color-primary)" }, children: "View all →" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "w-full min-w-[500px]", children: /* @__PURE__ */ jsx("tbody", { children: recentOrders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "px-5 py-10 text-center text-gray-400 text-[13px]", children: "No orders yet" }) }) : recentOrders.map((o) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold text-[13px]", style: { color: "var(--color-primary)" }, children: [
              "#",
              o.id
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: o.date })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13px] text-gray-900", children: o.customer }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: fmt(o.total) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[o.status] ?? STATUS_COLORS.pending}`, children: o.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx(Link_default, { href: `${ap}/orders/${o.id}`, className: "w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all", children: /* @__PURE__ */ jsx(IconEye, { size: 13 }) }) })
        ] }, o.id)) }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Low Stock" }),
          /* @__PURE__ */ jsx(Link_default, { href: `${ap}/products`, className: "text-[12.5px] font-bold no-underline hover:underline", style: { color: "var(--color-primary)" }, children: "Manage →" })
        ] }),
        lowStock.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-5 py-10 text-center text-gray-400 text-[13px]", children: "✓ All products well stocked" }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: lowStock.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-900 truncate", children: p.name }) }),
          /* @__PURE__ */ jsx("span", { className: `text-[11.5px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0
                                        ${p.stock === 0 ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`, children: p.stock === 0 ? "Out of stock" : `${p.stock} left` })
        ] }, p.id)) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as default
};
