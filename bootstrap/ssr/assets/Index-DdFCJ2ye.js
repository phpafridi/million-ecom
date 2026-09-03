import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default } from "../ssr.js";
import { IconUsers, IconUserCheck, IconShoppingBag, IconCurrencyRupee } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function CustomersIndex({ customers, stats }) {
  const { props } = usePage();
  `/${props.adminPath ?? "ml-admin"}`;
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Customers", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Customers — Admin" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6", children: [
      { label: "Total Customers", value: stats.total, icon: IconUsers, color: "blue" },
      { label: "Registered", value: stats.registered, icon: IconUserCheck, color: "green" },
      { label: "Guest Buyers", value: stats.guests, icon: IconShoppingBag, color: "purple" },
      { label: "Total Revenue", value: fmt(stats.total_revenue), icon: IconCurrencyRupee, color: "amber" }
    ].map((s) => /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          style: { background: "var(--color-primary)15", color: "var(--color-primary)" },
          children: /* @__PURE__ */ jsx(s.icon, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-500 font-semibold", children: s.label }),
        /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[18px]", style: { color: "var(--color-dark-bg)" }, children: s.value })
      ] })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[700px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: ["Customer", "Contact", "Type", "Orders", "Total Spent", "Last Seen"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: customers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 6, className: "px-5 py-16 text-center", children: [
        /* @__PURE__ */ jsx(IconUsers, { size: 36, className: "text-gray-300 mx-auto mb-3" }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-[13px]", children: "No customers yet. Customers appear here once they place an order." })
      ] }) }) : customers.map((c) => {
        var _a;
        return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-9 h-9 rounded-full flex items-center justify-center font-black text-[13px] text-white flex-shrink-0",
                style: { background: "var(--color-primary)" },
                children: (_a = c.name[0]) == null ? void 0 : _a.toUpperCase()
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13.5px] text-gray-900", children: c.name })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
            c.phone && /* @__PURE__ */ jsx("div", { className: "text-[12.5px] text-gray-700", children: c.phone }),
            c.email && /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400", children: c.email })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.type === "registered" ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`, children: c.type === "registered" ? "✓ Registered" : "Guest" }) }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5 text-[13px] font-semibold text-gray-700", children: [
            c.order_count,
            " orders"
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-manrope font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: fmt(c.total_spent) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-[12px] text-gray-400", children: c.created_at ? new Date(c.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—" })
        ] }, c.id);
      }) })
    ] }) }) })
  ] });
}
export {
  CustomersIndex as default
};
