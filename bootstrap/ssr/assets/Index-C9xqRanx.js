import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconCheck, IconTrash, IconStar } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-5pjq4ehf.js";
import { C as ConfirmDeleteModal } from "./ConfirmDeleteModal-upZ6GLRW.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function Stars({ n }) {
  const { props: _sub } = usePage();
  `/${(_sub == null ? void 0 : _sub.adminPath) ?? "ml-admin"}`;
  return /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx(IconStar, { size: 13, className: i <= n ? "text-amber-400" : "text-gray-200", fill: i <= n ? "currentColor" : "none" }, i)) });
}
function ReviewsIndex({ reviews, stats }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  function approve(id) {
    router3.patch(`${ap}/reviews/${id}/approve`, {}, { preserveScroll: true });
  }
  const [pendingDelete, setPendingDelete] = useState(null);
  function del(id) {
    setPendingDelete(id);
  }
  function confirmDelete() {
    if (!pendingDelete) return;
    router3.delete(`${ap}/reviews/${pendingDelete}`, { preserveScroll: true, onFinish: () => setPendingDelete(null) });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Product Reviews", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Reviews" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-xl text-[12.5px] text-blue-800", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold mb-1", children: "⭐ How Reviews Work" }),
        /* @__PURE__ */ jsx("div", { children: "Customers submit reviews from product pages. Reviews are hidden until you approve them." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-green-50 border border-green-200 rounded-xl text-[12.5px] text-green-800", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold mb-1", children: "✓ To Approve" }),
        /* @__PURE__ */ jsx("div", { children: "Click the green ✓ checkmark on any pending review. It will appear on the product page immediately." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-xl text-[12.5px] text-red-800", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold mb-1", children: "🗑 To Delete" }),
        /* @__PURE__ */ jsx("div", { children: "Click the trash icon to permanently delete a review. This updates the product's star rating." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6", children: [
      { label: "Total Reviews", value: stats.total },
      { label: "Pending Approval", value: stats.pending, highlight: stats.pending > 0 },
      { label: "Approved", value: stats.approved },
      { label: "Avg Rating", value: stats.avg ? `${stats.avg} ★` : "N/A" }
    ].map((s) => /* @__PURE__ */ jsxs("div", { className: `bg-white rounded-2xl border p-4 ${s.highlight ? "border-amber-300" : "border-gray-100"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-500 font-semibold", children: s.label }),
      /* @__PURE__ */ jsx("div", { className: `font-manrope font-black text-[22px] mt-1 ${s.highlight ? "text-amber-600" : ""}`, style: !s.highlight ? { color: "var(--color-dark-bg)" } : {}, children: s.value })
    ] }, s.label)) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[700px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: ["Product", "Customer", "Rating", "Review", "Status", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5", children: h }, h)) }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        reviews.data.map((r) => {
          var _a;
          return /* @__PURE__ */ jsxs("tr", { className: `border-b border-gray-50 last:border-0 hover:bg-gray-50/50 group ${!r.is_approved ? "bg-amber-50/30" : ""}`, children: [
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("div", { className: "font-semibold text-[12.5px] text-gray-900 max-w-[150px] truncate", children: (_a = r.product) == null ? void 0 : _a.name }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13px] text-gray-900", children: r.name }),
              r.email && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: r.email })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx(Stars, { n: r.rating }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5 max-w-[200px]", children: [
              r.title && /* @__PURE__ */ jsx("div", { className: "font-semibold text-[12.5px] text-gray-900", children: r.title }),
              r.body && /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-500 truncate", children: r.body })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${r.is_approved ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`, children: r.is_approved ? "Approved" : "Pending" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 ", children: [
              !r.is_approved && /* @__PURE__ */ jsx("button", { onClick: () => approve(r.id), title: "Approve", className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-green-500 bg-white cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all", children: /* @__PURE__ */ jsx(IconCheck, { size: 14 }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => del(r.id), className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-all", children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) })
            ] }) })
          ] }, r.id);
        }),
        reviews.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-5 py-16 text-center text-gray-400 text-[13px]", children: "No reviews yet." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      ConfirmDeleteModal,
      {
        open: !!pendingDelete,
        title: "Delete this review?",
        onConfirm: confirmDelete,
        onCancel: () => setPendingDelete(null)
      }
    )
  ] });
}
export {
  ReviewsIndex as default
};
