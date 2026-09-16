import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, L as Link_default } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { useState } from "react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
import "@tabler/icons-react";
const PC = { urgent: "#EF4444", high: "#F59E0B", normal: "#3B82F6", low: "#6B7280" };
const SC = { open: "#F59E0B", in_progress: "#3B82F6", resolved: "#10B981", closed: "#6B7280" };
function SupportIndex({ tickets, stats }) {
  const { props: __p } = usePage();
  const ap = `/${(__p == null ? void 0 : __p.adminPath) ?? "ml-admin"}`;
  const [search, setSearch] = useState("");
  function changeStatus(id, status) {
    router3.patch(`${ap}/support/${id}`, { status }, { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Support Tickets", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Support Tickets" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 mb-5", children: [{ l: "Open", v: stats.open, c: "#F59E0B", i: "📬" }, { l: "In Progress", v: stats.in_progress, c: "#3B82F6", i: "⚙️" }, { l: "Resolved", v: stats.resolved, c: "#10B981", i: "✅" }, { l: "Urgent", v: stats.urgent, c: "#EF4444", i: "🚨" }].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl mb-1", children: s.i }),
      /* @__PURE__ */ jsx("p", { className: "font-black text-[24px]", style: { color: s.c }, children: s.v }),
      /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: s.l })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 flex gap-3", children: [
        /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), onKeyDown: (e) => e.key === "Enter" && router3.get(`${ap}/support`, { search }, { preserveState: true }), placeholder: "Search by subject, email, ticket#...", className: "flex-1 h-10 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]" }),
        /* @__PURE__ */ jsx("button", { onClick: () => router3.get(`${ap}/support`, { search }, { preserveState: true }), className: "h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer text-white", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Search" })
      ] }),
      /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-100", children: ["Ticket", "Customer", "Subject", "Priority", "Status", "Date", ""].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide", children: h }, h)) }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-50", children: [
          tickets.data.map((t) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-mono text-[12px] text-gray-500", children: t.ticket_number }),
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-4", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800", children: t.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400", children: t.email })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 max-w-[180px]", children: /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 truncate", children: t.subject }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black px-2.5 py-1 rounded-full text-white", style: { background: PC[t.priority] || "#6B7280" }, children: t.priority }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("select", { value: t.status, onChange: (e) => changeStatus(t.id, e.target.value), className: "text-[12px] font-bold px-3 py-1 rounded-lg border-none cursor-pointer", style: { background: (SC[t.status] || "#6B7280") + "20", color: SC[t.status] || "#6B7280" }, children: ["open", "in_progress", "resolved", "closed"].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s.replace("_", " ") }, s)) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-gray-400 text-[12px]", children: new Date(t.created_at).toLocaleDateString() }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx(Link_default, { href: `${ap}/support/${t.id}`, className: "text-[12px] font-bold no-underline px-3 py-1.5 rounded-lg", style: { color: "var(--color-primary)", background: "var(--color-primary)10" }, children: "Reply →" }) })
          ] }, t.id)),
          tickets.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-5 py-12 text-center text-gray-400 font-bold", children: "No tickets yet" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  SupportIndex as default
};
