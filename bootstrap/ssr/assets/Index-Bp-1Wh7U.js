import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-5pjq4ehf.js";
import { useState } from "react";
import { IconAlertTriangle, IconRefresh, IconTrash, IconX } from "@tabler/icons-react";
import { C as ConfirmDeleteModal } from "./ConfirmDeleteModal-upZ6GLRW.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function SystemLogs({ logs, suspicious, stats, filters, settings, auth }) {
  var _a, _b, _c, _d, _e;
  `/${((_c = (_b = (_a = window.__inertia) == null ? void 0 : _a.page) == null ? void 0 : _b.props) == null ? void 0 : _c.adminPath) ?? "ml-admin"}`;
  const [filter, setFilter] = useState(filters ?? {});
  const [selected, setSelected] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  function apply(key, val) {
    const f = { ...filter, [key]: val };
    setFilter(f);
    router3.get(window.location.pathname, f, { preserveState: true });
  }
  const severityColor = (s) => s === "danger" ? "#DC2626" : s === "warning" ? "#D97706" : "#059669";
  const severityBg = (s) => s === "danger" ? "#FEF2F2" : s === "warning" ? "#FFFBEB" : "#F0FDF4";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "System Logs", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "System Logs" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6", children: [
      { label: "Total Logs", val: stats.total, color: "#6B7280" },
      { label: "Danger (24h)", val: stats.danger, color: "#DC2626" },
      { label: "Warnings (24h)", val: stats.warnings, color: "#D97706" },
      { label: "Logins (24h)", val: stats.logins, color: "#059669" },
      { label: "Failed (24h)", val: stats.failed_logins, color: "#7C3AED" }
    ].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-4 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[22px] font-black", style: { color: s.color }, children: s.val }),
      /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-500 mt-0.5", children: s.label })
    ] }, s.label)) }),
    suspicious.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4 mb-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(IconAlertTriangle, { size: 18, className: "text-red-600" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-red-700 text-[14px]", children: "Suspicious Activity Detected — Multiple Failed Logins" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: suspicious.map((s) => /* @__PURE__ */ jsxs("span", { className: "text-[12px] bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold", children: [
        s.ip_address,
        " — ",
        s.attempts,
        " attempts"
      ] }, s.ip_address)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "Severity" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px]",
            value: filter.severity ?? "all",
            onChange: (e) => apply("severity", e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "all", children: "All" }),
              /* @__PURE__ */ jsx("option", { value: "info", children: "Info" }),
              /* @__PURE__ */ jsx("option", { value: "warning", children: "Warning" }),
              /* @__PURE__ */ jsx("option", { value: "danger", children: "Danger" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "Action" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-40",
            placeholder: "e.g. login.failed",
            value: filter.action ?? "",
            onChange: (e) => apply("action", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "User" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-36",
            placeholder: "Name",
            value: filter.user ?? "",
            onChange: (e) => apply("user", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "From" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px]",
            value: filter.from ?? "",
            onChange: (e) => apply("from", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold text-gray-500 uppercase block mb-1", children: "To" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            className: "border border-gray-200 rounded-lg px-3 py-2 text-[13px]",
            value: filter.to ?? "",
            onChange: (e) => apply("to", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setFilter({});
            router3.get(window.location.pathname);
          },
          className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer bg-white",
          children: [
            /* @__PURE__ */ jsx(IconRefresh, { size: 14 }),
            " Reset"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmClear(true), className: "flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px] hover:bg-red-100 cursor-pointer", children: [
        /* @__PURE__ */ jsx(IconTrash, { size: 14 }),
        " Clear Old Logs"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
        /* @__PURE__ */ jsx("thead", { style: { background: "#0a0a0a" }, children: /* @__PURE__ */ jsx("tr", { children: ["Time", "User", "Action", "Description", "IP", "Severity"].map((h) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", style: { color: "#C9A84C" }, children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: (_d = logs.data) == null ? void 0 : _d.map((log) => /* @__PURE__ */ jsxs(
          "tr",
          {
            onClick: () => setSelected(log),
            className: "hover:bg-gray-50 cursor-pointer transition-colors",
            children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap", children: log.created_at }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-800", children: log.user_name }),
                /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-400", children: log.user_role })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-[11px] text-gray-600", children: log.action }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600 max-w-[200px] truncate", children: log.description }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-[11px] text-gray-500", children: log.ip_address }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  style: { background: severityBg(log.severity), color: severityColor(log.severity) },
                  children: log.severity
                }
              ) })
            ]
          },
          log.id
        )) })
      ] }),
      !((_e = logs.data) == null ? void 0 : _e.length) && /* @__PURE__ */ jsx("div", { className: "py-12 text-center text-gray-400", children: "No logs found" })
    ] }),
    logs.last_page > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 mt-4", children: Array.from({ length: logs.last_page }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => router3.get(window.location.pathname, { ...filter, page: p }),
        className: "w-8 h-8 rounded-lg text-[13px] font-semibold border cursor-pointer",
        style: { background: p === logs.current_page ? "var(--color-primary)" : "white", color: p === logs.current_page ? "#0a0a0a" : "#374151", borderColor: "#E5E7EB" },
        children: p
      },
      p
    )) }),
    selected && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-40", onClick: () => setSelected(null) }),
      /* @__PURE__ */ jsxs("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] text-gray-800", children: "Log Detail" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setSelected(null), className: "text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconX, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-[13px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Time" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: selected.created_at })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "User" }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
              selected.user_name,
              " (",
              selected.user_role,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Action" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono bg-gray-100 px-2 py-0.5 rounded", children: selected.action })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "IP" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: selected.ip_address })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Description" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-gray-800", children: selected.description })
          ] }),
          selected.old_values && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Before" }),
            /* @__PURE__ */ jsx("pre", { className: "mt-1 bg-gray-50 rounded p-2 text-[11px] overflow-auto max-h-24", children: JSON.stringify(selected.old_values, null, 2) })
          ] }),
          selected.new_values && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "After" }),
            /* @__PURE__ */ jsx("pre", { className: "mt-1 bg-green-50 rounded p-2 text-[11px] overflow-auto max-h-24", children: JSON.stringify(selected.new_values, null, 2) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ConfirmDeleteModal,
      {
        open: confirmClear,
        title: "Clear logs older than 30 days?",
        onConfirm: () => {
          router3.delete(window.location.pathname + "/clear", { data: { days: 30 }, onFinish: () => setConfirmClear(false) });
        },
        onCancel: () => setConfirmClear(false)
      }
    )
  ] });
}
export {
  SystemLogs as default
};
