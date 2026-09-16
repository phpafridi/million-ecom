import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-BzEeKzY0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
import "@tabler/icons-react";
function Policy({ settings, page, auth }) {
  const siteName = (settings == null ? void 0 : settings.site_name) ?? "MILLIONAIRE";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `${page.title} — ${siteName}` }),
    /* @__PURE__ */ jsxs("div", { style: { background: "var(--color-dark-bg, #0a0a0a)", padding: "clamp(56px,9vw,100px) clamp(20px,5vw,48px)", position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { style: { maxWidth: 860, position: "relative" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 44, marginBottom: 16 }, children: page.icon }),
        /* @__PURE__ */ jsx("h1", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(28px,5vw,48px)", color: "white", margin: "0 0 12px", lineHeight: 1.05 }, children: page.title }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 16, color: "rgba(255,255,255,0.5)", margin: 0 }, children: page.subtitle }),
        page.updated && /* @__PURE__ */ jsxs("p", { style: { fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 16 }, children: [
          "Last updated: ",
          page.updated
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { background: "#F9FAFB", borderBottom: "1px solid #F3F4F6", padding: "12px clamp(20px,5vw,48px)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#9CA3AF" }, children: [
      /* @__PURE__ */ jsx(Link_default, { href: "/", style: { color: "#9CA3AF", textDecoration: "none" }, children: "Home" }),
      /* @__PURE__ */ jsx("span", { children: "›" }),
      /* @__PURE__ */ jsx("span", { style: { color: "#374151", fontWeight: 600 }, children: page.title })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: 860, margin: "0 auto", padding: "clamp(40px,6vw,72px) clamp(20px,5vw,48px)" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 28 }, children: page.sections.map((s, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 20, alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("div", { style: { flexShrink: 0, width: 38, height: 38, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "var(--color-primary-text, #0a0a0a)", marginTop: 2 }, children: i + 1 }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx("h2", { style: { fontWeight: 800, fontSize: 17, color: "#111", margin: "0 0 10px", fontFamily: "Manrope, sans-serif" }, children: s.title }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: 14.5, color: "#4B5563", lineHeight: 1.85, whiteSpace: "pre-line", background: "#F9FAFB", borderRadius: 14, padding: "16px 20px", borderLeft: "3px solid var(--color-primary)" }, children: s.content })
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 56, padding: "24px", background: "var(--color-dark-bg, #0a0a0a)", borderRadius: 20 }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 12, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px" }, children: "Other Policies" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: [["Return Policy", "/pages/return-policy"], ["Privacy Policy", "/pages/privacy-policy"], ["Terms of Service", "/pages/terms"], ["Shipping Policy", "/pages/shipping-policy"], ["Payment Policy", "/pages/payment-policy"]].map(([l, h]) => /* @__PURE__ */ jsx(Link_default, { href: h, style: { fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 100, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }, children: l }, l)) })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 20, padding: "20px 24px", background: "#F9FAFB", borderRadius: 16, border: "1px solid #E5E7EB", textAlign: "center" }, children: /* @__PURE__ */ jsxs("p", { style: { fontSize: 13, color: "#6B7280", margin: 0 }, children: [
        "Questions about this policy?",
        " ",
        /* @__PURE__ */ jsx("a", { href: `mailto:${(settings == null ? void 0 : settings.email) ?? "support@millionaire.pk"}`, style: { color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }, children: (settings == null ? void 0 : settings.email) ?? "support@millionaire.pk" }),
        " ",
        "or",
        " ",
        /* @__PURE__ */ jsx(Link_default, { href: "/support", style: { color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }, children: "submit a support ticket" })
      ] }) })
    ] })
  ] });
}
export {
  Policy as default
};
