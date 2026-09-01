import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconArrowRight, IconBrandWhatsapp } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-K_5Bgk86.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
function About({ settings, content, auth }) {
  const wa = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const siteName = (settings == null ? void 0 : settings.site_name) ?? "MILLIONAIRE";
  (settings == null ? void 0 : settings.phone) ?? "";
  const stats = [
    { value: "50,000+", label: "Happy Customers" },
    { value: "1,000+", label: "Premium Products" },
    { value: "7", label: "Product Categories" },
    { value: "4.9★", label: "Average Rating" }
  ];
  const values = [
    { icon: "💎", title: "Premium Quality", desc: "Every product is hand-selected and verified for authenticity. We never compromise on quality." },
    { icon: "🚚", title: "Fast Delivery", desc: "Lahore, Karachi, Islamabad — 2 to 3 business days. All other cities within 5 days." },
    { icon: "🔒", title: "Secure Payments", desc: "PayFast, JazzCash, Easypaisa, Bank Transfer, COD — all payments secured and verified." },
    { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns on clothing. 30 days on shoes. Your satisfaction is guaranteed." },
    { icon: "🎧", title: "24/7 Support", desc: "Our team is always available via WhatsApp, live chat, or email to assist you." },
    { icon: "✅", title: "100% Genuine", desc: "Every item is 100% authentic. No replicas, no fakes — ever." }
  ];
  const team = [
    { name: "Salman Afridi", role: "Founder & CEO", emoji: "👑" },
    { name: "Operations", role: "Warehouse & Fulfillment", emoji: "📦" },
    { name: "Customer Care", role: "Support Team", emoji: "🎧" }
  ];
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `About Us — ${siteName}` }),
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", background: "var(--color-dark-bg, #0a0a0a)", padding: "clamp(64px,10vw,120px) clamp(20px,6vw,64px)", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }, children: "Our Story" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(32px,6vw,60px)", color: "white", margin: "0 0 16px", lineHeight: 1.05 }, children: [
            "Wear Your",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: "Status." })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "clamp(14px,1.8vw,17px)", color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.7, margin: "0 0 32px" }, children: (content == null ? void 0 : content.about_tagline) ?? `${siteName} is Pakistan's premium lifestyle store — founded on the belief that luxury should be accessible to everyone who values quality.` }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs(Link_default, { href: "/shop", style: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)", fontWeight: 800, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none" }, children: [
              "Shop Collection ",
              /* @__PURE__ */ jsx(IconArrowRight, { size: 16 })
            ] }),
            wa && /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${wa}`, target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "white", fontWeight: 800, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none" }, children: [
              /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 17 }),
              " WhatsApp Us"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block", style: { display: "flex", flexDirection: "column", gap: 12 }, children: stats.map((s) => /* @__PURE__ */ jsxs("div", { style: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 24px", textAlign: "center", minWidth: 140 }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: 24, color: "var(--color-primary)", margin: 0 }, children: s.value }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "4px 0 0", fontWeight: 600 }, children: s.label })
        ] }, s.label)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lg:hidden", style: { background: "var(--color-dark-bg, #0a0a0a)", padding: "0 20px 32px" }, children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }, children: stats.map((s) => /* @__PURE__ */ jsxs("div", { style: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: 22, color: "var(--color-primary)", margin: 0 }, children: s.value }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "3px 0 0", fontWeight: 600 }, children: s.label })
    ] }, s.label)) }) }),
    /* @__PURE__ */ jsx("div", { style: { padding: "clamp(48px,8vw,80px) clamp(20px,6vw,64px)", maxWidth: 1200, margin: "0 auto" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "start" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }, children: "Our Mission" }),
        /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.5vw,36px)", color: "#111", margin: "0 0 20px", lineHeight: 1.15 }, children: [
          "Premium lifestyle.",
          /* @__PURE__ */ jsx("br", {}),
          "Honest prices."
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#555", lineHeight: 1.8, margin: "0 0 16px" }, children: (content == null ? void 0 : content.about_mission) ?? `${siteName} was founded with one goal — make premium quality fashion and lifestyle products accessible to every Pakistani who knows their worth.` }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#555", lineHeight: 1.8 }, children: (content == null ? void 0 : content.about_mission2) ?? "From signature clothing to luxury perfumes, premium watches to designer sunglasses — every product in our store is carefully selected to match the Millionaire standard." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }, children: "Our Vision" }),
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.5vw,36px)", color: "#111", margin: "0 0 20px", lineHeight: 1.15 }, children: "Pakistan's most trusted premium store." }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#555", lineHeight: 1.8, margin: "0 0 16px" }, children: (content == null ? void 0 : content.about_vision) ?? "We are building a brand that Pakistanis trust for quality, speed and service. Every order we fulfill is a step toward that vision." }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "#555", lineHeight: 1.8 }, children: (content == null ? void 0 : content.about_vision2) ?? "Whether you shop from Karachi, Lahore or a small city, MILLIONAIRE delivers the same premium experience to your doorstep." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: { background: "#F9FAFB", padding: "clamp(48px,8vw,80px) clamp(20px,6vw,64px)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1200, margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: 48 }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }, children: "Why MILLIONAIRE" }),
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.5vw,36px)", color: "#111", margin: 0 }, children: "The MILLIONAIRE Promise" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }, children: values.map((v) => /* @__PURE__ */ jsxs("div", { style: { background: "white", borderRadius: 20, padding: "28px 24px", border: "1px solid #F3F4F6", transition: "box-shadow 0.2s" }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: 36, marginBottom: 14 }, children: v.icon }),
        /* @__PURE__ */ jsx("h3", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 17, color: "#111", margin: "0 0 8px" }, children: v.title }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13.5, color: "#6B7280", lineHeight: 1.7, margin: 0 }, children: v.desc })
      ] }, v.title)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "clamp(48px,8vw,80px) clamp(20px,6vw,64px)", maxWidth: 1200, margin: "0 auto", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }, children: "The Team" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(24px,3.5vw,36px)", color: "#111", margin: "0 0 40px" }, children: "People Behind MILLIONAIRE" }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, maxWidth: 700, margin: "0 auto" }, children: team.map((t) => /* @__PURE__ */ jsxs("div", { style: { background: "#F9FAFB", borderRadius: 20, padding: "28px 20px", border: "1px solid #F3F4F6" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 60, height: 60, borderRadius: "50%", background: "var(--color-dark-bg, #0a0a0a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px" }, children: t.emoji }),
        /* @__PURE__ */ jsx("p", { style: { fontWeight: 800, fontSize: 15, color: "#111", margin: "0 0 4px" }, children: t.name }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 12, color: "#9CA3AF", fontWeight: 600, margin: 0 }, children: t.role })
      ] }, t.name)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { background: "var(--color-dark-bg, #0a0a0a)", padding: "clamp(48px,8vw,72px) clamp(20px,6vw,48px)", textAlign: "center", position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 70%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px", position: "relative" }, children: "Start Shopping" }),
      /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(24px,4vw,40px)", color: "white", margin: "0 0 16px", position: "relative" }, children: "Ready to wear your status?" }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", position: "relative" }, children: "Join 50,000+ customers who trust MILLIONAIRE for premium lifestyle products." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative" }, children: [
        /* @__PURE__ */ jsxs(Link_default, { href: "/shop", style: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none" }, children: [
          "Shop Now ",
          /* @__PURE__ */ jsx(IconArrowRight, { size: 16 })
        ] }),
        wa && /* @__PURE__ */ jsxs("a", { href: `https://wa.me/${wa}`, target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "white", fontWeight: 700, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }, children: [
          /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 17 }),
          " WhatsApp"
        ] })
      ] })
    ] })
  ] });
}
export {
  About as default
};
