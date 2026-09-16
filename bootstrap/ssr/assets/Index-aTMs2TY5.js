import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { IconPhone, IconBrandWhatsapp, IconExternalLink, IconMessage, IconSettings, IconBell, IconCheck } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
function WhatsAppSettings({ settings, stats }) {
  var _a;
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
    // Basic
    whatsapp_number: settings.whatsapp_number ?? "",
    whatsapp_business_name: settings.whatsapp_business_name ?? "",
    show_whatsapp_button: settings.show_whatsapp_button ?? "1",
    whatsapp_button_position: settings.whatsapp_button_position ?? "bottom_right",
    // Chat Widget
    whatsapp_greeting: settings.whatsapp_greeting ?? "Hi! Welcome to MILLIONAIRE. How can we help you?",
    whatsapp_away_message: settings.whatsapp_away_message ?? "We are currently away. We will reply within 24 hours.",
    whatsapp_response_time: settings.whatsapp_response_time ?? "Typically replies within 1 hour",
    // Business Hours
    whatsapp_hours_enabled: settings.whatsapp_hours_enabled ?? "0",
    whatsapp_hours_open: settings.whatsapp_hours_open ?? "09:00",
    whatsapp_hours_close: settings.whatsapp_hours_close ?? "22:00",
    whatsapp_hours_days: settings.whatsapp_hours_days ?? "Mon-Sat",
    // Order Notifications
    whatsapp_order_notify: settings.whatsapp_order_notify ?? "0",
    whatsapp_order_template: settings.whatsapp_order_template ?? "Hi {name}, your order #{order_id} has been placed successfully! Total: Rs {total}. We will process it shortly. - MILLIONAIRE",
    whatsapp_ship_template: settings.whatsapp_ship_template ?? "Hi {name}, great news! Your order #{order_id} has been shipped. Track it here: {tracking_url} - MILLIONAIRE",
    whatsapp_deliver_template: settings.whatsapp_deliver_template ?? "Hi {name}, your order #{order_id} has been delivered! We hope you love your MILLIONAIRE purchase. - MILLIONAIRE",
    // Product Page
    product_contact_method: settings.product_contact_method ?? "whatsapp",
    whatsapp_product_msg: settings.whatsapp_product_msg ?? "Hi! I am interested in: {product_name} (Rs {price}). Can you provide more details?",
    // API (optional — for automated messages)
    whatsapp_api_key: settings.whatsapp_api_key ?? "",
    whatsapp_phone_id: settings.whatsapp_phone_id ?? ""
  });
  function save(e) {
    e.preventDefault();
    post(`${ap}/settings`);
  }
  const inputCls = "w-full h-10 px-3.5 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none focus:ring-2 focus:border-transparent bg-white";
  const textareaCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none focus:ring-2 focus:border-transparent bg-white resize-none";
  const labelCls = "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";
  const waLink = data.whatsapp_number ? `https://wa.me/${data.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(data.whatsapp_greeting)}` : "#";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "WhatsApp Integration", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "WhatsApp Integration" }),
    /* @__PURE__ */ jsx("form", { onSubmit: save, children: /* @__PURE__ */ jsxs("div", { className: "space-y-5 max-w-3xl", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: [
        { label: "WhatsApp Number", value: data.whatsapp_number || "Not set", icon: "📱" },
        { label: "Orders Today", value: stats.orders_today, icon: "🛍️" },
        { label: "Button Status", value: data.show_whatsapp_button === "1" ? "✅ Active" : "❌ Hidden", icon: "💬" }
      ].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: s.icon }),
        /* @__PURE__ */ jsx("p", { className: "font-black text-[16px] text-gray-800", children: s.value }),
        /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mt-0.5", children: s.label })
      ] }, s.label)) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconPhone, { size: 18, className: "text-green-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Basic Setup" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Your WhatsApp business number and display settings" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "WhatsApp Number *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: inputCls,
                value: data.whatsapp_number,
                onChange: (e) => setData("whatsapp_number", e.target.value),
                placeholder: "923001234567 (with country code, no +)"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Include country code. No spaces, dashes or +" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Business Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: inputCls,
                value: data.whatsapp_business_name,
                onChange: (e) => setData("whatsapp_business_name", e.target.value),
                placeholder: "MILLIONAIRE"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Button Position" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: inputCls,
                value: data.whatsapp_button_position,
                onChange: (e) => setData("whatsapp_button_position", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "bottom_right", children: "Bottom Right" }),
                  /* @__PURE__ */ jsx("option", { value: "bottom_left", children: "Bottom Left" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Show WhatsApp Button" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: inputCls,
                value: data.show_whatsapp_button,
                onChange: (e) => setData("show_whatsapp_button", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "1", children: "✅ Show on all pages" }),
                  /* @__PURE__ */ jsx("option", { value: "0", children: "❌ Hide" })
                ]
              }
            )
          ] })
        ] }),
        data.whatsapp_number && /* @__PURE__ */ jsxs(
          "a",
          {
            href: waLink,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 mt-4 text-[12.5px] font-bold text-white bg-[#25D366] px-4 py-2 rounded-xl no-underline hover:opacity-90 transition-opacity",
            children: [
              /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 15 }),
              " Test This Number",
              /* @__PURE__ */ jsx(IconExternalLink, { size: 12 })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconMessage, { size: 18, className: "text-blue-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Chat Messages" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "What customers see when they click WhatsApp" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Greeting Message" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: textareaCls,
                rows: 2,
                value: data.whatsapp_greeting,
                onChange: (e) => setData("whatsapp_greeting", e.target.value),
                placeholder: "Hi! Welcome to MILLIONAIRE. How can we help?"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "This pre-fills the WhatsApp message box" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Response Time Label" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: inputCls,
                value: data.whatsapp_response_time,
                onChange: (e) => setData("whatsapp_response_time", e.target.value),
                placeholder: "Typically replies within 1 hour"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconSettings, { size: 18, className: "text-amber-600" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Business Hours" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Show away message outside working hours" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.whatsapp_hours_enabled === "1",
                onChange: (e) => setData("whatsapp_hours_enabled", e.target.checked ? "1" : "0"),
                className: "w-4 h-4 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Enable" })
          ] })
        ] }),
        data.whatsapp_hours_enabled === "1" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Working Days" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: inputCls,
                value: data.whatsapp_hours_days,
                onChange: (e) => setData("whatsapp_hours_days", e.target.value),
                placeholder: "Mon-Sat"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Open Time" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "time",
                className: inputCls,
                value: data.whatsapp_hours_open,
                onChange: (e) => setData("whatsapp_hours_open", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Close Time" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "time",
                className: inputCls,
                value: data.whatsapp_hours_close,
                onChange: (e) => setData("whatsapp_hours_close", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "col-span-3", children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Away Message" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: textareaCls,
                rows: 2,
                value: data.whatsapp_away_message,
                onChange: (e) => setData("whatsapp_away_message", e.target.value)
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconBell, { size: 18, className: "text-purple-600" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Order Notification Templates" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Messages sent to customers for order updates" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.whatsapp_order_notify === "1",
                onChange: (e) => setData("whatsapp_order_notify", e.target.checked ? "1" : "0"),
                className: "w-4 h-4 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Enable" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-3 mb-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] font-bold text-gray-500 mb-2", children: "Available Variables:" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: ["{name}", "{order_id}", "{total}", "{tracking_url}", "{status}", "{items}"].map((v) => /* @__PURE__ */ jsx("code", { className: "text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-lg font-mono text-gray-600", children: v }, v)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "📦 Order Placed Template" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: textareaCls,
                rows: 3,
                value: data.whatsapp_order_template,
                onChange: (e) => setData("whatsapp_order_template", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "🚚 Order Shipped Template" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: textareaCls,
                rows: 3,
                value: data.whatsapp_ship_template,
                onChange: (e) => setData("whatsapp_ship_template", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "✅ Order Delivered Template" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: textareaCls,
                rows: 3,
                value: data.whatsapp_deliver_template,
                onChange: (e) => setData("whatsapp_deliver_template", e.target.value)
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 18, className: "text-green-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Product Page Message" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Pre-filled message when customer clicks WhatsApp on product page" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelCls, children: "Product Inquiry Template" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              className: textareaCls,
              rows: 3,
              value: data.whatsapp_product_msg,
              onChange: (e) => setData("whatsapp_product_msg", e.target.value)
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400 mt-1", children: [
            "Use ",
            "{product_name}",
            " and ",
            "{price}",
            " as variables"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(IconSettings, { size: 18, className: "text-gray-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-[15px] text-gray-800", children: [
              "WhatsApp Business API ",
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-normal text-gray-400 ml-2", children: "(Optional — for automated messages)" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Required only for sending automated order notifications" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4", children: /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-amber-700", children: "💡 Without API keys — customers click WhatsApp button and manually send message. With API keys — automated order notifications are sent automatically." }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "API Key (from Meta Developer Portal)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                className: inputCls,
                value: data.whatsapp_api_key,
                onChange: (e) => setData("whatsapp_api_key", e.target.value),
                placeholder: "EAAxxxxxx..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Phone Number ID" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: inputCls,
                value: data.whatsapp_phone_id,
                onChange: (e) => setData("whatsapp_phone_id", e.target.value),
                placeholder: "1234567890"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://developers.facebook.com/apps",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-blue-600 no-underline hover:underline",
            children: [
              /* @__PURE__ */ jsx(IconExternalLink, { size: 13 }),
              " Get API keys from Meta Business Suite →"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex items-center gap-2 h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none transition-all hover:opacity-90",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: processing ? "Saving..." : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 16 }),
              " Save WhatsApp Settings"
            ] })
          }
        ),
        ((_a = props.flash) == null ? void 0 : _a.success) && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[13px] font-semibold text-green-600", children: [
          /* @__PURE__ */ jsx(IconCheck, { size: 15 }),
          " ",
          props.flash.success
        ] })
      ] })
    ] }) })
  ] });
}
export {
  WhatsAppSettings as default
};
