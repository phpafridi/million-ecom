import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default } from "../ssr.js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { S as StorefrontLayout } from "./StorefrontLayout-BzEeKzY0.js";
import AccountSidebar from "./AccountSidebar-BdWTWjTn.js";
import { IconScissors, IconAlertCircle, IconMapPin, IconCalendar, IconCash, IconCircleCheck, IconPackage, IconClipboardCheck, IconX } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
const STATUS_COLOR = {
  pending: "bg-gray-50 text-gray-600 border-gray-200",
  received: "bg-gray-50 text-gray-600 border-gray-200",
  in_process: "bg-blue-50 text-blue-700 border-blue-200",
  ready: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
function StatusHero({ status }) {
  const configs = {
    pending: {
      bg: "#F3F4F6",
      ring: "#D1D5DB",
      icon: /* @__PURE__ */ jsx(motion.div, { animate: { opacity: [0.5, 1, 0.5] }, transition: { duration: 1.8, repeat: Infinity }, children: /* @__PURE__ */ jsx(IconClipboardCheck, { size: 30, color: "#6B7280" }) })
    },
    received: {
      bg: "#F3F4F6",
      ring: "#D1D5DB",
      icon: /* @__PURE__ */ jsx(motion.div, { animate: { opacity: [0.5, 1, 0.5] }, transition: { duration: 1.8, repeat: Infinity }, children: /* @__PURE__ */ jsx(IconClipboardCheck, { size: 30, color: "#6B7280" }) })
    },
    in_process: {
      bg: "#EFF6FF",
      ring: "#BFDBFE",
      icon: /* @__PURE__ */ jsx(motion.div, { animate: { rotate: [0, -18, 18, 0] }, transition: { duration: 1.3, repeat: Infinity, ease: "easeInOut" }, children: /* @__PURE__ */ jsx(IconScissors, { size: 30, color: "#2563EB" }) })
    },
    ready: {
      bg: "#FAF5FF",
      ring: "#E9D5FF",
      icon: /* @__PURE__ */ jsx(motion.div, { animate: { y: [0, -5, 0] }, transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }, children: /* @__PURE__ */ jsx(IconPackage, { size: 30, color: "#9333EA" }) })
    },
    delivered: {
      bg: "#F0FDF4",
      ring: "#BBF7D0",
      icon: /* @__PURE__ */ jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", stiffness: 350, damping: 14 }, children: /* @__PURE__ */ jsx(IconCircleCheck, { size: 30, color: "#16A34A" }) })
    },
    cancelled: {
      bg: "#FEF2F2",
      ring: "#FECACA",
      icon: /* @__PURE__ */ jsx(IconX, { size: 30, color: "#DC2626" })
    }
  };
  const cfg = configs[status] ?? configs.pending;
  const isActive = status === "in_process" || status === "ready" || status === "pending" || status === "received";
  return /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", style: { width: 64, height: 64 }, children: [
    isActive && /* @__PURE__ */ jsx(
      motion.div,
      {
        animate: { scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] },
        transition: { duration: 2, repeat: Infinity, ease: "easeOut" },
        className: "absolute inset-0 rounded-full",
        style: { background: cfg.ring }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "relative w-full h-full rounded-full flex items-center justify-center border-2",
        style: { background: cfg.bg, borderColor: cfg.ring },
        children: cfg.icon
      }
    )
  ] });
}
function TailorOrders({ settings, auth }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [found, setFound] = useState(true);
  useEffect(() => {
    fetch("/api/tailor-status", { headers: { "Accept": "application/json" } }).then((res) => {
      if (!res.ok) throw new Error("failed");
      return res.json();
    }).then((data) => {
      setFound(data.found ?? false);
      setOrders(data.orders ?? []);
    }).catch(() => setError("Could not load your tailor orders right now. Please try again shortly.")).finally(() => setLoading(false));
  }, []);
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Tailor Orders" }),
    /* @__PURE__ */ jsxs("div", { className: "lg:flex max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 p-4 sm:p-6 lg:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-6", children: [
          /* @__PURE__ */ jsx(IconScissors, { size: 22, style: { color: "var(--color-primary)" } }),
          /* @__PURE__ */ jsx("h1", { className: "font-manrope font-black text-[22px] sm:text-[26px]", children: "Tailor Orders" })
        ] }),
        loading && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-400 text-[13px] py-10 justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" }),
          "Loading your tailor orders..."
        ] }),
        !loading && error && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
          /* @__PURE__ */ jsx(IconAlertCircle, { size: 32, className: "text-gray-300" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[13.5px] max-w-xs", children: error })
        ] }),
        !loading && !error && !found && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
          /* @__PURE__ */ jsx(IconScissors, { size: 32, className: "text-gray-300" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-semibold text-[14px]", children: "No tailor orders found" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[13px] max-w-xs", children: "Tailor orders placed at any Millionaire branch will show up here once matched to your account by phone or email." })
        ] }),
        !loading && !error && found && orders.length === 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-16 text-center", children: [
          /* @__PURE__ */ jsx(IconScissors, { size: 32, className: "text-gray-300" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[13.5px]", children: "You don't have any tailor orders yet." })
        ] }),
        !loading && !error && orders.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-4", children: orders.map((order) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
            /* @__PURE__ */ jsx(StatusHero, { status: order.status }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "font-bold text-[15px]", children: [
                  order.garment_type,
                  " × ",
                  order.quantity
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-gray-400 mt-0.5", children: [
                  "Order #",
                  order.order_number
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-3 py-1.5 rounded-full border ${STATUS_COLOR[order.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`, children: order.status_label })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-4", children: [
            /* @__PURE__ */ jsx(IconMapPin, { size: 14 }),
            order.franchise
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b border-gray-50", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1", children: "Ordered" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(IconCalendar, { size: 12 }),
                fmtDate(order.order_date)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1", children: "Promised" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(IconCalendar, { size: 12 }),
                fmtDate(order.promised_date)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1", children: "Ready" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(IconCalendar, { size: 12 }),
                fmtDate(order.ready_date)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1", children: "Delivered" }),
              /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(IconCalendar, { size: 12 }),
                fmtDate(order.delivered_date)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[12.5px] text-gray-500", children: [
              /* @__PURE__ */ jsx(IconCash, { size: 14 }),
              "Total ",
              fmt(order.total_price),
              " · Paid ",
              fmt(order.advance_paid)
            ] }),
            order.balance_due > 0 ? /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] font-bold text-red-600", children: [
              "Balance due: ",
              fmt(order.balance_due)
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-[12.5px] font-bold text-green-600", children: "Fully paid" })
          ] })
        ] }, order.order_number)) })
      ] })
    ] })
  ] });
}
export {
  TailorOrders as default
};
