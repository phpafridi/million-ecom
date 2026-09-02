import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconCheck, IconHome, IconShoppingBag } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-BxLnnCms.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
function OrderConfirmation({ order, settings, auth }) {
  var _a, _b, _c;
  const fmt = (n) => `Rs ${n.toLocaleString("en-PK")}`;
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `Order #${order.id} Confirmed` }),
    /* @__PURE__ */ jsx("div", { className: "min-h-[70vh] flex items-center justify-center px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg",
          style: { background: "var(--color-primary)" },
          children: /* @__PURE__ */ jsx(IconCheck, { size: 36, style: { color: "var(--color-primary-text)" }, strokeWidth: 3 })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "font-manrope font-black text-[26px] mb-2", style: { color: "var(--color-dark-bg)" }, children: "Order Confirmed!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-[14px] mb-6", children: [
        "Thank you, ",
        /* @__PURE__ */ jsx("strong", { children: (_a = order.shipping_address) == null ? void 0 : _a.name }),
        "! Your order ",
        /* @__PURE__ */ jsxs("strong", { children: [
          "#",
          order.id
        ] }),
        " has been placed."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 text-left mb-6 space-y-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13.5px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Order #" }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: order.id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13.5px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "font-bold", children: fmt(order.total) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13.5px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Payment" }),
          /* @__PURE__ */ jsx("span", { className: "font-bold capitalize", children: order.payment_method.replace("_", " ") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13.5px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Deliver to" }),
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-right", children: [
            (_b = order.shipping_address) == null ? void 0 : _b.address,
            ", ",
            (_c = order.shipping_address) == null ? void 0 : _c.city
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-[13px] no-underline", children: [
          /* @__PURE__ */ jsx(IconHome, { size: 16 }),
          " Home"
        ] }),
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/shop",
            className: "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-black text-[13px] no-underline",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconShoppingBag, { size: 16 }),
              " Shop More"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  OrderConfirmation as default
};
