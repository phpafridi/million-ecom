import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-K_5Bgk86.js";
import AccountSidebar from "./AccountSidebar-zWUfAXZr.js";
import { IconPackage, IconTruck, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
const STATUS_COLOR = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
const STATUSES = ["", "pending", "processing", "shipped", "delivered", "cancelled"];
function AccountOrders({ orders, filters, settings, auth }) {
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const [status, setStatus] = useState(filters.status ?? "");
  function filter(s) {
    setStatus(s);
    router3.get("/account/orders", s ? { status: s } : {}, { preserveState: true });
  }
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "My Orders" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-0 lg:py-8 px-0 lg:px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth, active: "orders" }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3 space-y-4 px-4 pt-5 lg:px-0 lg:pt-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("h2", { className: "font-black text-[18px]", style: { color: "var(--color-dark-bg)" }, children: [
          "My Orders",
          /* @__PURE__ */ jsxs("span", { className: "text-gray-400 font-normal text-[13px] ml-2", children: [
            "(",
            orders.total,
            ")"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap mb-5", children: STATUSES.map((s) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => filter(s),
            className: "h-8 px-3 rounded-lg text-[12px] font-bold border cursor-pointer transition-all",
            style: status === s ? { background: "var(--color-primary)", color: "var(--color-primary-text)", borderColor: "var(--color-primary)" } : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" },
            children: s === "" ? "All Orders" : s.charAt(0).toUpperCase() + s.slice(1)
          },
          s
        )) }),
        orders.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx(IconPackage, { size: 44, className: "text-gray-200 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[14px] mb-4", children: "No orders found." }),
          /* @__PURE__ */ jsx(
            Link_default,
            {
              href: "/shop",
              className: "inline-flex items-center gap-2 font-bold text-[13px] h-10 px-5 rounded-xl no-underline",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: "Start Shopping →"
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: orders.data.map((order) => {
          var _a;
          return /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: `/account/orders/${order.id}`,
              className: "flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all no-underline group",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                    style: { background: "var(--color-primary)15" },
                    children: /* @__PURE__ */ jsx(IconTruck, { size: 20, style: { color: "var(--color-primary)" } })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px]", style: { color: "var(--color-dark-bg)" }, children: order.order_number ?? `Order #${order.id}` }),
                    order.tracking_token && /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-gray-400", children: [
                      "#",
                      order.tracking_token
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[12px]", children: [
                    order.items_count,
                    " item",
                    order.items_count !== 1 ? "s" : "",
                    " · ",
                    order.created_at,
                    " · ",
                    (_a = order.payment_method) == null ? void 0 : _a.replace("_", " ")
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status] || ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) }),
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[15px]", style: { color: "var(--color-dark-bg)" }, children: fmt(order.total) }),
                  /* @__PURE__ */ jsx(IconChevronRight, { size: 16, className: "text-gray-300 group-hover:text-gray-400" })
                ] })
              ]
            },
            order.id
          );
        }) }),
        orders.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-6", children: Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => router3.get("/account/orders", { ...filters, page }),
            className: "w-9 h-9 rounded-lg text-[13px] font-bold border cursor-pointer transition-all",
            style: page === orders.current_page ? { background: "var(--color-primary)", color: "var(--color-primary-text)", borderColor: "var(--color-primary)" } : { background: "white", color: "#6B7280", borderColor: "#E5E7EB" },
            children: page
          },
          page
        )) })
      ] }) })
    ] }) }) })
  ] });
}
export {
  AccountOrders as default
};
