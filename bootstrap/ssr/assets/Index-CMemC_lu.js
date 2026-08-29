import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-ClODoR4t.js";
import { useState } from "react";
import { IconDownload, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const COLORS = ["#C9A84C", "#0a0a0a", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
const fmt = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");
function Reports({ from, to, revenueDaily, byPayment, byCity, topProducts, byStatus, lowStock, kpis }) {
  const { props: pp } = usePage();
  const ap = `/${pp.adminPath ?? "ml-admin"}`;
  const [df, setDf] = useState(from);
  const [dt, setDt] = useState(to);
  const growth = kpis.last_month > 0 ? (kpis.this_month - kpis.last_month) / kpis.last_month * 100 : 0;
  const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
  function applyFilter() {
    router3.get(`${ap}/reports`, { from: df, to: dt }, { preserveState: true });
  }
  const KCard = ({ label, value, sub, up }) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[12px] font-bold text-gray-400 uppercase tracking-wide mb-2", children: label }),
    /* @__PURE__ */ jsx("p", { className: "font-black text-[26px] text-gray-900", children: value }),
    sub && /* @__PURE__ */ jsxs("p", { className: `text-[12px] font-semibold mt-1 flex items-center gap-1 ${up === true ? "text-green-600" : up === false ? "text-red-500" : "text-gray-400"}`, children: [
      up === true ? /* @__PURE__ */ jsx(IconTrendingUp, { size: 13 }) : up === false ? /* @__PURE__ */ jsx(IconTrendingDown, { size: 13 }) : null,
      sub
    ] })
  ] });
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Reports", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Reports" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-gray-500", children: "From" }),
        /* @__PURE__ */ jsx("input", { type: "date", value: df, onChange: (e) => setDf(e.target.value), className: "text-[13px] outline-none border-none bg-transparent" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-gray-500", children: "To" }),
        /* @__PURE__ */ jsx("input", { type: "date", value: dt, onChange: (e) => setDt(e.target.value), className: "text-[13px] outline-none border-none bg-transparent" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: applyFilter, className: "h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Apply" }),
      /* @__PURE__ */ jsxs("a", { href: `${ap}/reports/export?from=${df}&to=${dt}`, className: "h-10 px-5 rounded-xl font-bold text-[13px] border border-gray-200 text-gray-600 bg-white cursor-pointer flex items-center gap-2 no-underline", children: [
        /* @__PURE__ */ jsx(IconDownload, { size: 15 }),
        " Export CSV"
      ] }),
      [["Today", 0], ["7d", 7], ["30d", 30], ["90d", 90]].map(([l, d]) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            const f = /* @__PURE__ */ new Date();
            f.setDate(f.getDate() - d);
            const fd = f.toISOString().split("T")[0];
            const td = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            router3.get(`${ap}/reports`, { from: fd, to: td }, { preserveState: true });
          },
          className: "h-9 px-3 rounded-lg text-[12px] font-bold border border-gray-200 text-gray-600 bg-white cursor-pointer hover:bg-gray-50",
          children: l
        },
        l
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5", children: [
      /* @__PURE__ */ jsx(KCard, { label: "Revenue", value: fmt(kpis.total_revenue), sub: `${growth > 0 ? "+" : ""}${growth.toFixed(1)}% vs last month`, up: growth > 0 }),
      /* @__PURE__ */ jsx(KCard, { label: "Orders", value: String(kpis.total_orders) }),
      /* @__PURE__ */ jsx(KCard, { label: "Avg Order", value: fmt(kpis.avg_order) }),
      /* @__PURE__ */ jsx(KCard, { label: "New Customers", value: String(kpis.new_customers), up: kpis.new_customers > 0 }),
      /* @__PURE__ */ jsx(KCard, { label: "This Month", value: fmt(kpis.this_month) }),
      /* @__PURE__ */ jsx(KCard, { label: "Last Month", value: fmt(kpis.last_month) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-4", children: "Revenue Over Time" }),
      /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxs(AreaChart, { data: revenueDaily, children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "rg", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "var(--color-primary)", stopOpacity: 0.15 }),
          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "var(--color-primary)", stopOpacity: 0 })
        ] }) }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#F3F4F6" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: { fontSize: 10 }, tickFormatter: (d) => d.slice(5) }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10 }, tickFormatter: (v) => "Rs " + Math.round(v / 1e3) + "k" }),
        /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => [fmt(v), "Revenue"] }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "var(--color-primary)", strokeWidth: 2.5, fill: "url(#rg)" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-4", children: "Top Selling Products" }),
        topProducts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[13px]", children: "No sales data yet" }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: topProducts.slice(0, 8).map((p, i) => {
          var _a;
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[11px] font-black flex items-center justify-center flex-shrink-0", children: i + 1 }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-[13px] text-gray-800 truncate", children: p.product_name }),
              /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-gray-100 rounded-full mt-1", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full", style: { width: `${((_a = topProducts[0]) == null ? void 0 : _a.revenue) > 0 ? p.revenue / topProducts[0].revenue * 100 : 0}%`, background: "var(--color-primary)" } }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-black text-[13px] text-gray-800", children: fmt(p.revenue) }),
              /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400", children: [
                p.qty,
                " sold"
              ] })
            ] })
          ] }, p.product_name);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-4", children: "Order Status" }),
        statusData.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 150, children: /* @__PURE__ */ jsxs(PieChart, { children: [
            /* @__PURE__ */ jsx(Pie, { data: statusData, cx: "50%", cy: "50%", innerRadius: 40, outerRadius: 65, paddingAngle: 3, dataKey: "value", children: statusData.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
            /* @__PURE__ */ jsx(Tooltip, {})
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-1.5 mt-2", children: statusData.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[12px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full", style: { background: COLORS[i % COLORS.length] } }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 capitalize", children: s.name })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800", children: s.value })
          ] }, s.name)) })
        ] }) : /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[13px]", children: "No orders yet" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-4", children: "Revenue by Payment" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxs(BarChart, { data: byPayment, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#F3F4F6" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "payment_method", tick: { fontSize: 10 } }),
          /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10 }, tickFormatter: (v) => "Rs " + Math.round(v / 1e3) + "k" }),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => [fmt(v), "Revenue"] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "revenue", fill: "var(--color-primary)", radius: [5, 5, 0, 0] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-4", children: "📍 Revenue by City" }),
        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxs(BarChart, { data: byCity, layout: "vertical", children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#F3F4F6", horizontal: false }),
          /* @__PURE__ */ jsx(XAxis, { type: "number", tick: { fontSize: 10 }, tickFormatter: (v) => "Rs " + Math.round(v / 1e3) + "k" }),
          /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "city", tick: { fontSize: 10 }, width: 80 }),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => [fmt(v), "Revenue"] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "revenue", radius: [0, 6, 6, 0], children: byCity.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-4", children: "⚠️ Low Stock Alert" }),
        lowStock.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-green-600 font-semibold text-[13px]", children: "✅ All products well stocked" }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: lowStock.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[13px] text-gray-800", children: p.name }),
            p.sku && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400", children: [
              "SKU: ",
              p.sku
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `text-[12px] font-black px-3 py-1 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`, children: p.stock === 0 ? "Out of Stock" : `${p.stock} left` })
        ] }, p.id)) })
      ] })
    ] })
  ] });
}
export {
  Reports as default
};
