import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-B20RMF_j.js";
import { IconTruck, IconSearch, IconX, IconPackage, IconClock, IconCheck, IconReceipt } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
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
function TrackOrder({ order: initialOrder, settings, auth }) {
  var _a, _b;
  const { props } = usePage();
  const flashResult = (_a = props.flash) == null ? void 0 : _a.tracking_result;
  const flashError = (_b = props.flash) == null ? void 0 : _b.tracking_error;
  const order = flashResult || initialOrder;
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const { data, setData, post, processing } = useForm({ query: "" });
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Track Your Order" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-10 px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
            style: { background: "var(--color-primary)" },
            children: /* @__PURE__ */ jsx(IconTruck, { size: 32, color: "white" })
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "font-black text-3xl mb-2", style: { color: "var(--color-body-text)" }, children: "Track Your Order" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[15px]", children: "Enter your tracking number, order ID, or phone number" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6", children: [
        /* @__PURE__ */ jsx("form", { onSubmit: (e) => {
          e.preventDefault();
          post("/track-order");
        }, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
            /* @__PURE__ */ jsx(IconSearch, { size: 18, className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.query,
                onChange: (e) => setData("query", e.target.value),
                placeholder: "e.g. ABC123XYZ or 03001234567",
                required: true,
                className: "w-full pl-11 pr-4 h-12 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:border-transparent",
                style: { "--tw-ring-color": "var(--color-primary)" }
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "h-12 px-6 rounded-xl font-bold text-[14px] disabled:opacity-60 transition-opacity",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: processing ? "Searching..." : "Track"
            }
          )
        ] }) }),
        flashError && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-[13.5px]", children: [
          /* @__PURE__ */ jsx(IconX, { size: 16 }),
          " ",
          flashError
        ] })
      ] }),
      order && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[12px] font-semibold uppercase tracking-wide mb-1", children: [
                "Order #",
                order.order_number ?? order.id
              ] }),
              /* @__PURE__ */ jsx("p", { className: "font-black text-xl", style: { color: "var(--color-body-text)" }, children: order.customer_name }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[13px] mt-0.5", children: [
                order.customer_phone,
                " · ",
                order.created_at
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `text-[12px] font-bold px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] || ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 mb-6", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[12px] text-gray-500 font-medium", children: "Tracking #:" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-[13px]", style: { color: "var(--color-primary)" }, children: order.tracking_token })
          ] }),
          (order.courier || order.tracking_number) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-6", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[16px]", children: "🚚" }),
            order.courier && /* @__PURE__ */ jsx("span", { className: "text-[12.5px] font-bold text-blue-800", children: order.courier }),
            order.tracking_number && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[12px] text-blue-400", children: "·" }),
              /* @__PURE__ */ jsx("span", { className: "text-[12px] text-blue-600", children: "Consignment #" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-[13px] text-blue-800", children: order.tracking_number })
            ] })
          ] }),
          !order.cancelled ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6 right-6 h-0.5 bg-gray-100" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute top-6 left-6 h-0.5 transition-all duration-700",
                style: {
                  background: "var(--color-primary)",
                  width: `${order.current_step === 0 ? 0 : order.current_step / 3 * 100}%`,
                  right: "auto"
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative flex justify-between", children: order.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 w-1/4", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                                                            ${step.done ? "border-transparent text-white" : "border-gray-200 text-gray-300 bg-white"}
                                                            ${step.active ? "ring-4 ring-offset-2" : ""}`,
                    style: {
                      background: step.done ? "var(--color-primary)" : void 0,
                      ["--tw-ring-color"]: "var(--color-primary)"
                    },
                    children: /* @__PURE__ */ jsx(Icon, { size: 20 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `text-[11px] font-bold text-center leading-tight
                                                            ${step.active ? "" : step.done ? "text-gray-600" : "text-gray-300"}`,
                    style: step.active ? { color: "var(--color-primary)" } : {},
                    children: step.label
                  }
                )
              ] }, step.key);
            }) })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4", children: [
            /* @__PURE__ */ jsx(IconX, { size: 22, className: "text-red-500 shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-red-600 text-[14px]", children: "Order Cancelled" }),
              /* @__PURE__ */ jsx("p", { className: "text-red-400 text-[12px] mt-0.5", children: "This order has been cancelled." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] mb-4", style: { color: "var(--color-body-text)" }, children: "Order Items" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: order.items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 py-3 border-b border-gray-50 last:border-0", children: [
            item.image ? /* @__PURE__ */ jsx("img", { src: item.image, className: "w-14 h-14 rounded-xl object-cover bg-gray-50" }) : /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconPackage, { size: 20, className: "text-gray-300" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-[13.5px] text-gray-800 truncate", children: item.name }),
              item.variant_label && /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[11.5px] mt-0.5", children: item.variant_label }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[12px] mt-0.5", children: [
                "Qty: ",
                item.quantity,
                " × ",
                fmt(item.price)
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px]", style: { color: "var(--color-body-text)" }, children: fmt(item.subtotal) })
          ] }, i)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-gray-100 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13px] text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { children: fmt(order.subtotal) })
            ] }),
            order.shipping > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13px] text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Shipping" }),
              /* @__PURE__ */ jsx("span", { children: fmt(order.shipping) })
            ] }),
            order.discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13px] text-green-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "-",
                fmt(order.discount)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-black text-[16px] pt-2 border-t border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { style: { color: "var(--color-body-text)" }, children: "Total" }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: fmt(order.total) })
            ] })
          ] })
        ] }),
        order.history.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] mb-5", style: { color: "var(--color-body-text)" }, children: "Tracking History" }),
          /* @__PURE__ */ jsx("div", { className: "relative space-y-0", children: order.history.map((h, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pb-6 last:pb-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-3 h-3 rounded-full mt-1 shrink-0",
                  style: { background: i === 0 ? "var(--color-primary)" : "#D1D5DB" }
                }
              ),
              i < order.history.length - 1 && /* @__PURE__ */ jsx("div", { className: "w-px flex-1 bg-gray-100 mt-1" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pb-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[13.5px] capitalize", style: { color: "var(--color-body-text)" }, children: h.status }),
              h.note && /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[12.5px] mt-0.5", children: h.note }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[11.5px] mt-1", children: [
                h.date,
                " · ",
                h.created_by
              ] })
            ] })
          ] }, i)) })
        ] })
      ] }),
      !order && !flashError && /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-gray-400 text-[13.5px]", children: [
        /* @__PURE__ */ jsx(IconReceipt, { size: 40, className: "mx-auto mb-3 text-gray-200" }),
        /* @__PURE__ */ jsx("p", { children: "Your tracking number is in your order confirmation email or SMS." })
      ] })
    ] }) })
  ] });
}
export {
  TrackOrder as default
};
