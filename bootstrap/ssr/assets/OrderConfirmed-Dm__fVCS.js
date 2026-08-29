import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconCheck, IconClock, IconCreditCard, IconBrandWhatsapp, IconPhone, IconHome, IconShoppingBag } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-DANnSWOS.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  safepay: "Safepay",
  stripe: "Stripe (Card)",
  paypal: "PayPal",
  razorpay: "Razorpay",
  paystack: "Paystack",
  flutterwave: "Flutterwave"
};
function OrderConfirmed({ order, auth, settings }) {
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const displayNum = (order == null ? void 0 : order.order_number) ?? `#${order == null ? void 0 : order.id}`;
  const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const phone = (settings == null ? void 0 : settings.phone) ?? "";
  const isPaid = (order == null ? void 0 : order.payment_status) === "paid";
  const isCOD = (order == null ? void 0 : order.payment_method) === "cod";
  const isBank = (order == null ? void 0 : order.payment_method) === "bank_transfer";
  const method = PAYMENT_LABELS[(order == null ? void 0 : order.payment_method) ?? ""] ?? (order == null ? void 0 : order.payment_method) ?? "";
  const waMsg = order ? encodeURIComponent(
    `Hi, I placed order ${displayNum} for ${fmt(order.total)} via ${method}. Please confirm. Name: ${order.customer_name}, Phone: ${order.customer_phone}`
  ) : "";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Order Confirmed" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-xl mx-auto px-4 py-12 sm:py-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg",
            style: { background: "var(--color-primary)" },
            children: /* @__PURE__ */ jsx(IconCheck, { size: 38, style: { color: "var(--color-primary-text)" } })
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "font-manrope font-black text-[28px] sm:text-[32px] text-gray-900 mb-2", children: "Order Placed!" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[15px]", children: order ? `${displayNum} confirmed — ${order.items_count} item${order.items_count !== 1 ? "s" : ""}` : "Your order has been received." })
      ] }),
      order && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-5 border-b border-gray-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Order Number" }),
            /* @__PURE__ */ jsx("span", { className: "font-manrope font-black text-[15px]", children: displayNum })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Total" }),
            /* @__PURE__ */ jsx("span", { className: "font-manrope font-black text-[18px]", style: { color: "var(--color-primary)" }, children: fmt(order.total) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Payment Method" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-[13.5px] text-gray-900", children: method })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `p-5 ${isPaid ? "bg-green-50" : isCOD ? "bg-amber-50" : isBank ? "bg-blue-50" : "bg-gray-50"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? "bg-green-100" : isCOD ? "bg-amber-100" : "bg-blue-100"}`, children: isPaid ? /* @__PURE__ */ jsx(IconCheck, { size: 18, className: "text-green-600" }) : isCOD ? /* @__PURE__ */ jsx(IconClock, { size: 18, className: "text-amber-600" }) : /* @__PURE__ */ jsx(IconCreditCard, { size: 18, className: "text-blue-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            isPaid && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-green-800", children: "✓ Payment Confirmed" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-green-700 mt-0.5", children: "Your payment was received. We're preparing your order." })
            ] }),
            !isPaid && isCOD && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-amber-800", children: "Cash on Delivery" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-amber-700 mt-0.5", children: [
                "Pay ",
                /* @__PURE__ */ jsx("strong", { children: fmt(order.total) }),
                " in cash when your order arrives at your door. No advance payment needed."
              ] })
            ] }),
            !isPaid && isBank && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-blue-800", children: "⏳ Awaiting Payment Confirmation" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-blue-700 mt-0.5", children: "We received your order and payment receipt. We'll confirm once the transfer is verified (usually within 1-2 hours)." })
            ] }),
            !isPaid && !isCOD && !isBank && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-gray-800", children: "⏳ Payment Pending" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-600 mt-0.5", children: "Your order is placed. Payment status will update once confirmed by the gateway." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 border-t border-gray-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] font-black text-gray-400 uppercase tracking-wider mb-3", children: "What Happens Next" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: [
            { n: "1", text: isPaid ? "Order confirmed & being prepared" : isCOD ? "We confirm your order & prepare it" : isBank ? "We verify your payment receipt" : "Payment verified by gateway", done: isPaid },
            { n: "2", text: "We contact you to confirm delivery details", done: false },
            { n: "3", text: "Order dispatched & delivered to you", done: false }
          ].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${s.done ? "text-white" : "bg-gray-100 text-gray-500"}`,
                style: s.done ? { background: "var(--color-primary)", color: "var(--color-primary-text)" } : {},
                children: s.done ? "✓" : s.n
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `text-[12.5px] ${s.done ? "font-semibold text-gray-900" : "text-gray-500"}`, children: s.text })
          ] }, s.n)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 mb-6", children: [
        whatsapp && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `https://wa.me/${whatsapp}?text=${waMsg}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center justify-center gap-2.5 h-12 w-full bg-[#25D366] text-white font-bold text-[14px] rounded-xl no-underline hover:bg-[#1da853] transition-colors",
            children: [
              /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 20 }),
              " Contact Us on WhatsApp"
            ]
          }
        ),
        phone && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `tel:${phone}`,
            className: "flex items-center justify-center gap-2.5 h-11 w-full border-2 border-gray-200 text-gray-700 font-semibold text-[13.5px] rounded-xl no-underline hover:border-gray-300 transition-colors",
            children: [
              /* @__PURE__ */ jsx(IconPhone, { size: 16 }),
              " Call Us: ",
              phone
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/",
            className: "flex-1 flex items-center justify-center gap-2 h-11 border-2 border-gray-200 rounded-xl font-semibold text-[13px] text-gray-600 no-underline hover:border-gray-300 transition-all",
            children: [
              /* @__PURE__ */ jsx(IconHome, { size: 15 }),
              " Home"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/shop",
            className: "flex-1 flex items-center justify-center gap-2 h-11 font-black text-[13px] rounded-xl no-underline transition-all",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconShoppingBag, { size: 15 }),
              " Shop More"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  OrderConfirmed as default
};
