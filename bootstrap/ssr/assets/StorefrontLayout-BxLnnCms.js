import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from "react";
import { u as usePage, L as Link_default, r as router3 } from "../ssr.js";
import { useEchoPublic } from "@laravel/echo-react";
import { IconX, IconHeadset, IconRobot, IconSend, IconShoppingCart, IconArrowRight, IconCreditCard, IconPhone, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram, IconMenu, IconSearch, IconSun, IconMoon, IconHeart, IconInfoCircle, IconMessageCircle, IconUser, IconChevronDown } from "@tabler/icons-react";
const SIZE_PX = {
  sm: { diameter: 48, gap: 12 },
  md: { diameter: 56, gap: 16 },
  lg: { diameter: 64, gap: 20 }
};
const BASE_BOTTOM = 24;
const DEFAULT_ORDER = ["chat", "cart", "whatsapp"];
function readFloatSettings(settings, key, defaultEnabled) {
  const s = settings ?? {};
  return {
    enabled: (s[`${key}_float_enabled`] ?? (defaultEnabled ? "1" : "0")) === "1",
    corner: s[`${key}_float_position`] || "right",
    size: s[`${key}_float_size`] || "md"
  };
}
function getFloatOffset(settings, key, defaultEnabledMap = { chat: true, cart: true, whatsapp: false }) {
  const all = {
    chat: readFloatSettings(settings, "chat", defaultEnabledMap.chat),
    cart: readFloatSettings(settings, "cart", defaultEnabledMap.cart),
    whatsapp: readFloatSettings(settings, "whatsapp", defaultEnabledMap.whatsapp)
  };
  const self = all[key];
  let bottom = BASE_BOTTOM;
  for (const otherKey of DEFAULT_ORDER) {
    if (otherKey === key) break;
    const other = all[otherKey];
    if (other.enabled && other.corner === self.corner) {
      const dims = SIZE_PX[other.size];
      bottom += dims.diameter + dims.gap;
    }
  }
  return {
    bottom,
    side: 24,
    corner: self.corner,
    enabled: self.enabled,
    diameter: SIZE_PX[self.size].diameter
  };
}
function ChatWidget({ settings, auth }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [numericId, setNumericId] = useState(null);
  const numericIdRef = useRef(null);
  const openRef = useRef(false);
  const [status, setStatus] = useState("bot");
  const [lastId, setLastId] = useState(0);
  const [agentName, setAgentName] = useState(null);
  const [unread, setUnread] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const bottomRef = useRef(null);
  const chatColor = (settings == null ? void 0 : settings.chat_bubble_color) || "var(--color-dark-bg, #0a0a0a)";
  const chatIcon = (settings == null ? void 0 : settings.chat_bubble_icon) || "💬";
  const siteName = (settings == null ? void 0 : settings.site_name) || "MILLIONAIRE";
  const floatCfg = getFloatOffset(settings, "chat", { chat: true, cart: true, whatsapp: false });
  const csrf = () => {
    var _a;
    return ((_a = document.querySelector("meta[name=csrf-token]")) == null ? void 0 : _a.content) || "";
  };
  async function startChat() {
    var _a;
    try {
      const r = await fetch("/chat/start", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf() } });
      const d = await r.json();
      setSessionId(d.session_id);
      setNumericId(d.id ?? null);
      setMessages(d.messages || []);
      setStatus(d.status);
      if ((_a = d.messages) == null ? void 0 : _a.length) setLastId(d.messages[d.messages.length - 1].id);
    } catch {
    }
  }
  useEffect(() => {
    if (open && !sessionId) startChat();
    if (open) setUnread(0);
  }, [open]);
  useEffect(() => {
    numericIdRef.current = numericId;
  }, [numericId]);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEchoPublic(numericId ? `chat.${numericId}` : "chat.__none__", ".message.sent", (e) => {
    if (!numericIdRef.current) return;
    if (e.senderType !== "visitor") {
      setMessages((m) => [...m, {
        id: Date.now(),
        message: e.message,
        sender_type: e.senderType,
        message_type: "text",
        created_at: e.createdAt
      }]);
      if (!openRef.current) setUnread((u) => u + 1);
    }
    if (e.status) setStatus(e.status);
    if (e.agentName) setAgentName(e.agentName);
    if (e.status === "closed") setShowRating(true);
  });
  useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || !sessionId) return;
    setInput("");
    setMessages((m) => [...m, { id: Date.now(), sender_type: "visitor", message: msg, message_type: "text", created_at: (/* @__PURE__ */ new Date()).toISOString() }]);
    try {
      await fetch("/chat/send", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf() }, body: JSON.stringify({ message: msg, session_id: sessionId }) });
    } catch {
    }
  }
  async function submitRating() {
    if (!sessionId || !rating) return;
    await fetch("/chat/rate", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf() }, body: JSON.stringify({ session_id: sessionId, rating }) });
    setShowRating(false);
  }
  if (!floatCfg.enabled) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
                /* BUTTON */
                .ml-chat-btn {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9990;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 24px rgba(0,0,0,0.22);
                    transition: all 0.3s;
                }
                /* WINDOW */
                .ml-chat-win {
                    position: fixed;
                    bottom: 90px;
                    right: 24px;
                    z-index: 9991;
                    width: clamp(310px, 88vw, 380px);
                    height: clamp(440px, 65vh, 560px);
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 16px 56px rgba(0,0,0,0.18);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.07);
                }
                /* MOBILE overrides — above bottom nav, left of Login tab */
                @media (max-width: 1023px) {
                    .ml-chat-btn {
                        /* Sits low, near the Login icon — the cart FAB (when
                           present) is a same-size icon stacked directly above
                           it, so there's no wide bar to avoid anymore. */
                        bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 10px) !important;
                        right: 16px !important;
                        width: 46px !important;
                        height: 46px !important;
                    }
                    .ml-chat-win {
                        /* full-width sheet on mobile */
                        bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 66px) !important;
                        right: 8px !important;
                        left: 8px !important;
                        width: auto !important;
                        height: clamp(360px, 60vh, 520px);
                        border-radius: 16px;
                    }
                }
            ` }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "ml-chat-btn",
        onClick: () => setOpen((o) => !o),
        style: {
          background: open ? "#374151" : chatColor,
          fontSize: open ? 20 : 22,
          bottom: floatCfg.bottom,
          width: floatCfg.diameter,
          height: floatCfg.diameter,
          ...floatCfg.corner === "left" ? { left: floatCfg.side, right: "auto" } : { right: floatCfg.side, left: "auto" }
        },
        children: [
          open ? /* @__PURE__ */ jsx(IconX, { size: 20, color: "white" }) : /* @__PURE__ */ jsx("span", { children: chatIcon }),
          !open && unread > 0 && /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: -3, right: -3, background: "#EF4444", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }, children: unread })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "ml-chat-win", style: {
      bottom: floatCfg.bottom + floatCfg.diameter + 12,
      ...floatCfg.corner === "left" ? { left: floatCfg.side, right: "auto" } : { right: floatCfg.side, left: "auto" }
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { background: chatColor, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: status === "active" ? /* @__PURE__ */ jsx(IconHeadset, { size: 17, color: "white" }) : /* @__PURE__ */ jsx(IconRobot, { size: 17, color: "white" }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx("p", { style: { color: "white", fontWeight: 800, fontSize: 13.5, margin: 0 }, children: status === "active" ? agentName ?? "Support Agent" : `${siteName} Support` }),
          /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.55)", fontSize: 11, margin: 0 }, children: status === "active" ? "🟢 Live" : status === "waiting" ? "⏳ Connecting..." : "🤖 AI + Live agents" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setOpen(false), style: { background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }, children: /* @__PURE__ */ jsx(IconX, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { flex: 1, overflowY: "auto", padding: "12px 12px 6px" }, children: [
        messages.map((msg, i) => /* @__PURE__ */ jsx("div", { style: { marginBottom: 10 }, children: msg.sender_type === "system" ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", fontSize: 11, color: "#9CA3AF", background: "#F9FAFB", borderRadius: 8, padding: "5px 10px", margin: "6px 0" }, children: msg.message }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: msg.sender_type === "visitor" ? "row-reverse" : "row", gap: 7, alignItems: "flex-end" }, children: [
          msg.sender_type !== "visitor" && /* @__PURE__ */ jsx("div", { style: { width: 26, height: 26, borderRadius: "50%", background: msg.sender_type === "agent" ? "#7C3AED" : chatColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }, children: msg.sender_type === "agent" ? /* @__PURE__ */ jsx(IconHeadset, { size: 12, color: "white" }) : /* @__PURE__ */ jsx(IconRobot, { size: 12, color: "white" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: {
              maxWidth: "72%",
              background: msg.sender_type === "visitor" ? chatColor : "#F3F4F6",
              color: msg.sender_type === "visitor" ? "white" : "#111",
              borderRadius: msg.sender_type === "visitor" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              padding: "8px 12px",
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: "pre-line"
            }, children: msg.message }),
            msg.options && (() => {
              try {
                const opts = JSON.parse(msg.options);
                return opts.length > 0 ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }, children: opts.map((o) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => send(o),
                    style: { padding: "5px 11px", borderRadius: 100, border: `1.5px solid ${chatColor}`, background: "white", color: chatColor, fontSize: 11.5, fontWeight: 700, cursor: "pointer" },
                    children: o
                  },
                  o
                )) }) : null;
              } catch {
                return null;
              }
            })()
          ] })
        ] }) }, msg.id || i)),
        /* @__PURE__ */ jsx("div", { ref: bottomRef })
      ] }),
      showRating && /* @__PURE__ */ jsxs("div", { style: { padding: "10px 14px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA", flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }, children: "Rate this chat:" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 4, marginBottom: 6 }, children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx("button", { onClick: () => setRating(n), style: { background: "none", border: "none", cursor: "pointer", fontSize: 22, opacity: n <= rating ? 1 : 0.25 }, children: "⭐" }, n)) }),
        rating > 0 && /* @__PURE__ */ jsx("button", { onClick: submitRating, style: { background: chatColor, color: "white", border: "none", borderRadius: 8, padding: "5px 14px", fontWeight: 700, cursor: "pointer", fontSize: 12 }, children: "Submit" })
      ] }),
      !showRating && /* @__PURE__ */ jsxs("div", { style: { padding: "9px 10px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 7, alignItems: "center", flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: input,
            onChange: (e) => setInput(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send()),
            placeholder: status === "waiting" ? "Waiting for agent..." : "Type a message...",
            disabled: status === "waiting",
            style: { flex: 1, height: 38, padding: "0 12px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none" }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => send(),
            disabled: !input.trim() || status === "waiting",
            style: { width: 38, height: 38, borderRadius: 10, background: chatColor, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", opacity: input.trim() ? 1 : 0.4 },
            children: /* @__PURE__ */ jsx(IconSend, { size: 16, color: "white" })
          }
        )
      ] })
    ] })
  ] });
}
function FloatingCart({ settings }) {
  const { props } = usePage();
  const cartCount = props.cartCount ?? 0;
  const cartTotal = props.cartTotal ?? 0;
  const cartItems = props.cartItems ?? [];
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  useEffect(() => {
    const key = "ml_cart_last_count";
    const prev = Number(sessionStorage.getItem(key) ?? "0");
    if (cartCount > prev) {
      setOpen(true);
      const t = setTimeout(() => setOpen(false), 5e3);
      sessionStorage.setItem(key, String(cartCount));
      return () => clearTimeout(t);
    }
    sessionStorage.setItem(key, String(cartCount));
  }, [cartCount]);
  useEffect(() => {
    if (cartCount === 0) setOpen(false);
  }, [cartCount]);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  if (cartCount === 0) return null;
  const bg = (settings == null ? void 0 : settings.cart_bubble_color) || "#0a0a0a";
  const fmt = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;
  const floatCfg = getFloatOffset(settings, "cart", { chat: true, cart: true, whatsapp: false });
  if (!floatCfg.enabled) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
                @keyframes mlCartPop {
                    from { opacity:0; transform:scale(0.85) }
                    to   { opacity:1; transform:scale(1) }
                }
                @keyframes mlCartPanelIn {
                    from { opacity:0; transform:translateY(12px) scale(0.96) }
                    to   { opacity:1; transform:translateY(0) scale(1) }
                }
                .ml-cart-fab {
                    position: fixed;
                    z-index: 9985;
                    width: 52px; height: 52px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 8px 28px rgba(0,0,0,0.28);
                    animation: mlCartPop 0.3s cubic-bezier(.34,1.56,.64,1) both;
                    right: 24px;
                    bottom: 96px;
                }
                .ml-cart-badge {
                    position: absolute; top: -4px; right: -4px;
                    min-width: 20px; height: 20px; padding: 0 5px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px; font-weight: 900;
                }
                .ml-cart-panel {
                    position: fixed;
                    z-index: 9985;
                    width: 280px;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
                    animation: mlCartPanelIn 0.2s cubic-bezier(.34,1.56,.64,1) both;
                    right: 24px;
                    bottom: 158px;
                }
                @media (max-width: 1023px) {
                    .ml-cart-fab {
                        right: 16px !important;
                        bottom: calc(56px + env(safe-area-inset-bottom,0px) + 66px) !important;
                        width: 46px !important; height: 46px !important;
                    }
                    .ml-cart-panel {
                        right: 8px !important;
                        left: 8px !important;
                        width: auto !important;
                        bottom: calc(56px + env(safe-area-inset-bottom,0px) + 118px) !important;
                    }
                }
            ` }),
    /* @__PURE__ */ jsxs("button", { className: "ml-cart-fab", style: {
      background: bg,
      width: floatCfg.diameter,
      height: floatCfg.diameter,
      bottom: floatCfg.bottom,
      ...floatCfg.corner === "left" ? { left: floatCfg.side, right: "auto" } : { right: floatCfg.side, left: "auto" }
    }, onClick: () => setOpen((v) => !v), "aria-label": "Cart", children: [
      open ? /* @__PURE__ */ jsx(IconX, { size: 20, color: "white" }) : /* @__PURE__ */ jsx(IconShoppingCart, { size: 20, color: "white" }),
      !open && /* @__PURE__ */ jsx("span", { className: "ml-cart-badge", style: {
        background: "var(--color-primary,#C9A84C)",
        color: "var(--color-primary-text,#0a0a0a)",
        border: `2px solid ${bg}`
      }, children: cartCount > 9 ? "9+" : cartCount })
    ] }),
    open && /* @__PURE__ */ jsx("div", { className: "ml-cart-panel", ref: panelRef, style: {
      background: "#161616",
      bottom: floatCfg.bottom + floatCfg.diameter + 10,
      ...floatCfg.corner === "left" ? { left: floatCfg.side, right: "auto" } : { right: floatCfg.side, left: "auto" }
    }, children: /* @__PURE__ */ jsxs("div", { style: { padding: "18px 18px 14px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "white", fontWeight: 900, fontSize: 14.5 }, children: "Your Cart" }),
        /* @__PURE__ */ jsxs("span", { style: {
          background: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.7)",
          fontSize: 11,
          fontWeight: 800,
          padding: "3px 9px",
          borderRadius: 100
        }, children: [
          cartCount,
          " item",
          cartCount !== 1 ? "s" : ""
        ] })
      ] }),
      cartTotal > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.55)", fontSize: 12.5, fontWeight: 600 }, children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary,#C9A84C)", fontSize: 18, fontWeight: 900 }, children: fmt(cartTotal) })
      ] }),
      cartItems.length > 0 && /* @__PURE__ */ jsx("div", { style: { maxHeight: 220, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }, children: cartItems.map((item) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("div", { style: { width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.06)" }, children: item.product_image ? /* @__PURE__ */ jsx("img", { src: item.product_image, alt: item.product_name, style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(IconShoppingCart, { size: 16, color: "rgba(255,255,255,0.3)" }) }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("p", { style: { color: "#fff", fontSize: 12.5, fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: item.product_name }),
          item.variant_label && /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "2px 0 0" }, children: item.variant_label }),
          /* @__PURE__ */ jsxs("p", { style: { color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "2px 0 0" }, children: [
            "Qty ",
            item.quantity,
            " × ",
            fmt(item.price)
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { style: { color: "#fff", fontSize: 12.5, fontWeight: 800, flexShrink: 0 }, children: fmt(item.subtotal) })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        /* @__PURE__ */ jsxs(Link_default, { href: "/cart", onClick: () => setOpen(false), style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          padding: "11px 14px",
          borderRadius: 11,
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 800
        }, children: [
          "View Cart ",
          /* @__PURE__ */ jsx(IconArrowRight, { size: 14 })
        ] }),
        /* @__PURE__ */ jsxs(Link_default, { href: "/cart", onClick: () => setOpen(false), style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "var(--color-primary,#C9A84C)",
          color: "var(--color-primary-text,#0a0a0a)",
          padding: "11px 14px",
          borderRadius: 11,
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 900
        }, children: [
          /* @__PURE__ */ jsx(IconCreditCard, { size: 15 }),
          " Checkout"
        ] })
      ] })
    ] }) })
  ] });
}
function SaleCountdownBar({ label, badge, endsAt, bg, color }) {
  const [time, setTime] = React.useState({ d: 0, h: 0, m: 0, s: 0, done: false });
  React.useEffect(() => {
    function tick() {
      const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
      if (diff === 0) {
        setTime((t) => ({ ...t, done: true }));
        return;
      }
      setTime({ d: Math.floor(diff / 864e5), h: Math.floor(diff % 864e5 / 36e5), m: Math.floor(diff % 36e5 / 6e4), s: Math.floor(diff % 6e4 / 1e3), done: false });
    }
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [endsAt]);
  if (time.done) return null;
  const pad = (n) => String(n).padStart(2, "0");
  const box = (val, lbl) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "font-black text-[15px] leading-none px-2 py-1 rounded-md", style: { background: "rgba(255,255,255,0.15)", minWidth: 32, textAlign: "center" }, children: val }),
    /* @__PURE__ */ jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider opacity-70 mt-0.5", children: lbl })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "w-full flex items-center justify-center gap-4 px-4 py-2 text-[13px] font-bold", style: { background: bg, color }, children: [
    /* @__PURE__ */ jsx("span", { className: "font-black text-[13px] uppercase tracking-wide", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
      time.d > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        box(pad(time.d), "DAYS"),
        /* @__PURE__ */ jsx("span", { className: "font-black text-[16px] opacity-70", children: ":" })
      ] }),
      box(pad(time.h), "HRS"),
      /* @__PURE__ */ jsx("span", { className: "font-black text-[16px] opacity-70", children: ":" }),
      box(pad(time.m), "MIN"),
      /* @__PURE__ */ jsx("span", { className: "font-black text-[16px] opacity-70", children: ":" }),
      box(pad(time.s), "SEC")
    ] }),
    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline font-black text-[12px] px-3 py-1 rounded-full", style: { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }, children: badge })
  ] });
}
function StorefrontLayout({ children, auth, settings, hideFloatingCart }) {
  var _a, _b, _c, _d, _e;
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const siteName = (settings == null ? void 0 : settings.site_name) ?? "Tijar";
  const phone = (settings == null ? void 0 : settings.phone) ?? "";
  const rawWhatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const whatsapp = /^\+?[0-9]{7,15}$/.test(rawWhatsapp) ? rawWhatsapp : "";
  const logoUrl = (settings == null ? void 0 : settings.logo_url) ?? null;
  const tagline = (settings == null ? void 0 : settings.site_tagline) ?? "";
  const showWhatsapp = (settings == null ? void 0 : settings.show_whatsapp_button) !== "0";
  const showFacebook = (settings == null ? void 0 : settings.show_facebook_button) === "1";
  const showInstagram = (settings == null ? void 0 : settings.show_instagram_button) === "1";
  const showPhone = (settings == null ? void 0 : settings.show_phone_button) !== "0";
  (settings == null ? void 0 : settings.contact_method) ?? "whatsapp";
  const fbUrl = (settings == null ? void 0 : settings.facebook_url) ?? "";
  const igUrl = (settings == null ? void 0 : settings.instagram_url) ?? "";
  const page = usePage();
  const cartCount = page.props.cartCount ?? 0;
  const wishlistCount = page.props.wishlistCount ?? 0;
  const navItems = [{ label: "Home", href: "/" }, ...page.props.navCategories ?? []];
  const currentUrl = page.url;
  const [darkMode, setDarkMode] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  function toggleDark() {
    const next = darkMode === "dark" ? "light" : "dark";
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  function doSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      router3.get("/shop", { q: search });
      setMobileOpen(false);
      setSearchOpen(false);
    }
  }
  function isActive(link) {
    if (link.href === "/") return currentUrl === "/";
    const cat = link.href.split("category=")[1];
    return cat ? currentUrl.includes(cat) : currentUrl.startsWith(link.href);
  }
  function MobileNavItem({ item, depth = 0 }) {
    var _a2;
    const [open, setOpen] = useState(false);
    const hasKids = (((_a2 = item.children) == null ? void 0 : _a2.length) ?? 0) > 0;
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b border-gray-50", style: { paddingLeft: depth * 16 }, children: [
        /* @__PURE__ */ jsx(
          Link_default,
          {
            href: item.href,
            onClick: () => setMobileOpen(false),
            className: `flex-1 px-5 py-3.5 text-[14px] font-semibold no-underline transition-colors
                            ${isActive(item) ? "text-[var(--color-primary)]" : "text-gray-700 hover:text-[var(--color-primary)]"}`,
            children: item.label
          }
        ),
        hasKids && /* @__PURE__ */ jsx("button", { onClick: () => setOpen(!open), className: "px-4 py-3.5 text-gray-400 border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconChevronDown, { size: 14, className: `transition-transform ${open ? "rotate-180" : ""}` }) })
      ] }),
      open && hasKids && item.children.map((c) => /* @__PURE__ */ jsx(MobileNavItem, { item: c, depth: depth + 1 }, c.href))
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", style: { background: "var(--color-body-bg)", overflowX: "hidden", maxWidth: "100vw", width: "100%" }, children: [
    ((_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.role) === "admin" && /* @__PURE__ */ jsxs("div", { style: { background: "#7C3AED", color: "white", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, fontWeight: 700, zIndex: 100 }, children: [
      /* @__PURE__ */ jsx("span", { children: "🔐 Admin Preview Mode — customers see this page normally" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("span", { style: { opacity: 0.6 }, children: [
          "Logged in as: ",
          auth.user.name
        ] }),
        /* @__PURE__ */ jsx("a", { href: `/${((_b = page.props) == null ? void 0 : _b.adminPath) ?? "ml-admin"}`, style: { color: "white", textDecoration: "none", opacity: 0.9 }, children: "← Back to Admin" })
      ] })
    ] }),
    (settings == null ? void 0 : settings.sale_enabled) === "1" && (settings == null ? void 0 : settings.sale_ends_at) && /* @__PURE__ */ jsx(
      SaleCountdownBar,
      {
        label: settings.sale_label ?? "FLASH SALE",
        badge: settings.sale_badge ?? "UP TO 60% OFF",
        endsAt: settings.sale_ends_at,
        bg: settings.sale_bg ?? "#1a472a",
        color: settings.sale_text_color ?? "#ffffff"
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "hidden md:flex h-9 items-center justify-between px-6 lg:px-10 border-b",
        style: { background: "var(--color-topbar-bg, var(--color-dark-bg, #0a0a0a))", borderColor: "rgba(255,255,255,0.06)" },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
            phone && showPhone && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `tel:${phone}`,
                className: "flex items-center gap-1.5 text-[11.5px] no-underline transition-colors hover:opacity-80",
                style: { color: "rgba(255,255,255,0.65)" },
                children: [
                  /* @__PURE__ */ jsx(IconPhone, { size: 12 }),
                  " ",
                  phone
                ]
              }
            ),
            showWhatsapp && whatsapp && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `https://wa.me/${whatsapp}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-1.5 text-[11.5px] no-underline hover:opacity-80",
                style: { color: "#25D366" },
                children: [
                  /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 12 }),
                  " WhatsApp"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-[11.5px] font-semibold hidden lg:block", style: { color: "rgba(255,255,255,0.7)" }, children: (settings == null ? void 0 : settings.topbar_message) ?? "" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            showFacebook && fbUrl && /* @__PURE__ */ jsx("a", { href: fbUrl, target: "_blank", rel: "noopener noreferrer", className: "no-underline hover:opacity-80", style: { color: "rgba(255,255,255,0.6)" }, children: /* @__PURE__ */ jsx(IconBrandFacebook, { size: 15 }) }),
            showInstagram && igUrl && /* @__PURE__ */ jsx("a", { href: igUrl, target: "_blank", rel: "noopener noreferrer", className: "no-underline hover:opacity-80", style: { color: "rgba(255,255,255,0.6)" }, children: /* @__PURE__ */ jsx(IconBrandInstagram, { size: 15 }) }),
            /* @__PURE__ */ jsx(Link_default, { href: "/about", className: "text-[11.5px] no-underline transition-colors hover:opacity-80", style: { color: "rgba(255,255,255,0.6)" }, children: "About" }),
            /* @__PURE__ */ jsx(Link_default, { href: "/contact", className: "text-[11.5px] no-underline transition-colors hover:opacity-80", style: { color: "rgba(255,255,255,0.6)" }, children: "Contact" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "header",
      {
        className: `sticky top-0 z-50 transition-shadow duration-200 overflow-hidden ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "border-b"}`,
        style: { background: "var(--color-header-bg, #ffffff)", borderColor: "var(--color-header-border, #e5e7eb)", color: "var(--color-header-text, #0a0a0a)" },
        children: [
          /* @__PURE__ */ jsx("style", { children: `
                    @media (max-width: 1023px) {
                        .ml-header-row {
                            display: grid !important;
                            /* 4 explicit columns now: hamburger, logo
                               (flexible/centered), search toggle, dark
                               mode toggle. This was hardcoded to exactly
                               3 columns — adding the dark mode button
                               without updating this pushed it onto an
                               invisible second grid row (CSS Grid's
                               default auto-flow for anything beyond the
                               explicit columns), which a fixed-height
                               overflow-hidden container then clipped
                               entirely — also compressing the first row's
                               effective height, which is what shifted the
                               logo up. */
                            grid-template-columns: 40px 1fr 40px 40px;
                            align-items: center;
                        }
                        .ml-header-logo {
                            justify-self: center !important;
                        }
                    }
                ` }),
          /* @__PURE__ */ jsxs("div", { className: "ml-header-row px-3 sm:px-6 lg:px-10 h-[58px] sm:h-[72px] flex items-center gap-2 sm:gap-3 overflow-hidden", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "lg:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center border-none bg-transparent cursor-pointer text-[var(--color-header-text,#4b5563)]",
                onClick: () => {
                  setMobileOpen(!mobileOpen);
                  setSearchOpen(false);
                },
                children: mobileOpen ? /* @__PURE__ */ jsx(IconX, { size: 22 }) : /* @__PURE__ */ jsx(IconMenu, { size: 22 })
              }
            ),
            /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "ml-header-logo flex items-center gap-1.5 sm:gap-2 flex-shrink-0 no-underline min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "h-[38px] sm:h-[50px] flex-shrink-0 flex items-center justify-center overflow-hidden", style: { height: 38, maxHeight: 38 }, children: logoUrl ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: logoUrl,
                  alt: siteName,
                  className: "h-full w-auto max-w-[130px] sm:max-w-[200px] object-contain",
                  style: { height: "100%", maxHeight: 38, width: "auto", maxWidth: 130, objectFit: "contain", display: "block" }
                }
              ) : /* @__PURE__ */ jsx("span", { className: "font-manrope font-black text-xl sm:text-2xl", style: { color: "var(--color-primary)" }, children: siteName[0] }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[15px] sm:text-[19px] tracking-[1px] sm:tracking-[2px] leading-none truncate", style: { color: (settings == null ? void 0 : settings.header_title_color) || "var(--color-header-text, var(--color-dark-bg))" }, children: siteName }),
                tagline && /* @__PURE__ */ jsx("div", { className: "text-[8px] sm:text-[8px] tracking-[.15em] font-bold uppercase mt-0.5 truncate", style: { color: (settings == null ? void 0 : settings.header_subtitle_color) || "var(--color-primary)" }, children: tagline })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: doSearch,
                className: "hidden lg:flex flex-1 max-w-[500px] h-[44px] border-2 rounded-[12px] overflow-hidden transition-shadow",
                style: { borderColor: "var(--color-primary)" },
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search products, brands…",
                      className: "flex-1 border-none outline-none px-4 text-[13.5px] placeholder:text-gray-400",
                      style: { color: (settings == null ? void 0 : settings.search_text_color) || "var(--color-header-text, #1f2937)", background: "var(--color-header-bg, #ffffff)" }
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "submit",
                      className: "px-5 font-black text-[13px] flex items-center gap-2 flex-shrink-0 border-none cursor-pointer",
                      style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                      children: [
                        /* @__PURE__ */ jsx(IconSearch, { size: 16 }),
                        " Search"
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "lg:hidden w-8 h-8 flex items-center justify-center border-none bg-transparent cursor-pointer flex-shrink-0 text-[var(--color-header-text,#4b5563)]",
                onClick: () => {
                  setSearchOpen(!searchOpen);
                  setMobileOpen(false);
                },
                children: /* @__PURE__ */ jsx(IconSearch, { size: 20 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleDark,
                className: "lg:hidden w-8 h-8 flex items-center justify-center border-none bg-transparent cursor-pointer flex-shrink-0 text-[var(--color-header-text,#4b5563)]",
                title: darkMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
                children: darkMode === "dark" ? /* @__PURE__ */ jsx(IconSun, { size: 19 }) : /* @__PURE__ */ jsx(IconMoon, { size: 19 })
              }
            ),
            /* @__PURE__ */ jsxs(
              Link_default,
              {
                href: "/wishlist",
                className: "relative flex-shrink-0 w-10 h-10 hidden lg:flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-underline text-[var(--color-header-text,#4b5563)]",
                title: "My Wishlist",
                children: [
                  /* @__PURE__ */ jsx(IconHeart, { size: 21 }),
                  wishlistCount > 0 && /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white px-1",
                      style: { background: "var(--color-accent, #e91e63)" },
                      children: wishlistCount > 9 ? "9+" : wishlistCount
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(Link_default, { href: "/cart", className: "relative flex-shrink-0 w-10 h-10 hidden lg:flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors no-underline text-[var(--color-header-text,#4b5563)]", children: [
              /* @__PURE__ */ jsx(IconShoppingCart, { size: 21 }),
              cartCount > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  className: "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center text-white px-1",
                  style: { background: "var(--color-primary)" },
                  children: cartCount > 9 ? "9+" : cartCount
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: toggleDark,
                className: "flex-shrink-0 w-10 h-10 hidden lg:flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-[var(--color-header-text,#4b5563)]",
                title: darkMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
                children: darkMode === "dark" ? /* @__PURE__ */ jsx(IconSun, { size: 19 }) : /* @__PURE__ */ jsx(IconMoon, { size: 19 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-1 ml-1", children: [
              /* @__PURE__ */ jsxs(Link_default, { href: "/about", className: "flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-[var(--color-header-text,#4b5563)] hover:bg-gray-50 transition-all no-underline", children: [
                /* @__PURE__ */ jsx(IconInfoCircle, { size: 16 }),
                " About"
              ] }),
              /* @__PURE__ */ jsxs(Link_default, { href: "/contact", className: "flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-[var(--color-header-text,#4b5563)] hover:bg-gray-50 transition-all no-underline", children: [
                /* @__PURE__ */ jsx(IconMessageCircle, { size: 16 }),
                " Contact"
              ] }),
              (auth == null ? void 0 : auth.user) ? /* @__PURE__ */ jsxs(
                Link_default,
                {
                  href: "/account",
                  className: "flex items-center gap-2 h-[38px] pl-2 pr-3 rounded-[10px] text-[13px] font-semibold hover:bg-gray-50 transition-all no-underline",
                  style: { color: "var(--color-primary)" },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0",
                        style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
                        children: ((_d = (_c = auth.user.name) == null ? void 0 : _c[0]) == null ? void 0 : _d.toUpperCase()) ?? "A"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: (_e = auth.user.name) == null ? void 0 : _e.split(" ")[0] })
                  ]
                }
              ) : /* @__PURE__ */ jsxs(
                Link_default,
                {
                  href: "/login",
                  className: "flex items-center gap-1.5 h-[38px] px-3 rounded-[10px] text-[13px] font-semibold text-[var(--color-header-text,#4b5563)] hover:bg-gray-50 transition-all no-underline",
                  children: [
                    /* @__PURE__ */ jsx(IconUser, { size: 16 }),
                    " Login"
                  ]
                }
              )
            ] })
          ] }),
          searchOpen && /* @__PURE__ */ jsx("div", { className: "lg:hidden px-4 pb-3 border-t border-gray-100 pt-2", children: /* @__PURE__ */ jsxs("form", { onSubmit: doSearch, className: "flex border-2 rounded-xl overflow-hidden h-10", style: { borderColor: "var(--color-primary)" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search…",
                autoFocus: true,
                className: "flex-1 px-4 text-[13.5px] outline-none border-none",
                style: { color: (settings == null ? void 0 : settings.search_text_color) || "var(--color-header-text, #1f2937)", background: "var(--color-header-bg, #ffffff)" }
              }
            ),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: /* @__PURE__ */ jsx(IconSearch, { size: 17 }) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("nav", { className: "hidden lg:block bg-white border-b-2 border-gray-200 sticky top-[72px] z-40", ref: dropdownRef, children: /* @__PURE__ */ jsxs("div", { className: "px-6 lg:px-10 flex items-stretch h-[46px]", children: [
      navItems.map((link) => {
        var _a2;
        const hasChildren = (((_a2 = link.children) == null ? void 0 : _a2.length) ?? 0) > 0;
        const active = isActive(link);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative",
            onMouseEnter: () => hasChildren && setActiveDropdown(link.href),
            onMouseLeave: () => setActiveDropdown(null),
            children: [
              /* @__PURE__ */ jsxs(
                Link_default,
                {
                  href: link.href,
                  className: `flex items-center gap-1.5 px-4 h-[46px] text-[12.5px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border-b-2 mb-[-2px] no-underline
                                        ${active ? "" : "border-b-transparent hover:border-b-[var(--color-primary)] text-gray-600"}`,
                  style: { color: active ? "var(--color-primary)" : void 0, borderBottomColor: active ? "var(--color-primary)" : void 0 },
                  children: [
                    link.label,
                    hasChildren && /* @__PURE__ */ jsx(IconChevronDown, { size: 11, className: `transition-transform ${activeDropdown === link.href ? "rotate-180" : ""}` })
                  ]
                }
              ),
              hasChildren && activeDropdown === link.href && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 min-w-[180px] z-50", children: link.children.map((child) => /* @__PURE__ */ jsx(
                Link_default,
                {
                  href: child.href,
                  onClick: () => setActiveDropdown(null),
                  className: "flex items-center gap-2 px-4 py-2.5 text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 no-underline transition-colors",
                  style: { color: isActive(child) ? "var(--color-primary)" : void 0 },
                  children: child.label
                },
                child.href
              )) })
            ]
          },
          link.href
        );
      }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center py-1.5 flex-shrink-0", children: /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: "/contact",
          className: "flex items-center gap-2 h-[32px] px-4 border rounded-lg text-[12.5px] font-black hover:opacity-80 transition-all no-underline",
          style: { borderColor: "var(--color-primary)", color: "var(--color-primary)" },
          children: [
            /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full animate-pulse", style: { background: "var(--color-primary)" } }),
            " Expert Help"
          ]
        }
      ) })
    ] }) }),
    mobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 z-40 lg:hidden", onClick: () => setMobileOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 lg:hidden overflow-y-auto shadow-2xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 h-[60px] border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[18px] tracking-[2px]", style: { color: "var(--color-dark-bg)" }, children: siteName }),
          /* @__PURE__ */ jsx("button", { onClick: () => setMobileOpen(false), className: "text-gray-500 border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconX, { size: 22 }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "py-1", children: navItems.map((item) => /* @__PURE__ */ jsx(MobileNavItem, { item }, item.href)) }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-100 py-2", children: [
          /* @__PURE__ */ jsxs(Link_default, { href: "/about", onClick: () => setMobileOpen(false), className: "flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline", children: [
            /* @__PURE__ */ jsx(IconInfoCircle, { size: 18 }),
            " About Us"
          ] }),
          /* @__PURE__ */ jsxs(Link_default, { href: "/contact", onClick: () => setMobileOpen(false), className: "flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline", children: [
            /* @__PURE__ */ jsx(IconMessageCircle, { size: 18 }),
            " Contact Us"
          ] }),
          /* @__PURE__ */ jsxs(Link_default, { href: "/wishlist", onClick: () => setMobileOpen(false), className: "flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline", children: [
            /* @__PURE__ */ jsx(IconHeart, { size: 18 }),
            " Wishlist ",
            wishlistCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto text-[11px] font-black px-2 py-0.5 rounded-full text-white", style: { background: "var(--color-accent,#e91e63)" }, children: wishlistCount })
          ] }),
          /* @__PURE__ */ jsxs(Link_default, { href: "/cart", onClick: () => setMobileOpen(false), className: "flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 no-underline", children: [
            /* @__PURE__ */ jsx(IconShoppingCart, { size: 18 }),
            " Cart ",
            cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto text-[11px] font-black px-2 py-0.5 rounded-full text-white", style: { background: "var(--color-primary)" }, children: cartCount })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            toggleDark();
            setMobileOpen(false);
          }, className: "w-full flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-gray-700 border-none bg-transparent cursor-pointer text-left", children: [
            darkMode === "dark" ? /* @__PURE__ */ jsx(IconSun, { size: 18 }) : /* @__PURE__ */ jsx(IconMoon, { size: 18 }),
            " ",
            darkMode === "dark" ? "Light Mode" : "Dark Mode"
          ] })
        ] }),
        showWhatsapp && whatsapp && /* @__PURE__ */ jsx("div", { className: "px-5 py-4", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: `https://wa.me/${whatsapp}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-[14px] h-12 rounded-[13px] no-underline",
            children: [
              /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 20 }),
              " Chat on WhatsApp"
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 min-h-screen pb-14 lg:pb-0", children }),
    /* @__PURE__ */ jsxs("footer", { style: { background: "var(--color-dark-bg, #0a0a0a)", color: "white" }, children: [
      /* @__PURE__ */ jsx("div", { style: { borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "clamp(40px,6vw,64px) clamp(20px,5vw,48px)" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 8px" }, children: "EXCLUSIVE OFFERS" }),
          /* @__PURE__ */ jsx("h2", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: "clamp(22px,3vw,32px)", color: "white", margin: "0 0 8px", lineHeight: 1.1 }, children: "Stay in the Loop" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }, children: "New arrivals, exclusive deals & style tips. No spam, ever." })
        ] }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: (e) => {
              var _a2;
              e.preventDefault();
              const inp = e.currentTarget.querySelector("input");
              if (inp == null ? void 0 : inp.value) {
                fetch("/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": ((_a2 = document.querySelector("meta[name=csrf-token]")) == null ? void 0 : _a2.content) || "" }, body: JSON.stringify({ email: inp.value }) });
                inp.value = "";
                alert("Subscribed! Thank you.");
              }
            },
            style: { display: "flex", gap: 0, borderRadius: 100, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.15)", maxWidth: 440, width: "100%" },
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: "Enter your email address",
                  required: true,
                  style: { flex: 1, background: "rgba(255,255,255,0.06)", border: "none", padding: "14px 20px", color: "white", fontSize: 14, outline: "none", minWidth: 0 }
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)", border: "none", padding: "14px 24px", fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
                  children: "Subscribe →"
                }
              )
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "clamp(40px,5vw,56px) clamp(20px,5vw,48px) 32px", maxWidth: 1400, margin: "0 auto" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4", style: { gap: "clamp(24px,4vw,48px)", marginBottom: 40 }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Link_default, { href: "/", style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, textDecoration: "none" }, children: [
              logoUrl ? /* @__PURE__ */ jsx("img", { src: logoUrl, alt: siteName, style: { height: 40, width: "auto", maxWidth: 120, objectFit: "contain" } }) : /* @__PURE__ */ jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "var(--color-primary-text, #0a0a0a)", fontFamily: "Manrope, sans-serif" }, children: siteName[0] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", margin: 0, color: "white" }, children: [
                  siteName,
                  "."
                ] }),
                tagline && /* @__PURE__ */ jsx("p", { style: { fontSize: 10, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }, children: tagline })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 16 }, children: "Premium fashion and lifestyle products for those who know their worth." }),
            phone && /* @__PURE__ */ jsxs("a", { href: `tel:${phone}`, style: { fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }, children: [
              "📞 ",
              phone
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 10, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }, children: "QUICK LINKS" }),
            [["Home", "/"], ["Shop", "/shop"], ["New Arrivals", "/new-arrivals"], ["About", "/about"], ["Contact", "/contact"], ["Track Order", "/track-order"]].map(([l, h]) => /* @__PURE__ */ jsx(
              Link_default,
              {
                href: h,
                style: { display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" },
                onMouseEnter: (e) => e.currentTarget.style.color = "white",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)",
                children: l
              },
              l
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 10, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }, children: "SUPPORT" }),
            [["Support Center", "/support"], ["Returns & Exchange", "/pages/return-policy"], ["Track Your Order", "/track-order"], ["Shipping Info", "/pages/shipping-policy"], ["FAQ", "/support"], ["Contact Us", "/contact"]].map(([l, h]) => /* @__PURE__ */ jsx(
              Link_default,
              {
                href: h,
                style: { display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" },
                onMouseEnter: (e) => e.currentTarget.style.color = "white",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)",
                children: l
              },
              l
            ))
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 10, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }, children: "LEGAL" }),
            [["Privacy Policy", "/pages/privacy-policy"], ["Terms of Service", "/pages/terms"], ["Return Policy", "/pages/return-policy"], ["Shipping Policy", "/pages/shipping-policy"], ["Payment Policy", "/pages/payment-policy"]].map(([l, h]) => /* @__PURE__ */ jsx(
              Link_default,
              {
                href: h,
                style: { display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" },
                onMouseEnter: (e) => e.currentTarget.style.color = "white",
                onMouseLeave: (e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)",
                children: l
              },
              l
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs("p", { style: { fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }, children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " ",
            /* @__PURE__ */ jsx("strong", { style: { color: "rgba(255,255,255,0.5)" }, children: siteName }),
            " — All Rights Reserved."
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginRight: 4 }, children: "🔒 Secure Payments:" }),
            ["JazzCash", "Easypaisa", "Visa", "Mastercard", "PayFast", "COD"].map((b) => /* @__PURE__ */ jsx("span", { style: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }, children: b }, b))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "lg:hidden", style: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9970, background: "white", borderTop: "1.5px solid #E5E7EB", paddingBottom: "env(safe-area-inset-bottom, 0px)", boxShadow: "0 -2px 16px rgba(0,0,0,0.07)" }, children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", height: 56 }, children: [
      { href: "/", label: "Home", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { href: "/shop", label: "Shop", d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
      { href: "/cart", label: "Cart", d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", badge: cartCount },
      { href: "/wishlist", label: "Wishlist", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
      { href: (auth == null ? void 0 : auth.user) ? "/account" : "/login", label: (auth == null ? void 0 : auth.user) ? "Account" : "Login", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }
    ].map((item) => {
      const isActive2 = typeof window !== "undefined" && (window.location.pathname === item.href || item.href !== "/" && window.location.pathname.startsWith(item.href));
      return /* @__PURE__ */ jsxs(Link_default, { href: item.href, style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, textDecoration: "none", position: "relative", color: isActive2 ? "var(--color-primary)" : "#9CA3AF" }, children: [
        /* @__PURE__ */ jsx("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: item.d }) }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1 }, children: item.label }),
        isActive2 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, background: "var(--color-primary)", borderRadius: "2px 2px 0 0" } }),
        item.badge && item.badge > 0 ? /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 5, right: "calc(50% - 16px)", background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)", borderRadius: "50%", width: 14, height: 14, fontSize: 7.5, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid white" }, children: item.badge > 9 ? "9+" : item.badge }) : null
      ] }, item.href);
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "lg:hidden", style: { height: 56 } }),
    (() => {
      const wa = getFloatOffset(settings, "whatsapp", { chat: true, cart: true, whatsapp: false });
      if (!wa.enabled || !whatsapp) return null;
      const sidePx = wa.side;
      const posStyle = wa.corner === "left" ? { left: sidePx } : { right: sidePx };
      return /* @__PURE__ */ jsx(
        "a",
        {
          href: `https://wa.me/${whatsapp}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "fixed z-[9960] flex items-center justify-center bg-[#25D366] text-white rounded-full no-underline hover:scale-110 transition-transform",
          style: { bottom: wa.bottom, ...posStyle, width: wa.diameter, height: wa.diameter, animation: "wapulse 2.5s infinite", boxShadow: "0 4px 20px rgba(37,211,102,0.45)" },
          children: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: Math.round(wa.diameter * 0.48) })
        }
      );
    })(),
    !hideFloatingCart && /* @__PURE__ */ jsx(FloatingCart, { settings: settings ?? {} }),
    /* @__PURE__ */ jsx(ChatWidget, { settings: settings ?? {}, auth })
  ] });
}
export {
  StorefrontLayout as S
};
