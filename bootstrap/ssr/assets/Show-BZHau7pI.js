import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconArrowLeft, IconRefresh, IconPhone, IconMail, IconMapPin, IconCreditCard } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const STATUS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAY_STATUS = ["pending", "paid", "failed", "refunded"];
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
function OrderShow({ order }) {
  var _a, _b;
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const [showReturn, setShowReturn] = useState(false);
  const [courier, setCourier] = useState(order.courier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number ?? "");
  const [savingTracking, setSavingTracking] = useState(false);
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const { data: retData, setData: setRetData, post: postReturn, processing: retProcessing } = useForm({
    order_item_id: ((_a = order.items[0]) == null ? void 0 : _a.id) ?? "",
    quantity: 1,
    reason: "",
    notes: "",
    refund_method: "original",
    refund_amount: 0,
    restock: true
  });
  function updateStatus(field, value) {
    router3.patch(`${ap}/orders/${order.id}`, { [field]: value }, { preserveScroll: true });
  }
  function saveTracking() {
    setSavingTracking(true);
    router3.patch(`${ap}/orders/${order.id}`, { courier, tracking_number: trackingNumber }, {
      preserveScroll: true,
      onFinish: () => setSavingTracking(false)
    });
  }
  function submitReturn(e) {
    e.preventDefault();
    postReturn(`${ap}/orders/${order.id}/return`, { onSuccess: () => setShowReturn(false) });
  }
  function onItemChange(itemId) {
    setRetData("order_item_id", itemId);
    const item = order.items.find((i) => i.id === +itemId);
    if (item) setRetData("refund_amount", item.price * retData.quantity);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: order.order_number ?? order.order_number ?? `Order #${order.id}`, children: [
    /* @__PURE__ */ jsx(Head_default, { title: order.order_number ?? order.order_number ?? `Order #${order.id}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxs(Link_default, { href: `${ap}/orders`, className: "flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline", children: [
        /* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }),
        " All Orders"
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${ap}/orders/${order.id}/invoice`,
          target: "_blank",
          className: "ml-auto flex items-center gap-2 h-9 px-4 border border-gray-200 rounded-xl text-[12.5px] font-bold text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] no-underline bg-white transition-colors",
          children: "🖨️ Invoice / Print"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: `ml-auto text-[12px] font-bold px-3 py-1.5 rounded-full border capitalize ${STATUS_COLORS[order.status]}`, children: order.status }),
      order.return_status && /* @__PURE__ */ jsx("span", { className: "text-[12px] font-bold px-3 py-1.5 rounded-full border bg-orange-50 text-orange-600 border-orange-200", children: order.return_status })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Order Items" }),
            /* @__PURE__ */ jsxs("span", { className: "text-[12px] text-gray-400", children: [
              order.items.length,
              " item(s)"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: ["Product", "Qty", "Unit Price", "Subtotal"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase px-5 py-3", children: h }, h)) }) }),
            /* @__PURE__ */ jsx("tbody", { children: order.items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-50 last:border-0", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-5 py-3.5 font-medium text-[13px] text-gray-900", children: [
                item.product_name,
                item.variant_label && /* @__PURE__ */ jsx("span", { className: "block text-[11.5px] font-normal text-gray-500 mt-0.5", children: item.variant_label })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-[13px] text-gray-600", children: item.quantity }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 text-[13px] text-gray-600", children: fmt(item.price) }),
              /* @__PURE__ */ jsx("td", { className: "px-5 py-3.5 font-semibold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: fmt(item.subtotal) })
            ] }, item.id)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-t border-gray-100 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13px] text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { children: fmt(order.subtotal) })
            ] }),
            order.discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13px] text-green-600 font-semibold", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Discount",
                order.coupon_code ? ` (${order.coupon_code})` : ""
              ] }),
              /* @__PURE__ */ jsxs("span", { children: [
                "-",
                fmt(order.discount)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13px] text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Shipping" }),
              /* @__PURE__ */ jsx("span", { children: order.shipping > 0 ? fmt(order.shipping) : "Free" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[15px] font-black pt-2 border-t border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: fmt(order.total) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-4", children: "Update Status" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2", children: "Order Status" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: STATUS.map((s) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => updateStatus("status", s),
                  className: `px-4 py-2 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer capitalize
                                                ${order.status === s ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`,
                  style: order.status === s ? { background: "var(--color-primary)" } : {},
                  children: [
                    order.status === s && "✓ ",
                    s
                  ]
                },
                s
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2", children: "Payment Status" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: PAY_STATUS.map((s) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => updateStatus("payment_status", s),
                  className: `px-4 py-2 rounded-xl text-[12.5px] font-semibold border transition-all cursor-pointer capitalize
                                                ${order.payment_status === s ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`,
                  style: order.payment_status === s ? { background: "var(--color-primary)" } : {},
                  children: [
                    order.payment_status === s && "✓ ",
                    s
                  ]
                },
                s
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2", children: "Shipping / Tracking" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-gray-400 mb-1", children: "Courier Company" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: courier,
                      onChange: (e) => setCourier(e.target.value),
                      placeholder: "e.g. TCS, Leopards, M&P",
                      className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold text-gray-400 mb-1", children: "Tracking Number" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: trackingNumber,
                      onChange: (e) => setTrackingNumber(e.target.value),
                      placeholder: "Consignment / tracking ID",
                      className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)]"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: saveTracking,
                  disabled: savingTracking,
                  className: "mt-3 h-9 px-5 rounded-xl text-[12.5px] font-bold border-none cursor-pointer disabled:opacity-60",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: savingTracking ? "Saving…" : "✓ Save Tracking Info"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[15px] flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(IconRefresh, { size: 17, style: { color: "var(--color-primary)" } }),
              " Returns & Refunds"
            ] }),
            order.status === "delivered" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setShowReturn(!showReturn),
                className: "h-9 px-4 text-[12.5px] font-bold rounded-xl border-2 cursor-pointer transition-all bg-white",
                style: { borderColor: "var(--color-primary)", color: "var(--color-primary)" },
                children: showReturn ? "Cancel" : "+ Process Return"
              }
            )
          ] }),
          showReturn && /* @__PURE__ */ jsxs("form", { onSubmit: submitReturn, className: "mb-5 p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-[14px] text-orange-800", children: "Process Return" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: "Item to Return" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: retData.order_item_id,
                    onChange: (e) => onItemChange(e.target.value),
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white",
                    children: order.items.map((i) => /* @__PURE__ */ jsx("option", { value: i.id, children: i.product_name }, i.id))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: "Quantity" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: retData.quantity,
                    min: "1",
                    onChange: (e) => {
                      setRetData("quantity", +e.target.value);
                      const item = order.items.find((i) => i.id === +retData.order_item_id);
                      if (item) setRetData("refund_amount", item.price * +e.target.value);
                    },
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: "Reason" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: retData.reason,
                    onChange: (e) => setRetData("reason", e.target.value),
                    required: true,
                    placeholder: "Damaged, wrong item, size issue…",
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: "Refund Method" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: retData.refund_method,
                    onChange: (e) => setRetData("refund_method", e.target.value),
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "original", children: "Original Payment Method" }),
                      /* @__PURE__ */ jsx("option", { value: "cash", children: "Cash Refund" }),
                      /* @__PURE__ */ jsx("option", { value: "store_credit", children: "Store Credit" }),
                      /* @__PURE__ */ jsx("option", { value: "none", children: "No Refund" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: "Refund Amount (Rs)" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: retData.refund_amount,
                    min: "0",
                    onChange: (e) => setRetData("refund_amount", +e.target.value),
                    className: "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pt-4", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: retData.restock, onChange: (e) => setRetData("restock", e.target.checked), className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-700", children: "Return to inventory" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-semibold text-gray-700 mb-1", children: "Internal Notes" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: retData.notes,
                  onChange: (e) => setRetData("notes", e.target.value),
                  rows: 2,
                  className: "w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] outline-none resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: retProcessing,
                className: "h-10 px-6 font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60 text-white",
                style: { background: "#f97316" },
                children: retProcessing ? "Processing…" : "Confirm Return & Refund"
              }
            )
          ] }),
          order.returns.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: order.returns.map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-3 bg-gray-50 rounded-xl text-[12.5px]", children: [
            /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700", children: r.status }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: r.reason }),
            /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
              r.quantity,
              " unit(s)"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold ml-auto", style: { color: "var(--color-primary)" }, children: [
              "Rs ",
              r.refund_amount.toLocaleString(),
              " refund"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: new Date(r.created_at).toLocaleDateString() })
          ] }, r.id)) }) : /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-400", children: [
            "No returns for this order.",
            order.status !== "delivered" ? " Returns can be processed once order is delivered." : ""
          ] })
        ] }),
        order.notes && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[12px] font-black text-amber-700 uppercase tracking-wider mb-1", children: "Notes" }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px] text-amber-800", children: order.notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-4", children: "Customer" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-9 h-9 rounded-full flex items-center justify-center font-black text-[14px] text-white",
                  style: { background: "var(--color-primary)" },
                  children: (_b = order.customer_name[0]) == null ? void 0 : _b.toUpperCase()
                }
              ),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13.5px]", children: order.customer_name }) })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${order.customer_phone}`, className: "flex items-center gap-2.5 text-[13px] text-gray-600 hover:text-[var(--color-primary)] no-underline", children: [
              /* @__PURE__ */ jsx(IconPhone, { size: 15, className: "text-gray-400" }),
              " ",
              order.customer_phone
            ] }),
            order.customer_email && /* @__PURE__ */ jsxs("a", { href: `mailto:${order.customer_email}`, className: "flex items-center gap-2.5 text-[13px] text-gray-600 no-underline", children: [
              /* @__PURE__ */ jsx(IconMail, { size: 15, className: "text-gray-400" }),
              " ",
              order.customer_email
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 text-[13px] text-gray-600", children: [
              /* @__PURE__ */ jsx(IconMapPin, { size: 15, className: "text-gray-400 mt-0.5 flex-shrink-0" }),
              " ",
              order.customer_address
            ] }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/${order.customer_phone}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-[#25D366] text-white font-bold text-[13px] no-underline hover:bg-[#1da853] transition-colors",
                children: "💬 WhatsApp Customer"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-3", children: "Payment" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-3", children: [
            /* @__PURE__ */ jsx(IconCreditCard, { size: 18, className: "text-gray-400" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold capitalize", children: order.payment_method.replace(/_/g, " ") }),
              /* @__PURE__ */ jsx("div", { className: `text-[11.5px] font-bold capitalize ${order.payment_status === "paid" ? "text-green-600" : "text-amber-600"}`, children: order.payment_status })
            ] })
          ] }),
          order.payment_proof && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2", children: "Payment Receipt" }),
            /* @__PURE__ */ jsxs("a", { href: order.payment_proof, target: "_blank", rel: "noopener noreferrer", className: "block no-underline", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: order.payment_proof,
                  alt: "Payment proof",
                  className: "w-full max-h-48 object-contain rounded-xl border border-gray-200 bg-gray-50 hover:opacity-90 transition-opacity cursor-zoom-in"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-[var(--color-primary)] mt-1 text-center", children: "Click to view full size" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black text-gray-400 uppercase mb-1", children: "Placed" }),
          /* @__PURE__ */ jsx("div", { className: "text-[13px] text-gray-700", children: new Date(order.created_at).toLocaleString("en-PK", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  OrderShow as default
};
