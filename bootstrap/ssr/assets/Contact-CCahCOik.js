import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconMessageCircle, IconClock, IconBrandWhatsapp, IconCheck, IconSend, IconPhone, IconMail, IconMapPin } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-DANnSWOS.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function Contact({ settings, auth }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const wa = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const phone = (settings == null ? void 0 : settings.phone) ?? "";
  const email = (settings == null ? void 0 : settings.email) ?? "";
  const address = (settings == null ? void 0 : settings.address) ?? "Pakistan";
  const siteName = (settings == null ? void 0 : settings.site_name) ?? "MILLIONAIRE";
  function submit(e) {
    e.preventDefault();
    setLoading(true);
    router3.post("/support", { ...form, name: form.name, email: form.email, subject: form.subject, message: form.message }, {
      onSuccess: () => {
        setSent(true);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      },
      preserveScroll: true
    });
  }
  const contacts = [
    { icon: /* @__PURE__ */ jsx(IconPhone, { size: 22 }), label: "Phone", value: phone || "+92 300 0000000", href: `tel:${phone}`, color: "#3B82F6" },
    { icon: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 22 }), label: "WhatsApp", value: wa ? `+${wa}` : "Available 24/7", href: wa ? `https://wa.me/${wa}` : "#", color: "#25D366" },
    { icon: /* @__PURE__ */ jsx(IconMail, { size: 22 }), label: "Email", value: email || `support@millionaire.pk`, href: `mailto:${email}`, color: "#8B5CF6" },
    { icon: /* @__PURE__ */ jsx(IconMapPin, { size: 22 }), label: "Location", value: address, href: "#", color: "#EF4444" }
  ];
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `Contact Us — ${siteName}` }),
    /* @__PURE__ */ jsxs("div", { style: { background: "var(--color-dark-bg, #0a0a0a)", padding: "clamp(56px,9vw,100px) clamp(20px,6vw,64px)", position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.1) 0%, transparent 60%)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs("div", { style: { maxWidth: 700, position: "relative" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }, children: [
          /* @__PURE__ */ jsx(IconMessageCircle, { size: 13, color: "var(--color-primary)" }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }, children: "Get in Touch" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(28px,5.5vw,52px)", color: "white", margin: "0 0 14px", lineHeight: 1.05 }, children: [
          "We're here to help",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: "anytime." })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }, children: "Questions about your order, products, or anything else? Our team responds within 1 hour during business hours." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { maxWidth: 1200, margin: "0 auto", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,48px)" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: 22, color: "#111", margin: "0 0 20px" }, children: "Contact Information" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }, children: contacts.map((c) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: c.href,
            target: c.href.startsWith("http") ? "_blank" : void 0,
            rel: "noopener noreferrer",
            style: { display: "flex", alignItems: "center", gap: 14, background: "#F9FAFB", borderRadius: 16, padding: "16px 18px", textDecoration: "none", border: "1px solid #F3F4F6", transition: "border-color 0.2s" },
            children: [
              /* @__PURE__ */ jsx("div", { style: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: c.color + "15", color: c.color }, children: c.icon }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }, children: c.label }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: 14, fontWeight: 700, color: "#111", margin: 0 }, children: c.value })
              ] })
            ]
          },
          c.label
        )) }),
        /* @__PURE__ */ jsxs("div", { style: { background: "var(--color-dark-bg, #0a0a0a)", borderRadius: 20, padding: "24px 22px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }, children: [
            /* @__PURE__ */ jsx(IconClock, { size: 18, color: "var(--color-primary)" }),
            /* @__PURE__ */ jsx("p", { style: { fontWeight: 800, fontSize: 14, color: "white", margin: 0 }, children: "Business Hours" })
          ] }),
          [["Monday – Saturday", "10:00 AM – 8:00 PM"], ["Sunday", "12:00 PM – 6:00 PM"], ["WhatsApp / Live Chat", "24 / 7"]].map(([d, t]) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: 13, color: "rgba(255,255,255,0.5)" }, children: d }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }, children: t })
          ] }, d))
        ] }),
        wa && /* @__PURE__ */ jsxs(
          "a",
          {
            href: `https://wa.me/${wa}?text=Hi! I need help with my order.`,
            target: "_blank",
            rel: "noopener noreferrer",
            style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25D366", color: "white", fontWeight: 800, fontSize: 15, padding: "16px", borderRadius: 16, textDecoration: "none", marginTop: 16 },
            children: [
              /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 22 }),
              " Chat on WhatsApp"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: 22, color: "#111", margin: "0 0 20px" }, children: "Send a Message" }),
        sent ? /* @__PURE__ */ jsxs("div", { style: { background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 20, padding: "40px 32px", textAlign: "center" }, children: [
          /* @__PURE__ */ jsx("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }, children: /* @__PURE__ */ jsx(IconCheck, { size: 30, color: "white" }) }),
          /* @__PURE__ */ jsx("h3", { style: { fontWeight: 800, fontSize: 20, color: "#065F46", margin: "0 0 8px" }, children: "Message Sent!" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#059669", margin: "0 0 20px", lineHeight: 1.6 }, children: "Thank you for reaching out. Our team will respond within 1 hour." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSent(false);
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
              },
              style: { background: "#10B981", color: "white", border: "none", borderRadius: 12, padding: "10px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
              children: "Send Another Message"
            }
          )
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
          [
            { key: "name", label: "Your Name *", placeholder: "e.g. Ahmed Khan", type: "text" },
            { key: "email", label: "Email Address *", placeholder: "ahmed@example.com", type: "email" },
            { key: "phone", label: "Phone Number", placeholder: "+92 300 0000000", type: "tel" },
            { key: "subject", label: "Subject *", placeholder: "How can we help you?", type: "text" }
          ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }, children: f.label }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: f.type,
                required: f.label.includes("*"),
                placeholder: f.placeholder,
                value: form[f.key],
                onChange: (e) => setForm((p) => ({ ...p, [f.key]: e.target.value })),
                style: { width: "100%", height: 46, padding: "0 16px", border: "2px solid #E5E7EB", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }
              }
            )
          ] }, f.key)),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }, children: "Message *" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                required: true,
                rows: 5,
                placeholder: "Tell us more about your question or issue...",
                value: form.message,
                onChange: (e) => setForm((p) => ({ ...p, message: e.target.value })),
                style: { width: "100%", padding: "12px 16px", border: "2px solid #E5E7EB", borderRadius: 12, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: loading,
              style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--color-dark-bg, #0a0a0a)", color: "white", border: "none", borderRadius: 14, padding: "15px 24px", fontWeight: 800, fontSize: 14, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 },
              children: [
                /* @__PURE__ */ jsx(IconSend, { size: 17 }),
                " ",
                loading ? "Sending..." : "Send Message"
              ]
            }
          ),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: 0 }, children: "We respond within 1 hour · Mon–Sat 10AM–8PM" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Contact as default
};
