import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import { IconExternalLink, IconBrandGoogle, IconCheck } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function AnalyticsPage({ settings, ga_data }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const flash = props.flash;
  const { data, setData, post, processing } = useForm({
    ga_measurement_id: settings.ga_measurement_id ?? "",
    ga_enabled: settings.ga_enabled ?? "0",
    ga_api_secret: settings.ga_api_secret ?? "",
    gtm_id: settings.gtm_id ?? "",
    gtm_enabled: settings.gtm_enabled ?? "0",
    fb_pixel_id: settings.fb_pixel_id ?? "",
    fb_pixel_enabled: settings.fb_pixel_enabled ?? "0",
    tiktok_pixel_id: settings.tiktok_pixel_id ?? "",
    tiktok_pixel_enabled: settings.tiktok_pixel_enabled ?? "0"
  });
  const isEnabled = data.ga_enabled === "1";
  const hasMeasId = data.ga_measurement_id.startsWith("G-");
  const inputCls = "w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] font-mono focus:outline-none focus:ring-2 focus:border-transparent bg-white";
  const labelCls = "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";
  function save(e) {
    e.preventDefault();
    post(`${ap}/settings`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Analytics & Tracking", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Analytics & Tracking" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "space-y-5 max-w-4xl", children: [
      isEnabled && hasMeasId && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] text-gray-800", children: "📊 Live Stats — Today" }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: `https://analytics.google.com/analytics/web/#/p${data.ga_measurement_id.replace("G-", "")}/reports/reportinghub`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-1.5 text-[12.5px] font-bold no-underline",
              style: { color: "var(--color-primary)" },
              children: [
                "Open GA4 ",
                /* @__PURE__ */ jsx(IconExternalLink, { size: 13 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5", children: [
          { icon: "👥", label: "Active Users", value: (ga_data == null ? void 0 : ga_data.active_users) ?? "—", color: "#3B82F6" },
          { icon: "👁️", label: "Page Views Today", value: (ga_data == null ? void 0 : ga_data.page_views_today) ?? "—", color: "#10B981" },
          { icon: "🔗", label: "Sessions Today", value: (ga_data == null ? void 0 : ga_data.sessions_today) ?? "—", color: "#F59E0B" },
          { icon: "↩️", label: "Bounce Rate", value: (ga_data == null ? void 0 : ga_data.bounce_rate) ?? "—", color: "#EF4444" }
        ].map((m) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-2xl p-4 border border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl mb-2", children: m.icon }),
          /* @__PURE__ */ jsx("p", { className: "font-black text-[22px]", style: { color: m.color }, children: m.value }),
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mt-0.5", children: m.label })
        ] }, m.label)) }),
        (ga_data == null ? void 0 : ga_data.top_pages) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-black text-[13px] text-gray-700 mb-3", children: "Top Pages" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ga_data.top_pages.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[12.5px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 truncate max-w-[180px]", children: p.path }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800 ml-2", children: p.views })
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-black text-[13px] text-gray-700 mb-3", children: "Traffic Sources" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ga_data.traffic_sources.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[12.5px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 capitalize", children: s.source }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800", children: s.sessions })
            ] }, i)) })
          ] })
        ] }),
        !ga_data && /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-4 text-[13px] text-blue-700", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold mb-1", children: "📡 Connect GA4 Data API for live stats" }),
          /* @__PURE__ */ jsx("p", { children: "Add your API Secret below to see real-time data here. Otherwise, visit Google Analytics directly." }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://analytics.google.com",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-1 mt-2 font-bold text-blue-600 no-underline",
              children: [
                "Open Google Analytics ",
                /* @__PURE__ */ jsx(IconExternalLink, { size: 12 })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center", style: { background: "#F59E0B15" }, children: /* @__PURE__ */ jsx(IconBrandGoogle, { size: 20, className: "text-amber-500" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Google Analytics 4" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Track visitors, page views, conversions" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.ga_enabled === "1",
                onChange: (e) => setData("ga_enabled", e.target.checked ? "1" : "0"),
                className: "w-4 h-4 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Enable" })
          ] })
        ] }),
        data.ga_enabled === "1" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "Measurement ID *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: inputCls,
                value: data.ga_measurement_id,
                onChange: (e) => setData("ga_measurement_id", e.target.value),
                placeholder: "G-XXXXXXXXXX"
              }
            ),
            data.ga_measurement_id && !data.ga_measurement_id.startsWith("G-") && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-[11.5px] mt-1", children: "⚠ Measurement ID must start with G-" }),
            hasMeasId && /* @__PURE__ */ jsx("p", { className: "text-green-600 text-[11.5px] mt-1", children: "✅ Format looks correct" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-gray-400 mt-1", children: [
              "Get from: ",
              /* @__PURE__ */ jsx("a", { href: "https://analytics.google.com", target: "_blank", rel: "noopener noreferrer", className: "text-blue-500", children: "analytics.google.com" }),
              " → Admin → Data Streams → Web → Measurement ID"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: labelCls, children: "API Secret (optional — for live stats in this panel)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                className: inputCls,
                value: data.ga_api_secret,
                onChange: (e) => setData("ga_api_secret", e.target.value),
                placeholder: "Leave blank if you don't need live stats here"
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mt-1", children: "Get from: GA4 → Admin → Data Streams → Measurement Protocol → Create" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold mb-1", children: "📋 Setup Steps:" }),
          /* @__PURE__ */ jsxs("ol", { className: "space-y-1 list-decimal list-inside", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              "Go to ",
              /* @__PURE__ */ jsx("a", { href: "https://analytics.google.com", target: "_blank", className: "underline", children: "analytics.google.com" }),
              " → Create Account → Create Property"
            ] }),
            /* @__PURE__ */ jsx("li", { children: 'Select "Web" as platform, enter your domain' }),
            /* @__PURE__ */ jsx("li", { children: "Copy the Measurement ID (starts with G-)" }),
            /* @__PURE__ */ jsx("li", { children: "Paste above → Enable → Save Settings" }),
            /* @__PURE__ */ jsx("li", { children: "Wait 24-48 hours for data to appear" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg", children: "🏷️" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Google Tag Manager" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Manage all tracking scripts in one place" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.gtm_enabled === "1",
                onChange: (e) => setData("gtm_enabled", e.target.checked ? "1" : "0"),
                className: "w-4 h-4 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Enable" })
          ] })
        ] }),
        data.gtm_enabled === "1" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelCls, children: "GTM Container ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: inputCls,
              value: data.gtm_id,
              onChange: (e) => setData("gtm_id", e.target.value),
              placeholder: "GTM-XXXXXXX"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mt-1", children: "Get from tagmanager.google.com → Your Container ID" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center text-lg", style: { background: "#1877F215" }, children: /* @__PURE__ */ jsx("span", { style: { color: "#1877F2", fontWeight: 900, fontSize: 14 }, children: "f" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Facebook / Meta Pixel" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Track Facebook & Instagram ad conversions" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.fb_pixel_enabled === "1",
                onChange: (e) => setData("fb_pixel_enabled", e.target.checked ? "1" : "0"),
                className: "w-4 h-4 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Enable" })
          ] })
        ] }),
        data.fb_pixel_enabled === "1" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelCls, children: "Pixel ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: inputCls,
              value: data.fb_pixel_id,
              onChange: (e) => setData("fb_pixel_id", e.target.value),
              placeholder: "1234567890123456"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-gray-400 mt-1", children: [
            "Get from: ",
            /* @__PURE__ */ jsx("a", { href: "https://business.facebook.com/events_manager", target: "_blank", className: "text-blue-500", children: "Meta Events Manager" }),
            " → Pixels → Your Pixel ID"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-lg", children: "♪" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "TikTok Pixel" }),
              /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Track TikTok ad performance and conversions" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.tiktok_pixel_enabled === "1",
                onChange: (e) => setData("tiktok_pixel_enabled", e.target.checked ? "1" : "0"),
                className: "w-4 h-4 rounded"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-600", children: "Enable" })
          ] })
        ] }),
        data.tiktok_pixel_enabled === "1" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: labelCls, children: "TikTok Pixel ID" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: inputCls,
              value: data.tiktok_pixel_id,
              onChange: (e) => setData("tiktok_pixel_id", e.target.value),
              placeholder: "CXXXXXXXXXXXXXXXXX"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-gray-400 mt-1", children: [
            "Get from: ",
            /* @__PURE__ */ jsx("a", { href: "https://ads.tiktok.com/i18n/pixel", target: "_blank", className: "text-blue-500", children: "TikTok Ads Manager" }),
            " → Assets → Events → Web Events"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex items-center gap-2 h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 16 }),
              " ",
              processing ? "Saving..." : "Save Tracking Settings"
            ]
          }
        ),
        (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxs("span", { className: "text-green-600 font-semibold text-[13px] flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(IconCheck, { size: 14 }),
          " ",
          flash.success
        ] })
      ] })
    ] })
  ] });
}
export {
  AnalyticsPage as default
};
