import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { IconArrowLeft, IconSend } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
function SupportShow({ ticket, replies }) {
  const { props: __p } = usePage();
  const ap = `/${(__p == null ? void 0 : __p.adminPath) ?? "ml-admin"}`;
  const { data, setData, post, processing, reset } = useForm({ message: "" });
  function send(e) {
    e.preventDefault();
    post(`${ap}/support/${ticket.id}/reply`, { onSuccess: () => reset() });
  }
  const PC = { urgent: "#EF4444", high: "#F59E0B", normal: "#3B82F6", low: "#6B7280" };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: `Ticket #${ticket.ticket_number}`, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `Support — ${ticket.ticket_number}` }),
    /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs("button", { onClick: () => router3.visit(`${ap}/support`), className: "flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer", children: [
      /* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }),
      " Back to Tickets"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsx("p", { className: "font-black text-[15px] text-gray-800", children: ticket.subject }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black px-2.5 py-1 rounded-full text-white", style: { background: PC[ticket.priority] || "#6B7280" }, children: ticket.priority })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-gray-600 leading-relaxed whitespace-pre-line", children: ticket.message }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-3", children: new Date(ticket.created_at).toLocaleString() })
        ] }),
        replies.map((r) => /* @__PURE__ */ jsxs("div", { className: `rounded-2xl border p-4 ${r.is_staff ? "border-blue-100 bg-blue-50" : "bg-white border-gray-100"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: `text-[11px] font-black px-2 py-0.5 rounded-full ${r.is_staff ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`, children: r.is_staff ? "Staff: " + r.replier_name : "Customer" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: new Date(r.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-gray-700 whitespace-pre-line", children: r.message })
        ] }, r.id)),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-gray-800 mb-3", children: "Reply to Customer" }),
          /* @__PURE__ */ jsxs("form", { onSubmit: send, className: "space-y-3", children: [
            /* @__PURE__ */ jsx("textarea", { className: "w-full px-4 py-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none", rows: 5, value: data.message, onChange: (e) => setData("message", e.target.value), required: true, placeholder: "Type your reply... Customer will receive this via email." }),
            /* @__PURE__ */ jsxs("button", { type: "submit", disabled: processing, className: "flex items-center gap-2 h-11 px-6 rounded-xl font-bold text-[13px] border-none cursor-pointer disabled:opacity-60", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: [
              /* @__PURE__ */ jsx(IconSend, { size: 15 }),
              " ",
              processing ? "Sending..." : "Send Reply & Email"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-black text-[13px] text-gray-500 uppercase tracking-wide mb-3", children: "Ticket Info" }),
        [["Ticket#", ticket.ticket_number], ["From", ticket.name], ["Email", ticket.email], ["Phone", ticket.phone || "—"], ["Status", ticket.status], ["Priority", ticket.priority], ["Created", new Date(ticket.created_at).toLocaleDateString()]].map(([l, v]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-[13px]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-semibold", children: l }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800", children: v })
        ] }, l)),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Update Status" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white",
              defaultValue: ticket.status,
              onChange: (e) => router3.patch(`${ap}/support/${ticket.id}`, { status: e.target.value }, { preserveScroll: true }),
              children: ["open", "in_progress", "resolved", "closed"].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s.replace("_", " ") }, s))
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  SupportShow as default
};
