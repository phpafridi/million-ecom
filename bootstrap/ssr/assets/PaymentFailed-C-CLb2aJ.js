import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconX, IconRefresh, IconBrandWhatsapp, IconPhone } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-BzEeKzY0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
function PaymentFailed({ auth, settings, reason }) {
  const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const phone = (settings == null ? void 0 : settings.phone) ?? "";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Payment Failed" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(IconX, { size: 38, className: "text-red-500" }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-manrope font-black text-[28px] mb-3", style: { color: "var(--color-body-text)" }, children: "Payment Failed" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[15px] mb-2", children: "Your payment was not completed." }),
      reason && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-[13px] mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3", children: reason }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[13px] mb-8", children: "Your order has NOT been placed. No charges were made. Please try again or choose a different payment method." }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/cart",
            className: "flex items-center justify-center gap-2 h-12 w-full font-black text-[14px] rounded-xl no-underline transition-all",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconRefresh, { size: 18 }),
              " Try Again"
            ]
          }
        ),
        whatsapp && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi, I had a payment issue and need help completing my order.")}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center justify-center gap-2 h-11 w-full bg-[#25D366] text-white font-bold text-[13.5px] rounded-xl no-underline hover:bg-[#1da853] transition-colors",
            children: [
              /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 18 }),
              " Get Help on WhatsApp"
            ]
          }
        ),
        phone && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `tel:${phone}`,
            className: "flex items-center justify-center gap-2 h-11 w-full border-2 border-gray-200 text-gray-700 font-semibold text-[13.5px] rounded-xl no-underline hover:border-gray-300 transition-colors",
            children: [
              /* @__PURE__ */ jsx(IconPhone, { size: 16 }),
              " Call Us"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Link_default, { href: "/", className: "text-[13px] text-gray-400 no-underline hover:underline", children: "← Back to Home" })
    ] })
  ] });
}
export {
  PaymentFailed as default
};
