import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { useState } from "react";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-Dg6pcwSH.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-colors bg-white";
function Field({ label, hint, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: label }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mb-1.5", children: hint }),
    children
  ] });
}
function Section({ title, icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
    /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[16px] text-gray-900 pb-4 border-b border-gray-100 mb-5 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { children: icon }),
      " ",
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
  ] });
}
function ImageUploadField({ label, current, onFile }) {
  const [preview, setPreview] = useState(current ?? null);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-2", children: label }),
    preview && /* @__PURE__ */ jsx("div", { className: "mb-2 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: preview, className: "max-h-full max-w-full object-contain", alt: "" }) }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-3 cursor-pointer transition-colors", children: [
      /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
        var _a;
        const f = (_a = e.target.files) == null ? void 0 : _a[0];
        if (f) {
          setPreview(URL.createObjectURL(f));
          onFile(f);
        }
      } }),
      /* @__PURE__ */ jsx(IconUpload, { size: 16, className: "text-[var(--color-primary,#00c8ff)]" }),
      /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500", children: "Click to upload image" })
    ] })
  ] });
}
function Branding({ settings }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
    logo: null,
    header_title_color: settings.header_title_color ?? "",
    header_subtitle_color: settings.header_subtitle_color ?? "",
    // Independent of header_text — that variable is shared with the
    // site title elsewhere, so tying the search box to it meant it
    // couldn't be a different color without also changing the title.
    search_text_color: settings.search_text_color ?? "",
    // Floating button controls — independent enable/position/size for
    // Chat, Cart, and WhatsApp. Previously WhatsApp was hardcoded to
    // the exact same corner as Chat with no way to change either,
    // which is why it ended up hidden behind the chat bubble.
    chat_float_enabled: settings.chat_float_enabled ?? "1",
    chat_float_position: settings.chat_float_position ?? "right",
    chat_float_size: settings.chat_float_size ?? "md",
    cart_float_enabled: settings.cart_float_enabled ?? "1",
    cart_float_position: settings.cart_float_position ?? "right",
    cart_float_size: settings.cart_float_size ?? "md",
    whatsapp_float_enabled: settings.whatsapp_float_enabled ?? "0",
    whatsapp_float_position: settings.whatsapp_float_position ?? "right",
    whatsapp_float_size: settings.whatsapp_float_size ?? "md",
    ticker_items: settings.ticker_items ?? "",
    trust_1_icon: settings.trust_1_icon ?? "🚚",
    trust_1_title: settings.trust_1_title ?? "Free Delivery",
    trust_1_sub: settings.trust_1_sub ?? "On qualifying orders",
    trust_2_icon: settings.trust_2_icon ?? "🛡️",
    trust_2_title: settings.trust_2_title ?? "100% Genuine",
    trust_2_sub: settings.trust_2_sub ?? "Verified products only",
    trust_3_icon: settings.trust_3_icon ?? "↩️",
    trust_3_title: settings.trust_3_title ?? "Easy Returns",
    trust_3_sub: settings.trust_3_sub ?? "7-day hassle-free",
    trust_4_icon: settings.trust_4_icon ?? "🎧",
    trust_4_title: settings.trust_4_title ?? "24/7 Support",
    trust_4_sub: settings.trust_4_sub ?? "We are here to help",
    trust_5_icon: settings.trust_5_icon ?? "💬",
    trust_5_title: settings.trust_5_title ?? "WhatsApp Us",
    trust_5_sub: settings.trust_5_sub ?? "Quick response",
    trust_bar_bg: settings.trust_bar_bg ?? "#0a0e1a",
    trust_icon_color: settings.trust_icon_color ?? "#00c8ff",
    trust_title_color: settings.trust_title_color ?? "#ffffff",
    trust_sub_color: settings.trust_sub_color ?? "#6b8aaa",
    ticker_bg: settings.ticker_bg ?? "#ffffff",
    ticker_live_bg: settings.ticker_live_bg ?? "#00c8ff",
    ticker_live_text: settings.ticker_live_text ?? "#0a0e1a",
    ticker_text_color: settings.ticker_text_color ?? "#6b7280",
    brands_show: settings.brands_show ?? "1",
    brands_title: settings.brands_title ?? "Top Brands",
    brands_subtitle: settings.brands_subtitle ?? "Official Partners",
    brands_items: settings.brands_items ?? "Apple|Samsung|Sony|Dell|LG|ASUS"
    // These 9 theme fields were missing from Settings.tsx's initial
    // form data entirely — meaning the color pickers never actually
    // reflected a previously-saved value on page load, only the
    // hardcoded fallback, and would silently not even submit unless
    // the admin happened to touch that specific picker. Fixed here by
    // properly initializing from the saved setting, same as every
    // other field on this page.
    // Theme colors (primary/accent/dark bg/etc.) deliberately NOT
    // included here — there's already a dedicated, more complete Theme
    // page (presets, header/nav/topbar text colors, live preview).
    // Including them here too would recreate the exact kind of
    // duplication this whole reorganization is meant to fix.
  });
  function save(e) {
    e.preventDefault();
    post(`${ap}/settings`, { forceFormData: true });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Branding", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Branding — Admin" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs(Section, { title: "Store Logo", icon: "🖼️", children: [
          /* @__PURE__ */ jsx(ImageUploadField, { label: "Logo (landscape, up to 400×120px — transparent PNG, padding auto-trimmed)", current: settings.logo_url, onFile: (f) => setData("logo", f) }),
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700", children: "The logo box has no background — it sits directly on your header color. Use a transparent PNG so it looks correct on any header color you choose below." }),
          settings.logo_url && /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-gray-500 mb-2", children: "Header preview (on your current navbar color)" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-16 h-16 rounded-xl flex items-center justify-center p-2 border border-gray-200",
                style: { background: "var(--color-header-bg,#ffffff)" },
                children: /* @__PURE__ */ jsx("img", { src: settings.logo_url, alt: "logo preview", className: "w-full h-full object-contain" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 mt-2 border-t border-gray-100", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-700 mb-3", children: "Site Title Colors (next to logo)" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              ["header_title_color", "Title Color"],
              ["header_subtitle_color", "Subtitle / Tagline Color"],
              ["search_text_color", "Search Box Text Color"]
            ].map(([key, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11.5px] font-semibold text-gray-500 mb-1.5", children: label }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data[key] || "#0a0a0a",
                    onChange: (e) => setData(key, e.target.value),
                    className: "w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: data[key] || "",
                    onChange: (e) => setData(key, e.target.value),
                    className: "flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]",
                    placeholder: "Leave blank to use theme default"
                  }
                )
              ] })
            ] }, key)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Floating Buttons", icon: "🎯", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 -mt-1", children: "Chat, Cart, and WhatsApp buttons that float over the storefront. Each can be shown/hidden, moved to either bottom corner, and resized independently — buttons sharing a corner stack automatically without overlapping." }),
          [
            ["chat", "Chat Widget"],
            ["cart", "Floating Cart"],
            ["whatsapp", "WhatsApp Button"]
          ].map(([key, label]) => /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-gray-50 rounded-xl space-y-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-800", children: label }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setData(`${key}_float_enabled`, data[`${key}_float_enabled`] === "1" ? "0" : "1"),
                  className: `w-11 h-6 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data[`${key}_float_enabled`] === "1" ? "bg-[var(--color-primary,#00c8ff)]" : "bg-gray-300"}`,
                  children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", style: { left: data[`${key}_float_enabled`] === "1" ? 22 : 2 } })
                }
              )
            ] }),
            data[`${key}_float_enabled`] === "1" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide mb-1", children: "Corner" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full h-9 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white",
                    value: data[`${key}_float_position`],
                    onChange: (e) => setData(`${key}_float_position`, e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "right", children: "Bottom Right" }),
                      /* @__PURE__ */ jsx("option", { value: "left", children: "Bottom Left" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[10.5px] font-semibold text-gray-400 uppercase tracking-wide mb-1", children: "Size" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full h-9 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white",
                    value: data[`${key}_float_size`],
                    onChange: (e) => setData(`${key}_float_size`, e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "sm", children: "Small" }),
                      /* @__PURE__ */ jsx("option", { value: "md", children: "Medium" }),
                      /* @__PURE__ */ jsx("option", { value: "lg", children: "Large" })
                    ]
                  }
                )
              ] })
            ] })
          ] }, key))
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Trust Bar & Ticker", icon: "🛡️", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500", children: "5 badges shown under the header. Set icon (emoji), title and sub-text for each badge." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[48px_1fr_1.4fr] gap-2 items-center p-3 bg-gray-50 rounded-xl", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data[`trust_${n}_icon`] ?? "",
                onChange: (e) => setData(`trust_${n}_icon`, e.target.value),
                className: "h-10 text-center text-xl border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white",
                placeholder: "🚚"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data[`trust_${n}_title`] ?? "",
                onChange: (e) => setData(`trust_${n}_title`, e.target.value),
                className: inputCls,
                placeholder: "Title e.g. Free Delivery"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data[`trust_${n}_sub`] ?? "",
                onChange: (e) => setData(`trust_${n}_sub`, e.target.value),
                className: inputCls,
                placeholder: "e.g. Orders over Rs 5,000"
              }
            )
          ] }, n)) }),
          /* @__PURE__ */ jsx(Field, { label: "Scrolling Ticker Text", hint: "Separate each item with a | pipe character", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.ticker_items, onChange: (e) => setData("ticker_items", e.target.value), placeholder: "Free shipping Rs 5000+|7-day returns|Verified products|24/7 support" }) }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-100", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-700 mb-3", children: "Trust Bar Colors" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              ["trust_bar_bg", "Bar Background"],
              ["trust_icon_color", "Icon Accent Color"],
              ["trust_title_color", "Title Text Color"],
              ["trust_sub_color", "Sub Text Color"]
            ].map(([key, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11.5px] font-semibold text-gray-500 mb-1.5", children: label }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data[key] || "#000000",
                    onChange: (e) => setData(key, e.target.value),
                    className: "w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: data[key] || "",
                    onChange: (e) => setData(key, e.target.value),
                    className: "flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]",
                    placeholder: "#000000"
                  }
                )
              ] })
            ] }, key)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-gray-100", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-700 mb-3", children: "Ticker Bar Colors" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              ["ticker_bg", "Ticker Background"],
              ["ticker_live_bg", '"LIVE" Badge Color'],
              ["ticker_live_text", '"LIVE" Text Color'],
              ["ticker_text_color", "Ticker Text Color"]
            ].map(([key, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11.5px] font-semibold text-gray-500 mb-1.5", children: label }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data[key] || "#000000",
                    onChange: (e) => setData(key, e.target.value),
                    className: "w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: data[key] || "",
                    onChange: (e) => setData(key, e.target.value),
                    className: "flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]",
                    placeholder: "#000000"
                  }
                )
              ] })
            ] }, key)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Brands Bar", icon: "🏷️", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 pb-4 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13.5px] font-semibold text-gray-800", children: "Show Brands Section" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-400", children: "Display on homepage" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData("brands_show", data.brands_show === "1" ? "0" : "1"),
                className: `relative w-12 h-6 rounded-full border-none cursor-pointer transition-all ${data.brands_show === "1" ? "bg-[var(--color-primary)]" : "bg-gray-200"}`,
                children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.brands_show === "1" ? "left-[26px]" : "left-0.5"}` })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Section Title", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.brands_title, onChange: (e) => setData("brands_title", e.target.value), placeholder: "Top Brands" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Eyebrow Text", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.brands_subtitle, onChange: (e) => setData("brands_subtitle", e.target.value), placeholder: "Official Partners" }) })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Brand Names", hint: "Separate with | pipe character. e.g. Apple|Samsung|Sony|Dell", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.brands_items, onChange: (e) => setData("brands_items", e.target.value), placeholder: "Apple|Samsung|Sony|Dell|LG|ASUS" }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-gray-50 border border-gray-100 rounded-xl text-[12px] text-gray-500", children: [
            "Preview: ",
            (data.brands_items || "").split("|").filter(Boolean).map((b) => b.trim()).join(" · ")
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full h-14 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-3 transition-all hover:opacity-90",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 20 }),
              processing ? "Saving…" : "Save Branding"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("a", { href: `${ap}/theme`, className: "block bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white no-underline hover:opacity-90 transition-opacity", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[13px] font-bold flex items-center gap-2", children: "🎨 Looking for theme colors?" }),
          /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-300 mt-1", children: "Primary/accent colors, dark backgrounds, presets, and border radius live on the dedicated Theme page →" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[14px] text-gray-800 mb-4", children: "📐 Image Size Reference" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 text-[12.5px]", children: [
            { label: "Logo", size: "400×120px", hint: "Landscape icon+wordmark, transparent — padding auto-trimmed" },
            { label: "Hero Slide", size: "1920×1080px", hint: "Full-width slider, subject centered" },
            { label: "Full Banner", size: "1920×520px", hint: "Homepage wide banner, subject centered" },
            { label: "Category Image", size: "900×1080px", hint: "Nearly square, subject centered (square on desktop, 3:4 on mobile)" },
            { label: "Category Banner", size: "1920×380px", hint: "Category page header" },
            { label: "Product Image", size: "800×1067px", hint: "Portrait 3:4, white background" }
          ].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 13, className: "flex-shrink-0 mt-0.5", style: { color: "var(--color-primary)" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-gray-700", children: [
                s.label,
                ":"
              ] }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: s.size }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: s.hint })
            ] })
          ] }, s.label)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Branding as default
};
