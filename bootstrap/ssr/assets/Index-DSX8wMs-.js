import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-Dg6pcwSH.js";
import { useState } from "react";
import { IconPlus, IconShield, IconCheck, IconX, IconEdit, IconTrash } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function StaffIndex({ staff, roles }) {
  const { props: __p } = usePage();
  const ap = `/${(__p == null ? void 0 : __p.adminPath) ?? "ml-admin"}`;
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", staff_role: "support" });
  const [eform, setEform] = useState({ name: "", staff_role: "support", is_active: true, password: "" });
  const inp = "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white";
  function add(e) {
    e.preventDefault();
    router3.post(`${ap}/staff`, form, { onSuccess: () => {
      setForm({ name: "", email: "", password: "", staff_role: "support" });
      setAdding(false);
    } });
  }
  function edit(e) {
    e.preventDefault();
    if (!editing) return;
    router3.put(`${ap}/staff/${editing.id}`, eform, { onSuccess: () => setEditing(null) });
  }
  function del(s) {
    if (!confirm(`Remove ${s.name}?`)) return;
    router3.delete(`${ap}/staff/${s.id}`);
  }
  function startEdit(s) {
    setEditing(s);
    setEform({ name: s.name, staff_role: s.staff_role || "support", is_active: s.is_active, password: "" });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Staff & Roles", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Staff" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-500", children: [
        staff.length,
        " team members"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setAdding(true), className: "flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: [
        /* @__PURE__ */ jsx(IconPlus, { size: 15 }),
        " Add Staff"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5", children: Object.entries(roles).map(([k, r]) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: { background: r.color } }),
        /* @__PURE__ */ jsx("span", { className: "font-black text-[13px]", children: r.label })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400", children: r.description })
    ] }, k)) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-100", children: ["Name", "Email", "Role", "Status", "Last Login", ""].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left px-5 py-3.5 text-[11px] font-black text-gray-400 uppercase tracking-wide", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: staff.map((s) => {
        var _a, _b, _c, _d;
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-[13px]", style: { background: s.role === "admin" ? "var(--color-primary)" : ((_a = roles[s.staff_role]) == null ? void 0 : _a.color) || "#6B7280" }, children: (_b = s.name[0]) == null ? void 0 : _b.toUpperCase() }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: s.name }),
              s.role === "admin" && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-amber-600", children: "Super Admin" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-gray-500", children: s.email }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: s.role === "admin" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full text-white w-fit", style: { background: "var(--color-primary)" }, children: [
            /* @__PURE__ */ jsx(IconShield, { size: 11 }),
            " Admin"
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black px-2.5 py-1 rounded-full text-white w-fit block", style: { background: ((_c = roles[s.staff_role]) == null ? void 0 : _c.color) || "#6B7280" }, children: ((_d = roles[s.staff_role]) == null ? void 0 : _d.label) || s.staff_role }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: /* @__PURE__ */ jsxs("span", { className: `flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${s.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`, children: [
            s.is_active ? /* @__PURE__ */ jsx(IconCheck, { size: 11 }) : /* @__PURE__ */ jsx(IconX, { size: 11 }),
            s.is_active ? "Active" : "Inactive"
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4 text-gray-400 text-[12px]", children: s.last_login_at ? new Date(s.last_login_at).toLocaleDateString() : "Never" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-4", children: s.role !== "admin" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => startEdit(s), className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer bg-white", children: /* @__PURE__ */ jsx(IconEdit, { size: 14 }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => del(s), className: "w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 cursor-pointer bg-white", children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) })
          ] }) })
        ] }, s.id);
      }) })
    ] }) }),
    adding && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-black text-[17px] mb-5", children: "Add Staff Member" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: add, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Name *" }),
          /* @__PURE__ */ jsx("input", { className: inp, value: form.name, onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Email *" }),
          /* @__PURE__ */ jsx("input", { type: "email", className: inp, value: form.email, onChange: (e) => setForm((f) => ({ ...f, email: e.target.value })), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Password *" }),
          /* @__PURE__ */ jsx("input", { type: "password", className: inp, value: form.password, onChange: (e) => setForm((f) => ({ ...f, password: e.target.value })), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Role *" }),
          /* @__PURE__ */ jsx("select", { className: inp, value: form.staff_role, onChange: (e) => setForm((f) => ({ ...f, staff_role: e.target.value })), children: Object.entries(roles).map(([k, r]) => /* @__PURE__ */ jsxs("option", { value: k, children: [
            r.label,
            " — ",
            r.description
          ] }, k)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "flex-1 h-11 rounded-xl font-bold text-[14px] border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Create" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setAdding(false), className: "h-11 px-5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 cursor-pointer bg-white", children: "Cancel" })
        ] })
      ] })
    ] }) }),
    editing && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-md p-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-black text-[17px] mb-5", children: [
        "Edit ",
        editing.name
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: edit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Name" }),
          /* @__PURE__ */ jsx("input", { className: inp, value: eform.name, onChange: (e) => setEform((f) => ({ ...f, name: e.target.value })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Role" }),
          /* @__PURE__ */ jsx("select", { className: inp, value: eform.staff_role, onChange: (e) => setEform((f) => ({ ...f, staff_role: e.target.value })), children: Object.entries(roles).map(([k, r]) => /* @__PURE__ */ jsx("option", { value: k, children: r.label }, k)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "New Password" }),
          /* @__PURE__ */ jsx("input", { type: "password", className: inp, value: eform.password, onChange: (e) => setEform((f) => ({ ...f, password: e.target.value })), placeholder: "Leave blank to keep" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", id: "ia", checked: eform.is_active, onChange: (e) => setEform((f) => ({ ...f, is_active: e.target.checked })), className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("label", { htmlFor: "ia", className: "text-[13.5px] font-semibold text-gray-700", children: "Account Active" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "flex-1 h-11 rounded-xl font-bold border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Save" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setEditing(null), className: "h-11 px-5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 cursor-pointer bg-white", children: "Cancel" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  StaffIndex as default
};
