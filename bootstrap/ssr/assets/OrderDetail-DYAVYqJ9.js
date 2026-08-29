import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-DANnSWOS.js";
import AccountSidebar from "./AccountSidebar-zWUfAXZr.js";
import { IconArrowLeft, IconCopy, IconPackage, IconClock, IconTruck, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const STEP_ICONS = [IconPackage, IconClock, IconTruck, IconCheck];
const STATUS_COLOR = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
const STEPS = ["pending", "processing", "shipped", "delivered"];
const STEP_LABELS = ["Order Placed", "Processing", "Shipped", "Delivered"];
function OrderDetail({ order, settings, auth }) {
  var _a;
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const [copied, setCopied] = useState(false);
  const copyToken = () => {
    navigator.clipboard.writeText(order.tracking_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `Order #${order.id}` }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-0 lg:py-8 px-0 lg:px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth, active: "orders" }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-4 px-4 pt-5 lg:px-0 lg:pt-0", children: [
        /* @__PURE__ */ jsxs(Link_default, { href: "/account/orders", className: "inline-flex items-center gap-2 text-[13px] font-semibold text-gray-500 no-underline hover:text-gray-700", children: [
          /* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }),
          " Back to Orders"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h2", { className: "font-black text-xl", style: { color: "var(--color-dark-bg)" }, children: [
                "Order #",
                order.id
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[13px] mt-0.5", children: [
                "Placed on ",
                order.created_at
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `text-[12px] font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] || ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 font-medium", children: "Tracking Number" }),
              /* @__PURE__ */ jsx("p", { className: "font-mono font-black text-[15px]", style: { color: "var(--color-primary)" }, children: order.tracking_token })
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: copyToken,
                className: "flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-white transition-colors",
                children: [
                  /* @__PURE__ */ jsx(IconCopy, { size: 13 }),
                  copied ? "Copied!" : "Copy"
                ]
              }
            )
          ] }),
          !order.cancelled ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-5 left-5 right-5 h-0.5 bg-gray-100" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute top-5 left-5 h-0.5 transition-all duration-700",
                style: {
                  background: "var(--color-primary)",
                  width: order.current_step === 0 ? "0%" : `${order.current_step / 3 * 100}%`
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative flex justify-between", children: STEPS.map((s, i) => {
              const Icon = STEP_ICONS[i];
              const done = i <= order.current_step;
              const active = i === order.current_step;
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 w-1/4", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                                                            ${done ? "border-transparent text-white" : "border-gray-200 text-gray-300 bg-white"}
                                                            ${active ? "ring-4 ring-offset-1" : ""}`,
                    style: {
                      background: done ? "var(--color-primary)" : void 0,
                      ["--tw-ring-color"]: "var(--color-primary)30"
                    },
                    children: /* @__PURE__ */ jsx(Icon, { size: 18 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[11px] font-bold text-center ${active ? "" : done ? "text-gray-500" : "text-gray-300"}`,
                    style: active ? { color: "var(--color-primary)" } : {},
                    children: STEP_LABELS[i]
                  }
                )
              ] }, s);
            }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-red-50 rounded-xl px-4 py-3", children: [
            /* @__PURE__ */ jsx(IconX, { size: 18, className: "text-red-500" }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-red-600 text-[13.5px]", children: "This order was cancelled" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 sm:col-span-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] mb-4", style: { color: "var(--color-dark-bg)" }, children: "Items" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: order.items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 py-2 border-b border-gray-50 last:border-0", children: [
              item.image ? /* @__PURE__ */ jsx("img", { src: item.image, className: "w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0" }) : /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(IconPackage, { size: 18, className: "text-gray-300" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-[13px] truncate", style: { color: "var(--color-dark-bg)" }, children: item.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[11.5px]", children: [
                  "Qty ",
                  item.quantity,
                  " × ",
                  fmt(item.price)
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[13.5px] shrink-0", style: { color: "var(--color-dark-bg)" }, children: fmt(item.subtotal) })
            ] }, i)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-gray-100 space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[12.5px] text-gray-500", children: [
                /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
                /* @__PURE__ */ jsx("span", { children: fmt(order.subtotal) })
              ] }),
              order.shipping > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[12.5px] text-gray-500", children: [
                /* @__PURE__ */ jsx("span", { children: "Shipping" }),
                /* @__PURE__ */ jsx("span", { children: fmt(order.shipping) })
              ] }),
              order.discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[12.5px] text-green-600", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Discount ",
                  order.coupon_code && `(${order.coupon_code})`
                ] }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "-",
                  fmt(order.discount)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-black text-[15px] pt-2 border-t border-gray-100", children: [
                /* @__PURE__ */ jsx("span", { style: { color: "var(--color-dark-bg)" }, children: "Total" }),
                /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: fmt(order.total) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] mb-3", style: { color: "var(--color-dark-bg)" }, children: "Delivery" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-[13px]", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: order.customer_name }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: order.customer_phone }),
              order.customer_email && /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: order.customer_email }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: order.customer_address }),
              order.city && /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: order.city })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] mb-3", style: { color: "var(--color-dark-bg)" }, children: "Payment" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-[13px]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Method" }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold capitalize", children: order.payment_method.replace("_", " ") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "Status" }),
                /* @__PURE__ */ jsx("span", { className: `font-bold capitalize ${order.payment_status === "paid" ? "text-green-600" : "text-amber-600"}`, children: order.payment_status })
              ] })
            ] })
          ] })
        ] }),
        ((_a = order.history) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] mb-4", style: { color: "var(--color-dark-bg)" }, children: "Status History" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-0", children: order.history.map((h, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pb-5 last:pb-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                  style: { background: i === 0 ? "var(--color-primary)" : "#D1D5DB" }
                }
              ),
              i < order.history.length - 1 && /* @__PURE__ */ jsx("div", { className: "w-px flex-1 bg-gray-100 mt-1" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pb-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[13px] capitalize", style: { color: "var(--color-dark-bg)" }, children: h.status }),
              h.note && /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[12px] mt-0.5", children: h.note }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[11px] mt-1", children: h.date })
            ] })
          ] }, i)) })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  OrderDetail as default
};
