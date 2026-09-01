import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-Dg6pcwSH.js";
import { useState } from "react";
import { IconAlertTriangle, IconPlus, IconCheck, IconX, IconShield, IconBan } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function BlockedIps({ ips, suspicious, stats, filters }) {
  var _a, _b;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ip: "", reason: "", hours: "" });
  const [search, setSearch] = useState((filters == null ? void 0 : filters.search) ?? "");
  function apply(params) {
    router3.get(window.location.pathname, { ...filters, ...params }, { preserveState: true });
  }
  function addIp() {
    if (!form.ip || !form.reason) return;
    router3.post(window.location.pathname, form, {
      onSuccess: () => {
        setShowAdd(false);
        setForm({ ip: "", reason: "", hours: "" });
      },
      preserveScroll: true
    });
  }
  const typeColor = (t) => ({
    ddos: { bg: "#FEF2F2", color: "#DC2626" },
    spam: { bg: "#FFFBEB", color: "#D97706" },
    manual: { bg: "#EDE9FE", color: "#7C3AED" },
    auto: { bg: "#FEF2F2", color: "#DC2626" }
  })[t] ?? { bg: "#F3F4F6", color: "#6B7280" };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "IP Firewall", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "IP Firewall" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5", children: [
      { label: "Total Blocked", val: stats.total, color: "#374151" },
      { label: "Active Blocks", val: stats.active, color: "#DC2626" },
      { label: "DDoS", val: stats.ddos, color: "#DC2626" },
      { label: "Spam", val: stats.spam, color: "#D97706" },
      { label: "Manual", val: stats.manual, color: "#7C3AED" }
    ].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[22px] font-black", style: { color: s.color }, children: s.val }),
      /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500 mt-0.5", children: s.label })
    ] }, s.label)) }),
    suspicious.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx(IconAlertTriangle, { size: 17, className: "text-amber-600" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-amber-700 text-[14px]", children: "Suspicious IPs (multiple failed logins — not yet blocked)" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: suspicious.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "font-mono text-[12px] font-semibold", children: s.ip_address }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-amber-600", children: [
          s.attempts,
          " attempts"
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => router3.post(window.location.pathname, { ip: s.ip_address, reason: `Auto: ${s.attempts} failed logins`, hours: 24 }, { preserveScroll: true }),
            className: "text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded cursor-pointer border-none",
            children: "Block 24h"
          }
        )
      ] }, s.ip_address)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "Search IP/Reason" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-48",
              placeholder: "192.168.1.1",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && apply({ search })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "Type" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px]",
              value: (filters == null ? void 0 : filters.type) ?? "all",
              onChange: (e) => apply({ type: e.target.value }),
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All Types" }),
                /* @__PURE__ */ jsx("option", { value: "ddos", children: "DDoS" }),
                /* @__PURE__ */ jsx("option", { value: "spam", children: "Spam" }),
                /* @__PURE__ */ jsx("option", { value: "manual", children: "Manual" }),
                /* @__PURE__ */ jsx("option", { value: "auto", children: "Auto" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "Status" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px]",
              value: (filters == null ? void 0 : filters.status) ?? "all",
              onChange: (e) => apply({ status: e.target.value }),
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All" }),
                /* @__PURE__ */ jsx("option", { value: "active", children: "Active" }),
                /* @__PURE__ */ jsx("option", { value: "inactive", children: "Inactive" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowAdd(true),
          className: "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] border-none cursor-pointer",
          style: { background: "var(--color-primary,#C9A84C)", color: "var(--color-primary-text,#0a0a0a)" },
          children: [
            /* @__PURE__ */ jsx(IconPlus, { size: 15 }),
            " Block IP"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
        /* @__PURE__ */ jsx("thead", { style: { background: "#0a0a0a" }, children: /* @__PURE__ */ jsx("tr", { children: ["IP Address", "Reason", "Type", "Status", "Blocked By", "Expires", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", style: { color: "#C9A84C" }, children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: (_a = ips.data) == null ? void 0 : _a.map((b) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono font-semibold text-gray-800", children: b.ip }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600 max-w-[160px] truncate", children: b.reason }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-2 py-0.5 rounded-full text-[10px] font-bold",
              style: typeColor(b.type),
              children: b.type
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_active ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`, children: b.is_active ? "Blocked" : "Inactive" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-500", children: b.blocked_by }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-[11px] text-gray-400", children: b.expires_at }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: b.is_active ? /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => router3.patch(`${window.location.pathname}/${b.ip}/unblock`, {}, { preserveScroll: true }),
              className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer bg-green-50 text-green-700",
              children: [
                /* @__PURE__ */ jsx(IconCheck, { size: 12 }),
                " Unblock"
              ]
            }
          ) : /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => router3.delete(`${window.location.pathname}/${b.id}`, { preserveScroll: true }),
              className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer bg-red-50 text-red-600",
              children: [
                /* @__PURE__ */ jsx(IconX, { size: 12 }),
                " Remove"
              ]
            }
          ) }) })
        ] }, b.id)) })
      ] }),
      !((_b = ips.data) == null ? void 0 : _b.length) && /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
        /* @__PURE__ */ jsx(IconShield, { size: 40, className: "mx-auto mb-3 text-gray-300" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[14px]", children: "No blocked IPs. Your firewall is clean." })
      ] })
    ] }),
    showAdd && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-40", onClick: () => setShowAdd(false) }),
      /* @__PURE__ */ jsxs("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-black text-[16px] flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(IconBan, { size: 18 }),
            " Block IP Address"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setShowAdd(false), className: "text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconX, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-gray-600 block mb-1.5", children: "IP Address *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-mono outline-none focus:border-red-400",
                placeholder: "192.168.1.1",
                value: form.ip,
                onChange: (e) => setForm({ ...form, ip: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-gray-600 block mb-1.5", children: "Reason *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-red-400",
                placeholder: "e.g. Spamming contact form, DDoS attack",
                value: form.reason,
                onChange: (e) => setForm({ ...form, reason: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-[12px] font-bold text-gray-600 block mb-1.5", children: "Duration (hours) — leave blank for permanent" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                className: "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-red-400",
                placeholder: "24 (blank = permanent)",
                value: form.hours,
                onChange: (e) => setForm({ ...form, hours: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-5", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: addIp,
              className: "flex-1 py-2.5 rounded-xl font-bold text-[13px] border-none cursor-pointer",
              style: { background: "#DC2626", color: "white" },
              children: [
                /* @__PURE__ */ jsx(IconBan, { size: 14, className: "inline mr-1.5" }),
                " Block IP"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowAdd(false),
              className: "flex-1 py-2.5 rounded-xl font-bold text-[13px] border border-gray-200 bg-white cursor-pointer text-gray-600",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  BlockedIps as default
};
