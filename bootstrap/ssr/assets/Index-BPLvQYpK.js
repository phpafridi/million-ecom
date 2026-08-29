import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, u as usePage, a as useForm, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconChevronUp, IconChevronDown, IconAlertTriangle, IconCheck, IconExternalLink } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-ClODoR4t.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const REGION_ICONS = {
  "Pakistan": "🇵🇰",
  "International": "🌍",
  "India / International": "🇮🇳",
  "Africa / International": "🌍",
  "US / International": "🇺🇸",
  "Middle East / Africa": "🌍",
  "Any": "✅"
};
const STATUS_INFO = {
  "sandbox_available": { label: "Sandbox + Live", color: "text-green-600 bg-green-50 border-green-200" },
  "live_only": { label: "Live Only", color: "text-amber-600 bg-amber-50 border-amber-200" },
  "webhook_required": { label: "Webhook Needed", color: "text-blue-600  bg-blue-50  border-blue-200" },
  "always_works": { label: "No Setup Needed", color: "text-green-600 bg-green-50 border-green-200" }
};
function GatewayCard({ gw }) {
  var _a, _b, _c, _d, _e;
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const credFields = ((_a = gw.config) == null ? void 0 : _a.credential_fields) ?? [];
  const status = ((_b = gw.config) == null ? void 0 : _b.status) ?? "sandbox_available";
  const statusInfo = STATUS_INFO[status] ?? STATUS_INFO["sandbox_available"];
  const docs = ((_c = gw.config) == null ? void 0 : _c.docs) ?? "";
  const note = ((_d = gw.config) == null ? void 0 : _d.note) ?? "";
  const isAlwaysOn = status === "always_works";
  const [expanded, setExpanded] = useState(isAlwaysOn);
  const { data, setData, put, processing } = useForm({
    is_enabled: gw.is_enabled,
    is_test_mode: gw.is_test_mode,
    instructions: gw.instructions ?? "",
    credentials: gw.credentials ?? {},
    sort_order: gw.sort_order
  });
  function save(e) {
    e.preventDefault();
    put(`${ap}/payments/${gw.id}`);
  }
  function toggle() {
    router3.patch(`${ap}/payments/${gw.id}/toggle`, {}, { preserveScroll: true });
  }
  function setCred(key, val) {
    setData("credentials", { ...data.credentials, [key]: val });
  }
  return /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-2xl transition-all border-2 ${gw.is_enabled ? "border-[var(--color-primary)]/30 shadow-sm" : "border-gray-100"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 sm:p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "w-11 h-11 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0 bg-gray-50 border border-gray-100", children: REGION_ICONS[gw.region] ?? "💳" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsx("span", { className: "font-manrope font-bold text-[15px] text-gray-900", children: gw.name }),
          /* @__PURE__ */ jsx("span", { className: "text-[10.5px] font-semibold text-gray-400", children: gw.region }),
          gw.is_test_mode && gw.is_enabled && !["cod", "bank_transfer"].includes(gw.code) && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200", children: "TEST MODE" }),
          /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.color}`, children: statusInfo.label })
        ] }),
        gw.is_enabled && gw.instructions && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-500 mt-0.5 truncate max-w-xs", children: gw.instructions })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 flex-shrink-0", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: toggle,
            className: `relative w-12 h-6 rounded-full transition-all border-none cursor-pointer ${gw.is_enabled ? "bg-[var(--color-primary)]" : "bg-gray-200"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${gw.is_enabled ? "left-[26px]" : "left-0.5"}` })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setExpanded(!expanded),
            className: "w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-white cursor-pointer transition-all",
            title: expanded ? "Collapse" : "Configure",
            children: expanded ? /* @__PURE__ */ jsx(IconChevronUp, { size: 14 }) : /* @__PURE__ */ jsx(IconChevronDown, { size: 14 })
          }
        )
      ] })
    ] }),
    expanded && !isAlwaysOn && /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "border-t border-gray-100 p-5 space-y-4", children: [
      note && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[12.5px] text-blue-800", children: [
        /* @__PURE__ */ jsx(IconAlertTriangle, { size: 15, className: "flex-shrink-0 mt-0.5 text-blue-500" }),
        /* @__PURE__ */ jsx("span", { children: note })
      ] }),
      status === "sandbox_available" && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3.5 bg-gray-50 rounded-xl", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-800", children: data.is_test_mode ? "🧪 Test / Sandbox Mode" : "✅ Live / Production Mode" }),
          /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-500 mt-0.5", children: data.is_test_mode ? "Using sandbox — no real money charged" : "Real payments will be processed" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("is_test_mode", !data.is_test_mode),
            className: `relative w-11 h-6 rounded-full border-none cursor-pointer transition-all ${data.is_test_mode ? "bg-amber-400" : "bg-green-500"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.is_test_mode ? "left-0.5" : "left-[22px]"}` })
          }
        )
      ] }),
      status === "live_only" && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-800", children: [
        "⚠️ ",
        /* @__PURE__ */ jsx("strong", { children: gw.name }),
        " only provides live credentials — no sandbox available. Test carefully."
      ] }),
      credFields.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3", children: "API Credentials" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: credFields.map((f) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: f.label }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: f.type ?? "text",
              value: data.credentials[f.key] ?? "",
              onChange: (e) => setCred(f.key, e.target.value),
              placeholder: f.placeholder,
              className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[12.5px] font-mono outline-none focus:border-[var(--color-primary)] transition-colors"
            }
          )
        ] }, f.key)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: [
          "Customer Instructions ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal", children: "(shown at checkout)" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.instructions,
            onChange: (e) => setData("instructions", e.target.value),
            rows: 2,
            placeholder: `e.g. "Pay using ${gw.name} and include your order number."`,
            className: "w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex items-center gap-2 h-10 px-5 font-black text-[12.5px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 15 }),
              " ",
              processing ? "Saving…" : "Save"
            ]
          }
        ),
        docs && /* @__PURE__ */ jsxs(
          "a",
          {
            href: docs,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center gap-1.5 text-[12.5px] font-semibold no-underline hover:underline",
            style: { color: "var(--color-primary)" },
            children: [
              /* @__PURE__ */ jsx(IconExternalLink, { size: 14 }),
              " API Docs"
            ]
          }
        )
      ] })
    ] }),
    isAlwaysOn && expanded && /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "border-t border-gray-100 p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: [
          "Instructions for Customer ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal", children: "(shown at checkout)" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.instructions,
            onChange: (e) => setData("instructions", e.target.value),
            rows: 2,
            placeholder: "e.g. Transfer the exact amount to our account below, then WhatsApp us the receipt.",
            className: "w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none"
          }
        )
      ] }),
      gw.code === "bank_transfer" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3", children: (((_e = gw.config) == null ? void 0 : _e.credential_fields) ?? []).map((f) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: f.label }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: data.credentials[f.key] ?? "",
            onChange: (e) => setCred(f.key, e.target.value),
            placeholder: f.placeholder,
            className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[12.5px] outline-none focus:border-[var(--color-primary)]"
          }
        )
      ] }, f.key)) }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "flex items-center gap-2 h-10 px-5 font-black text-[12.5px] rounded-xl border-none cursor-pointer",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
          children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 15 }),
            " ",
            processing ? "Saving…" : "Save"
          ]
        }
      )
    ] })
  ] });
}
function PaymentsIndex({ gateways }) {
  const enabled = gateways.filter((g) => g.is_enabled).length;
  const regions = [...new Set(gateways.map((g) => g.region))];
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Payment Gateways", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Payments — Admin" }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "mb-5 p-4 rounded-2xl border flex items-start gap-3",
        style: { background: "var(--color-primary)08", borderColor: "var(--color-primary)30" },
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-xl flex-shrink-0", children: "💡" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[13px] text-gray-700", children: [
            /* @__PURE__ */ jsx("strong", { children: "All gateways disabled by default." }),
            " Enable only the ones you have accounts for. COD and Bank Transfer work immediately without any setup. For online gateways, enter your API credentials then test before going live.",
            /* @__PURE__ */ jsxs("span", { className: "ml-2 font-bold", style: { color: "var(--color-primary)" }, children: [
              enabled,
              " of ",
              gateways.length,
              " enabled"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap mb-5", children: Object.entries(STATUS_INFO).map(([k, v]) => /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${v.color}`, children: v.label }, k)) }),
    regions.map((region) => /* @__PURE__ */ jsxs("div", { className: "mb-7", children: [
      /* @__PURE__ */ jsxs("h3", { className: "flex items-center gap-2 font-manrope font-bold text-[14px] text-gray-500 uppercase tracking-wider mb-3", children: [
        /* @__PURE__ */ jsx("span", { children: REGION_ICONS[region] ?? "💳" }),
        " ",
        region
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: gateways.filter((g) => g.region === region).map((gw) => /* @__PURE__ */ jsx(GatewayCard, { gw }, gw.id)) })
    ] }, region)),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-[14px] text-gray-700 mb-3", children: "📋 Integration Status" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px] text-gray-600", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-green-600", children: "✅ Fully Working (no code needed):" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Cash on Delivery, Bank Transfer" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-blue-600", children: "🔧 Ready for your API keys:" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Stripe, PayPal, JazzCash, Easypaisa, Safepay, Razorpay, Paystack, Flutterwave, Square, Paymob, 2Checkout, PayFast PK, NayaPay" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsx("strong", { className: "text-amber-600", children: "⚠️ To activate online payments:" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Enter API credentials above → enable the gateway → test with a small order → switch Test Mode off to go live. Each gateway has a link to its official docs." })
        ] })
      ] })
    ] })
  ] });
}
export {
  PaymentsIndex as default
};
