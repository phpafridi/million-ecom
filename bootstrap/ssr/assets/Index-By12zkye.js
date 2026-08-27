import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconSearch, IconEye, IconTrash, IconPackage } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const STATUS_COLORS = {
  pending: "bg-amber-50  text-amber-700  border-amber-200",
  processing: "bg-blue-50   text-blue-700   border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50  text-green-700  border-green-200",
  cancelled: "bg-red-50    text-red-600    border-red-200"
};
const PAY_COLORS = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  paid: "bg-green-50 text-green-600 border-green-200",
  failed: "bg-red-50   text-red-600   border-red-200",
  refunded: "bg-gray-100 text-gray-600  border-gray-200"
};
function OrdersIndex({ orders, filters }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const [search, setSearch] = useState(filters.q ?? "");
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  function doSearch(e) {
    e.preventDefault();
    router3.get(`${ap}/orders`, { q: search, status: filters.status }, { preserveState: true });
  }
  function setStatus(status) {
    router3.get(`${ap}/orders`, { q: filters.q, status: status || void 0 }, { preserveState: true });
  }
  function updateStatus(id, status) {
    router3.patch(`${ap}/orders/${id}`, { status }, { preserveScroll: true });
  }
  function del(id) {
    if (!confirm("Delete this order permanently?")) return;
    router3.delete(`${ap}/orders/${id}`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Orders", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Orders — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: doSearch, className: "flex flex-1 min-w-[200px] max-w-sm bg-white border border-gray-200 rounded-xl overflow-hidden h-10 focus-within:border-[var(--color-primary)] transition-colors", children: [
        /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name, phone, ID…", className: "flex-1 px-4 text-[13px] outline-none border-none" }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 text-[var(--color-primary)] border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconSearch, { size: 17 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 flex-wrap", children: ["", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStatus(s),
          className: `px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all cursor-pointer
                                ${(filters.status ?? "") === s ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`,
          style: (filters.status ?? "") === s ? { background: "var(--color-primary)" } : {},
          children: s || "All"
        },
        s
      )) }),
      /* @__PURE__ */ jsxs("span", { className: "ml-auto text-[13px] text-gray-500", children: [
        orders.total,
        " orders"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[800px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: ["Order", "Customer", "Items", "Total", "Payment", "Status", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5", children: h }, h)) }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          orders.data.map((order) => {
            var _a, _b;
            return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: order.order_number ?? `#${order.id}` }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) })
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13px] text-gray-900", children: order.customer_name }),
                /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400", children: order.customer_phone })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "text-[13px] text-gray-700 font-medium", children: [
                ((_a = order.items) == null ? void 0 : _a.length) ?? 0,
                " item",
                (((_b = order.items) == null ? void 0 : _b.length) ?? 0) !== 1 ? "s" : ""
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-manrope font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: fmt(order.total) }),
              /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[12.5px] font-semibold text-gray-800 capitalize mb-0.5", children: order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method === "bank_transfer" ? "Bank Transfer" : (order.payment_method ?? "").replace(/_/g, " ") }),
                /* @__PURE__ */ jsx("span", { className: `text-[10.5px] font-bold px-2 py-0.5 rounded-full border capitalize ${PAY_COLORS[order.payment_status] ?? PAY_COLORS.pending}`, children: order.payment_status })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
                "select",
                {
                  value: order.status,
                  onChange: (e) => updateStatus(order.id, e.target.value),
                  className: `text-[11px] font-bold px-2.5 py-1 pr-6 rounded-full border appearance-none cursor-pointer outline-none ${STATUS_COLORS[order.status] ?? STATUS_COLORS.pending}`,
                  children: ["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s))
                }
              ) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 ", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `${ap}/orders/${order.id}/invoice`,
                    target: "_blank",
                    title: "Print Invoice",
                    className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-gray-400 transition-all text-[11px]",
                    children: "🖨️"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link_default,
                  {
                    href: `${ap}/orders/${order.id}`,
                    className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all",
                    children: /* @__PURE__ */ jsx(IconEye, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => del(order.id),
                    className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all",
                    children: /* @__PURE__ */ jsx(IconTrash, { size: 14 })
                  }
                )
              ] }) })
            ] }, order.id);
          }),
          orders.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "px-5 py-16 text-center", children: [
            /* @__PURE__ */ jsx(IconPackage, { size: 36, className: "text-gray-300 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-[13px]", children: "No orders yet" })
          ] }) })
        ] })
      ] }) }),
      orders.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "px-5 py-3.5 border-t border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[13px] text-gray-500", children: [
          "Page ",
          orders.current_page,
          " of ",
          orders.last_page
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          orders.current_page > 1 && /* @__PURE__ */ jsx("button", { onClick: () => router3.get(`${ap}/orders`, { ...filters, page: orders.current_page - 1 }), className: "h-8 px-4 text-[12px] border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--color-primary)]", children: "← Prev" }),
          orders.current_page < orders.last_page && /* @__PURE__ */ jsx("button", { onClick: () => router3.get(`${ap}/orders`, { ...filters, page: orders.current_page + 1 }), className: "h-8 px-4 text-[12px] border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-[var(--color-primary)]", children: "Next →" })
        ] })
      ] })
    ] })
  ] });
}
export {
  OrdersIndex as default
};
