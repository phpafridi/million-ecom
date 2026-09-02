import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconSearch, IconEye, IconPhone, IconMail, IconMapPin, IconTruck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DNtREoCY.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const STATUS_COLOR = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
const PAY_COLOR = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-gray-100 text-gray-600"
};
function OrderLookup({ results, query }) {
  var _a, _b, _c, _d;
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const perms = (_b = (_a = pageProps.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.permissions;
  const canViewFull = ((_d = (_c = pageProps.auth) == null ? void 0 : _c.user) == null ? void 0 : _d.role) !== "staff" || !Array.isArray(perms) || perms.includes("orders");
  const [q, setQ] = useState(query ?? "");
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  function search(e) {
    e.preventDefault();
    router3.get(`${ap}/orders/lookup`, { q }, { preserveState: true });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Order Lookup", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Order Lookup" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-black text-[22px] mb-1", children: "🔍 Order Lookup" }),
      /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-gray-500", children: "Search any order by order number, customer name, phone, courier, or tracking number — full details shown immediately, no clicking through required." })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: search, className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "relative max-w-xl", children: [
      /* @__PURE__ */ jsx(IconSearch, { size: 18, className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          autoFocus: true,
          value: q,
          onChange: (e) => setQ(e.target.value),
          placeholder: "Order #, name, phone, courier, or tracking number…",
          className: "w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-2xl text-[14px] outline-none focus:border-[var(--color-primary)] bg-white"
        }
      )
    ] }) }),
    query && results.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 text-gray-400", children: [
      /* @__PURE__ */ jsx(IconSearch, { size: 40, className: "mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
        'No orders matched "',
        query,
        '"'
      ] })
    ] }),
    !query && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 text-gray-400", children: [
      /* @__PURE__ */ jsx(IconSearch, { size: 40, className: "mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Type above to search — results appear instantly" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: results.map((order) => {
      var _a2;
      return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-black text-[16px]", children: [
                "Order #",
                order.order_number ?? order.id
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLOR[order.status] || ""}`, children: order.status }),
              /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${PAY_COLOR[order.payment_status] || ""}`, children: order.payment_status }),
              ((_a2 = order.returns) == null ? void 0 : _a2.length) > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700", children: [
                "Return: ",
                order.returns[0].status
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: new Date(order.created_at).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" }) })
          ] }),
          canViewFull && /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: `${ap}/orders/${order.id}`,
              className: "flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12.5px] font-bold no-underline border-2 border-gray-200 text-gray-700 hover:border-[var(--color-primary)]",
              children: [
                /* @__PURE__ */ jsx(IconEye, { size: 14 }),
                " Full Details"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Customer" }),
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold text-gray-800", children: order.customer_name }),
            /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-gray-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IconPhone, { size: 11 }),
              " ",
              order.customer_phone
            ] }),
            order.customer_email && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-gray-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IconMail, { size: 11 }),
              " ",
              order.customer_email
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Delivery Address" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-gray-600 flex items-start gap-1", children: [
              /* @__PURE__ */ jsx(IconMapPin, { size: 12, className: "mt-0.5 flex-shrink-0" }),
              " ",
              order.customer_address,
              order.city ? `, ${order.city}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Shipping / Tracking" }),
            order.courier || order.tracking_number ? /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-gray-700 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IconTruck, { size: 13, className: "flex-shrink-0" }),
              order.courier && /* @__PURE__ */ jsx("span", { className: "font-semibold", children: order.courier }),
              order.tracking_number && /* @__PURE__ */ jsx("span", { className: "font-mono", children: order.tracking_number })
            ] }) : /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 italic", children: "Not set yet" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-1", children: "Payment" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-700 capitalize", children: order.payment_method }),
            /* @__PURE__ */ jsx("p", { className: "font-black text-[15px]", style: { color: "var(--color-primary)" }, children: fmt(order.total) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-gray-50", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[10.5px] font-bold text-gray-400 uppercase tracking-wide mb-2", children: [
            order.items.length,
            " Item(s)"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: order.items.map((item) => /* @__PURE__ */ jsxs("span", { className: "text-[12px] bg-gray-50 rounded-lg px-3 py-1.5", children: [
            item.product_name,
            item.variant_label && /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
              " (",
              item.variant_label,
              ")"
            ] }),
            " × ",
            item.quantity
          ] }, item.id)) })
        ] })
      ] }, order.id);
    }) })
  ] });
}
export {
  OrderLookup as default
};
