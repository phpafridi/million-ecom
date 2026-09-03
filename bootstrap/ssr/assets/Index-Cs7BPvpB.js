import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { useState } from "react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@tabler/icons-react";
const SC = { requested: "#F59E0B", approved: "#3B82F6", received: "#8B5CF6", refunded: "#10B981", rejected: "#EF4444" };
const fmt = (n) => "Rs " + Number(n).toLocaleString("en-PK");
function ReturnsIndex({ returns, stats }) {
  const { props: __p } = usePage();
  const ap = `/${(__p == null ? void 0 : __p.adminPath) ?? "ml-admin"}`;
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ status: "", admin_notes: "", refund_amount: "", restock: false });
  function startEdit(r) {
    setEditing(r);
    setForm({ status: r.status, admin_notes: "", refund_amount: String(r.refund_amount || r.order_total || 0), restock: false });
  }
  function submit(e) {
    e.preventDefault();
    if (!editing) return;
    router3.patch(`${ap}/returns/${editing.id}`, form, { onSuccess: () => setEditing(null) });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Returns & Refunds", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Returns" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 mb-5", children: [{ l: "Requested", v: stats.requested, c: "#F59E0B" }, { l: "Approved", v: stats.approved, c: "#3B82F6" }, { l: "Refunded", v: stats.refunded, c: "#10B981" }, { l: "Total Refunded", v: fmt(stats.total_refunded), c: "#EF4444" }].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-black text-[22px]", style: { color: s.c }, children: s.v }),
      /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: s.l })
    ] }, s.l)) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-100", children: ["Return#", "Customer", "Order", "Reason", "Status", "Amount", "Date", ""].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide", children: h }, h)) }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-50", children: [
        returns.data.map((r) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-mono text-[12px] text-gray-500", children: r.return_number }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-4", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800", children: r.customer_name }),
            /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400", children: r.customer_email })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-4", children: [
            /* @__PURE__ */ jsxs("a", { href: `${ap}/orders/${r.order_id}`, className: "font-bold no-underline", style: { color: "var(--color-primary)" }, children: [
              "#",
              r.order_id
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400", children: fmt(r.order_total) })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4 max-w-[150px]", children: /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-800 truncate", children: r.reason }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black px-2.5 py-1 rounded-full text-white", style: { background: SC[r.status] || "#6B7280" }, children: r.status }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4 font-bold text-gray-800", children: r.refund_amount ? fmt(r.refund_amount) : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-gray-400 text-[12px]", children: new Date(r.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: !["refunded", "rejected"].includes(r.status) && /* @__PURE__ */ jsx("button", { onClick: () => startEdit(r), className: "text-[12px] font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 bg-white cursor-pointer hover:bg-gray-50", children: "Update" }) })
        ] }, r.id)),
        returns.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-5 py-12 text-center text-gray-400 font-bold", children: "No return requests yet" }) })
      ] })
    ] }) }),
    editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md p-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-black text-[17px] mb-1", children: [
        "Update Return ",
        editing.return_number
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-400 mb-5", children: [
        editing.customer_name,
        " · Order #",
        editing.order_id
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Status" }),
          /* @__PURE__ */ jsx("select", { className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none bg-white", value: form.status, onChange: (e) => setForm((f) => ({ ...f, status: e.target.value })), children: [["approved", "Approve"], ["rejected", "Reject"], ["received", "Mark Received"], ["refunded", "Refund Processed"]].map(([v, l]) => /* @__PURE__ */ jsx("option", { value: v, children: l }, v)) })
        ] }),
        form.status === "refunded" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Refund Amount" }),
          /* @__PURE__ */ jsx("input", { type: "number", className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none", value: form.refund_amount, onChange: (e) => setForm((f) => ({ ...f, refund_amount: e.target.value })) })
        ] }),
        form.status === "refunded" && /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-xl", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.restock, onChange: (e) => setForm((f) => ({ ...f, restock: e.target.checked })), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
          /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-700", children: "Restock this item (add quantity back to inventory)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Note to Customer" }),
          /* @__PURE__ */ jsx("textarea", { className: "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13.5px] outline-none resize-none", rows: 3, value: form.admin_notes, onChange: (e) => setForm((f) => ({ ...f, admin_notes: e.target.value })), placeholder: "Explain decision to customer..." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Save & Email Customer" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setEditing(null), className: "h-11 px-5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold cursor-pointer bg-white", children: "Cancel" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ReturnsIndex as default
};
