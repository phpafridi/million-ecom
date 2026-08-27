import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { IconSun, IconMoon, IconDeviceDesktop, IconEye, IconCheck, IconRefresh } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const PRESETS = [
  {
    key: "millionaire",
    label: "Millionaire",
    desc: "Gold & Black — default",
    vals: { primary: "#C9A84C", primary_dark: "#b8943f", primary_text: "#0a0a0a", accent: "#C9A84C", dark_bg: "#0a0a0a", dark_bg2: "#050505", body_bg: "#FAFAFA", header_bg: "#ffffff", header_text: "#0a0a0a", header_border: "#e5e7eb", topbar_bg: "#0a0a0a", topbar_text: "rgba(255,255,255,0.7)", nav_bg: "#ffffff", nav_text: "#374151", nav_border: "#e5e7eb" }
  },
  {
    key: "royal",
    label: "Royal Black",
    desc: "White on pure black",
    vals: { primary: "#ffffff", primary_dark: "#e0e0e0", primary_text: "#000000", accent: "#C9A84C", dark_bg: "#000000", dark_bg2: "#0a0a0a", body_bg: "#0f0f0f", header_bg: "#111111", header_text: "#ffffff", header_border: "#222222", topbar_bg: "#000000", topbar_text: "rgba(255,255,255,0.6)", nav_bg: "#1a1a1a", nav_text: "#ffffff", nav_border: "#2a2a2a" }
  },
  {
    key: "sapphire",
    label: "Sapphire",
    desc: "Deep blue luxury",
    vals: { primary: "#3B82F6", primary_dark: "#2563eb", primary_text: "#ffffff", accent: "#f59e0b", dark_bg: "#0f172a", dark_bg2: "#070e1f", body_bg: "#F8FAFC", header_bg: "#ffffff", header_text: "#0f172a", header_border: "#e2e8f0", topbar_bg: "#0f172a", topbar_text: "rgba(255,255,255,0.65)", nav_bg: "#ffffff", nav_text: "#374151", nav_border: "#e2e8f0" }
  },
  {
    key: "emerald",
    label: "Emerald",
    desc: "Forest green premium",
    vals: { primary: "#10b981", primary_dark: "#059669", primary_text: "#ffffff", accent: "#f97316", dark_bg: "#064e3b", dark_bg2: "#022c22", body_bg: "#f0fdf4", header_bg: "#ffffff", header_text: "#064e3b", header_border: "#d1fae5", topbar_bg: "#064e3b", topbar_text: "rgba(255,255,255,0.65)", nav_bg: "#ffffff", nav_text: "#374151", nav_border: "#d1fae5" }
  },
  {
    key: "crimson",
    label: "Crimson",
    desc: "Bold red statement",
    vals: { primary: "#ef4444", primary_dark: "#dc2626", primary_text: "#ffffff", accent: "#3b82f6", dark_bg: "#1f0a0a", dark_bg2: "#0f0505", body_bg: "#fff5f5", header_bg: "#ffffff", header_text: "#1f0a0a", header_border: "#fee2e2", topbar_bg: "#1f0a0a", topbar_text: "rgba(255,255,255,0.65)", nav_bg: "#ffffff", nav_text: "#374151", nav_border: "#fee2e2" }
  },
  { key: "custom", label: "Custom", desc: "Your own colors", vals: {} }
];
const FONTS = ["Inter", "Manrope", "Poppins", "Nunito", "Raleway", "Roboto", "Open Sans", "Lato"];
const CSS_MAP = {
  primary: "--color-primary",
  primary_dark: "--color-primary-dark",
  primary_text: "--color-primary-text",
  accent: "--color-accent",
  dark_bg: "--color-dark-bg",
  dark_bg2: "--color-dark-bg2",
  body_bg: "--color-body-bg",
  header_bg: "--color-header-bg",
  header_text: "--color-header-text",
  header_border: "--color-header-border",
  topbar_bg: "--color-topbar-bg",
  topbar_text: "--color-topbar-text",
  nav_bg: "--color-nav-bg",
  nav_text: "--color-nav-text",
  nav_border: "--color-nav-border"
};
function Swatch({ label, hint, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-gray-600 mb-1", children: label }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-gray-400 mb-1.5", children: hint }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer shadow-sm", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "color",
          value: value.startsWith("rgba") ? "#888888" : value,
          onChange: (e) => onChange(e.target.value),
          className: "absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 cursor-pointer border-none bg-transparent"
        }
      ) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value,
          onChange: (e) => onChange(e.target.value),
          className: "flex-1 h-9 px-3 border border-gray-200 rounded-lg text-[12px] font-mono outline-none focus:border-[var(--color-primary)] transition-colors"
        }
      )
    ] })
  ] });
}
function PreviewPanel({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden border border-gray-200 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 py-1", style: { background: data.topbar_bg }, children: [
      /* @__PURE__ */ jsx("span", { style: { color: data.topbar_text, fontSize: 8, fontWeight: 600 }, children: "+92 300 0000000" }),
      /* @__PURE__ */ jsx("span", { style: { color: data.topbar_text, fontSize: 8, opacity: 0.7 }, children: "Free delivery on orders over Rs 5,000" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2", style: { background: data.header_bg, borderBottom: `1px solid ${data.header_border}` }, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-6 h-6 rounded flex items-center justify-center font-black text-[9px]",
          style: { background: data.dark_bg, color: data.primary },
          children: "M"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: { color: data.header_text, fontSize: 10, fontWeight: 900, letterSpacing: "0.1em" }, children: "MILLIONAIRE" }),
        /* @__PURE__ */ jsx("div", { style: { color: data.primary, fontSize: 7, fontWeight: 700 }, children: "WEAR YOUR STATUS" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-5 px-2 rounded-lg flex items-center justify-center font-bold text-[8px]",
            style: { background: data.primary, color: data.primary_text },
            children: "Search"
          }
        ),
        /* @__PURE__ */ jsx("span", { style: { color: data.header_text, fontSize: 13, opacity: 0.7 }, children: "♡" }),
        /* @__PURE__ */ jsx("span", { style: { color: data.header_text, fontSize: 13, opacity: 0.7 }, children: "🛒" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-1.5", style: { background: data.nav_bg, borderBottom: `2px solid ${data.nav_border}` }, children: [
      ["Home", "Men", "Women", "Shoes"].map((l, i) => /* @__PURE__ */ jsx("span", { style: { fontSize: 8, fontWeight: 700, paddingBottom: 2, color: i === 1 ? data.primary : data.nav_text || "#374151", borderBottom: i === 1 ? `2px solid ${data.primary}` : "2px solid transparent" }, children: l }, l)),
      /* @__PURE__ */ jsx("span", { className: "ml-auto text-[7px] font-bold px-2 py-0.5 rounded border", style: { color: data.primary, borderColor: data.primary }, children: "Expert Help" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative h-16 flex items-center", style: { background: data.dark_bg }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: `linear-gradient(100deg, ${data.dark_bg} 0%, transparent 80%)` } }),
      /* @__PURE__ */ jsxs("div", { className: "relative px-3", children: [
        /* @__PURE__ */ jsx("div", { style: { color: "#fff", fontSize: 11, fontWeight: 900, marginBottom: 4 }, children: "Signature Fragrance" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[8px]",
            style: { background: data.primary, color: data.primary_text },
            children: "Discover →"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-2 grid grid-cols-2 gap-1.5", style: { background: data.body_bg }, children: [1, 2].map((i) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg overflow-hidden border border-gray-100", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10", style: { background: `linear-gradient(135deg,${data.primary}22,${data.dark_bg}11)` } }),
      /* @__PURE__ */ jsxs("div", { className: "p-1.5", children: [
        /* @__PURE__ */ jsx("div", { style: { color: data.primary, fontSize: 7, fontWeight: 700, marginBottom: 2 }, children: "CATEGORY" }),
        /* @__PURE__ */ jsx("div", { style: { color: data.dark_bg, fontSize: 8, fontWeight: 900, marginBottom: 4 }, children: "Product Name" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-4 rounded flex items-center justify-center font-bold",
            style: { background: data.dark_bg, color: "#fff", fontSize: 7 },
            children: "Add to Cart"
          }
        )
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "py-1.5 px-3 flex items-center justify-between", style: { background: data.dark_bg2 || data.dark_bg }, children: [
      /* @__PURE__ */ jsx("span", { style: { color: data.primary, fontSize: 8, fontWeight: 700 }, children: "MILLIONAIRE." }),
      /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: 7 }, children: "© 2026" })
    ] })
  ] });
}
function ThemeIndex({ theme }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({ ...theme });
  function applyCSS(field, val) {
    const css = CSS_MAP[field];
    if (css) document.documentElement.style.setProperty(css, val);
  }
  function applyPreset(key) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!(preset == null ? void 0 : preset.vals) || Object.keys(preset.vals).length === 0) {
      setData("preset", "custom");
      return;
    }
    const newData = { ...data, preset: key, ...preset.vals };
    Object.entries(preset.vals).forEach(([k, v]) => {
      applyCSS(k, v);
    });
    Object.entries(newData).forEach(([k, v]) => setData(k, v));
  }
  function setColor(field, val) {
    setData(field, val);
    applyCSS(field, val);
    if (data.preset !== "custom") setData("preset", "custom");
  }
  function submit(e) {
    e.preventDefault();
    post(`${ap}/theme`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Theme & Branding", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Theme" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "max-w-6xl space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px]", children: "Color Presets" }),
          /* @__PURE__ */ jsx("span", { className: "text-[12px] text-gray-400", children: "Pick a preset or fully customize below" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: PRESETS.map((p) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => applyPreset(p.key),
            className: `flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all bg-white hover:shadow-md
                                    ${data.preset === p.key ? "shadow-sm" : "border-gray-200 hover:border-gray-300"}`,
            style: data.preset === p.key ? { borderColor: "var(--color-primary)" } : {},
            children: [
              p.vals.primary ? /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full shadow-sm border border-black/10", style: { background: p.vals.dark_bg } }),
                /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full shadow-sm border border-black/10", style: { background: p.vals.primary } }),
                /* @__PURE__ */ jsx("span", { className: "w-4 h-4 rounded-full shadow-sm border border-black/10", style: { background: p.vals.body_bg } })
              ] }) : /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🎨" }),
              /* @__PURE__ */ jsx("span", { className: "text-[12px] font-bold text-gray-800", children: p.label }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 text-center leading-tight", children: p.desc }),
              data.preset === p.key && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black", style: { color: "var(--color-primary)" }, children: "✓ Active" })
            ]
          },
          p.key
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-1", children: "Header Bar" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mb-5", children: "Logo, search box, cart & wishlist icon bar" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsx(Swatch, { label: "Background", hint: "Header fill color", value: data.header_bg, onChange: (v) => setColor("header_bg", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Text / Icons", hint: "Logo text, icon color", value: data.header_text, onChange: (v) => setColor("header_text", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Border", hint: "Bottom divider line", value: data.header_border, onChange: (v) => setColor("header_border", v) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-1", children: "Announcement Bar" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mb-5", children: "Thin bar above the header — phone, social links (desktop only)" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(Swatch, { label: "Background", hint: "Bar fill color", value: data.topbar_bg, onChange: (v) => setColor("topbar_bg", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Text Color", hint: "Phone number, links", value: data.topbar_text, onChange: (v) => setColor("topbar_text", v) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-1", children: "Navigation Bar" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mb-5", children: "Category nav below the header (Home, Men, Women…)" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsx(Swatch, { label: "Background", hint: "Nav bar fill", value: data.nav_bg, onChange: (v) => setColor("nav_bg", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Link Color", hint: "Category link text", value: data.nav_text, onChange: (v) => setColor("nav_text", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Border", hint: "Nav bottom border", value: data.nav_border, onChange: (v) => setColor("nav_border", v) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-1", children: "Brand Colors" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mb-5", children: "Buttons, links, trust bar, footer, hero, product cards" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsx(Swatch, { label: "Primary Color", hint: "Buttons, links, active nav", value: data.primary, onChange: (v) => setColor("primary", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Primary Hover", hint: "Hover state", value: data.primary_dark, onChange: (v) => setColor("primary_dark", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Text on Primary", hint: "Text inside gold buttons", value: data.primary_text, onChange: (v) => setColor("primary_text", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Accent", hint: "Sale badges, wishlist", value: data.accent, onChange: (v) => setColor("accent", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Dark Background", hint: "Hero, footer, cart bar", value: data.dark_bg, onChange: (v) => setColor("dark_bg", v) }),
              /* @__PURE__ */ jsx(Swatch, { label: "Page Background", hint: "Body fill", value: data.body_bg, onChange: (v) => setColor("body_bg", v) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-5", children: "Typography & Shape" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-5", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-500 mb-2", children: "Heading Font" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: data.font_heading,
                    onChange: (e) => setData("font_heading", e.target.value),
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white focus:border-[var(--color-primary)]",
                    children: FONTS.map((f) => /* @__PURE__ */ jsx("option", { children: f }, f))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-500 mb-2", children: "Body Font" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: data.font_body,
                    onChange: (e) => setData("font_body", e.target.value),
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white focus:border-[var(--color-primary)]",
                    children: FONTS.map((f) => /* @__PURE__ */ jsx("option", { children: f }, f))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-[12px] font-semibold text-gray-500 mb-2", children: [
                  "Border Radius ",
                  /* @__PURE__ */ jsxs("span", { className: "font-normal text-gray-400", children: [
                    "(",
                    data.border_radius,
                    "px)"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "range",
                    min: "0",
                    max: "24",
                    value: data.border_radius,
                    onChange: (e) => {
                      setData("border_radius", e.target.value);
                      document.documentElement.style.setProperty("--radius", e.target.value + "px");
                    },
                    className: "w-full",
                    style: { accentColor: "var(--color-primary)" }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] text-gray-400 mt-0.5", children: [
                  /* @__PURE__ */ jsx("span", { children: "Sharp" }),
                  /* @__PURE__ */ jsx("span", { children: "Rounded" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-4", children: "Color Scheme" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: [
              { val: "light", icon: IconSun, label: "Light", desc: "Always light" },
              { val: "dark", icon: IconMoon, label: "Dark", desc: "Always dark" },
              { val: "auto", icon: IconDeviceDesktop, label: "Auto", desc: "Follows system" }
            ].map((m) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setData("dark_mode", m.val),
                className: `flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white
                                            ${data.dark_mode === m.val ? "shadow-sm" : "border-gray-200 hover:border-gray-300"}`,
                style: data.dark_mode === m.val ? { borderColor: "var(--color-primary)" } : {},
                children: [
                  /* @__PURE__ */ jsx(m.icon, { size: 22, style: { color: data.dark_mode === m.val ? "var(--color-primary)" : "#9ca3af" } }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[12.5px] font-bold", style: data.dark_mode === m.val ? { color: "var(--color-primary)" } : { color: "#374151" }, children: m.label }),
                    /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: m.desc })
                  ] })
                ]
              },
              m.val
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4 sticky top-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsx(IconEye, { size: 15, className: "text-gray-400" }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-[14px] text-gray-800", children: "Live Preview" })
          ] }),
          /* @__PURE__ */ jsx(PreviewPanel, { data }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-2 text-center", children: "Updates live as you change any color" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2",
                style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                children: [
                  /* @__PURE__ */ jsx(IconCheck, { size: 18 }),
                  " ",
                  processing ? "Saving…" : "Save Theme"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => applyPreset("millionaire"),
                className: "w-full h-10 font-semibold text-[13px] rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 cursor-pointer flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(IconRefresh, { size: 15 }),
                  " Reset to Millionaire Default"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11.5px] text-amber-700", children: [
            "💡 All colors update live. ",
            /* @__PURE__ */ jsx("strong", { children: "Save Theme" }),
            " applies to all visitors."
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ThemeIndex as default
};
