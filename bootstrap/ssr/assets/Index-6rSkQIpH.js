import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, a as useForm } from "../ssr.js";
import { useState } from "react";
import { IconPlus, IconPencil, IconTrash, IconTag, IconX } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { C as ConfirmDeleteModal } from "./ConfirmDeleteModal-upZ6GLRW.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
function CouponForm({ coupon, onClose }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const { data, setData, post, put, processing, errors } = useForm({
    code: (coupon == null ? void 0 : coupon.code) ?? "",
    type: (coupon == null ? void 0 : coupon.type) ?? "percentage",
    value: (coupon == null ? void 0 : coupon.value) ?? "",
    min_order: (coupon == null ? void 0 : coupon.min_order) ?? "",
    max_discount: (coupon == null ? void 0 : coupon.max_discount) ?? "",
    usage_limit: (coupon == null ? void 0 : coupon.usage_limit) ?? "",
    per_user_limit: (coupon == null ? void 0 : coupon.per_user_limit) ?? "",
    is_active: (coupon == null ? void 0 : coupon.is_active) ?? true,
    expires_at: (coupon == null ? void 0 : coupon.expires_at) ? coupon.expires_at.substring(0, 10) : "",
    description: (coupon == null ? void 0 : coupon.description) ?? ""
  });
  const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white";
  function submit(e) {
    e.preventDefault();
    const opts = { onSuccess: onClose };
    coupon ? put(`${ap}/coupons/${coupon.id}`, opts) : post(`${ap}/coupons`, opts);
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-lg shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-100", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[17px]", children: coupon ? "Edit Coupon" : "Create Coupon" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "border-none bg-transparent cursor-pointer text-gray-400", children: /* @__PURE__ */ jsx(IconX, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Coupon Code *" }),
          /* @__PURE__ */ jsx("input", { value: data.code, onChange: (e) => setData("code", e.target.value.toUpperCase()), required: true, placeholder: "SAVE20", className: inputCls + " font-mono" }),
          errors.code && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.code })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Type *" }),
          /* @__PURE__ */ jsxs("select", { value: data.type, onChange: (e) => setData("type", e.target.value), className: inputCls, children: [
            /* @__PURE__ */ jsx("option", { value: "percentage", children: "Percentage (%) off" }),
            /* @__PURE__ */ jsx("option", { value: "fixed", children: "Fixed (Rs) off" }),
            /* @__PURE__ */ jsx("option", { value: "free_shipping", children: "Free Shipping" })
          ] })
        ] }),
        data.type !== "free_shipping" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: [
            data.type === "percentage" ? "Discount %" : "Discount Rs",
            " *"
          ] }),
          /* @__PURE__ */ jsx("input", { type: "number", value: data.value, onChange: (e) => setData("value", e.target.value), required: true, min: "0", placeholder: data.type === "percentage" ? "20" : "500", className: inputCls })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Min Order (Rs)" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: data.min_order, onChange: (e) => setData("min_order", e.target.value), min: "0", placeholder: "0", className: inputCls })
        ] }),
        data.type === "percentage" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Max Discount (Rs)" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: data.max_discount, onChange: (e) => setData("max_discount", e.target.value), min: "0", placeholder: "No limit", className: inputCls })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Usage Limit" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: data.usage_limit, onChange: (e) => setData("usage_limit", e.target.value), min: "1", placeholder: "Unlimited", className: inputCls }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Total times this code can be used, across all customers combined" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Limit Per Customer" }),
          /* @__PURE__ */ jsx("input", { type: "number", value: data.per_user_limit, onChange: (e) => setData("per_user_limit", e.target.value), min: "1", placeholder: "Unlimited", className: inputCls }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "How many times one customer can reuse this code (e.g. 1 = one-time-only per person)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Expires On" }),
          /* @__PURE__ */ jsx("input", { type: "date", value: data.expires_at, onChange: (e) => setData("expires_at", e.target.value), className: inputCls })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Description (optional)" }),
        /* @__PURE__ */ jsx("input", { value: data.description, onChange: (e) => setData("description", e.target.value), placeholder: "Summer sale discount", className: inputCls })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("is_active", !data.is_active),
            className: `relative w-11 h-6 rounded-full border-none cursor-pointer transition-all ${data.is_active ? "bg-[var(--color-primary)]" : "bg-gray-300"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.is_active ? "left-5" : "left-0.5"}` })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-700", children: "Active (customers can use this coupon)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex-1 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: processing ? "Saving…" : coupon ? "Update Coupon" : "Create Coupon"
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer", children: "Cancel" })
      ] })
    ] })
  ] }) });
}
function CouponsIndex({ coupons }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  function del(c) {
    setPendingDelete(c);
  }
  function confirmDelete() {
    if (!pendingDelete) return;
    router3.delete(`${ap}/coupons/${pendingDelete.id}`, { preserveScroll: true, onFinish: () => setPendingDelete(null) });
  }
  const typeLabel = (t) => ({ percentage: "% off", fixed: "Rs off", free_shipping: "Free Shipping" })[t] ?? t;
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Discount Coupons", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Coupons" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-500", children: [
        coupons.length,
        " coupons"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setEditing("new"),
          className: "flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
          children: [
            /* @__PURE__ */ jsx(IconPlus, { size: 17 }),
            " Create Coupon"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[700px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: ["Code", "Type", "Value", "Min Order", "Used", "Expires", "Status", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5", children: h }, h)) }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        coupons.map((c) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 group", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono font-black text-[13px]", style: { color: "var(--color-primary)" }, children: c.code }),
            c.description && /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400 mt-0.5", children: c.description })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-[12.5px] text-gray-600 capitalize", children: typeLabel(c.type) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-bold text-[13px]", children: c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? `Rs ${c.value}` : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-[12.5px] text-gray-600", children: c.min_order > 0 ? `Rs ${c.min_order}` : "Any" }),
          /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5 text-[12.5px] text-gray-600", children: [
            c.used_count,
            c.usage_limit ? `/${c.usage_limit}` : ""
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-[12.5px] text-gray-600", children: c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never" }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`, children: c.is_active ? "Active" : "Inactive" }) }),
          /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 ", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setEditing(c), className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all", children: /* @__PURE__ */ jsx(IconPencil, { size: 14 }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => del(c), className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-all", children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) })
          ] }) })
        ] }, c.id)),
        coupons.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 8, className: "px-5 py-16 text-center", children: [
          /* @__PURE__ */ jsx(IconTag, { size: 36, className: "text-gray-300 mx-auto mb-3" }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-[13px]", children: "No coupons yet. Create your first discount code." })
        ] }) })
      ] })
    ] }) }) }),
    editing && /* @__PURE__ */ jsx(CouponForm, { coupon: editing === "new" ? void 0 : editing, onClose: () => setEditing(null) }),
    /* @__PURE__ */ jsx(
      ConfirmDeleteModal,
      {
        open: !!pendingDelete,
        title: "Delete this coupon?",
        itemName: pendingDelete == null ? void 0 : pendingDelete.code,
        onConfirm: confirmDelete,
        onCancel: () => setPendingDelete(null)
      }
    )
  ] });
}
export {
  CouponsIndex as default
};
