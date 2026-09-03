import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, L as Link_default } from "../ssr.js";
import { useState } from "react";
import { IconArrowLeft, IconPlus, IconSearch, IconTrash, IconCheck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function OrderCreate({ products, gateways, settings }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const [items, setItems] = useState([]);
  const [productSearch, setPSearch] = useState("");
  const [showProducts, setShowP] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    payment_method: "cod",
    payment_status: "pending",
    status: "pending",
    notes: "",
    items: []
  });
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8);
  function addProduct(p) {
    const exists = items.find((i) => i.product_id === p.id);
    if (exists) {
      setItems(items.map((i) => i.product_id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { product_id: p.id, product_name: p.name, price: p.price, quantity: 1 }]);
    }
    setShowP(false);
    setPSearch("");
  }
  function removeItem(idx) {
    setItems(items.filter((_, i) => i !== idx));
  }
  function setQty(idx, qty) {
    setItems(items.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, qty) } : item));
  }
  function setPrice(idx, price) {
    setItems(items.map((item, i) => i === idx ? { ...item, price } : item));
  }
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = parseFloat((settings == null ? void 0 : settings.shipping_fee) ?? "0");
  const total = subtotal + shipping;
  function submit(e) {
    e.preventDefault();
    if (items.length === 0) {
      alert("Add at least one product");
      return;
    }
    post(`${ap}/orders/manual`, { data: { ...data, items } });
  }
  const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Create Manual Order", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "New Order" }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-6", children: /* @__PURE__ */ jsxs(Link_default, { href: `${ap}/orders`, className: "flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline", children: [
      /* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }),
      " Back to Orders"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800 mb-5 flex items-start gap-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xl", children: "📱" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Manual Order" }),
        " — use this to enter orders received via WhatsApp, phone calls, or in-person. Stock will be reduced automatically."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Customer Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: "Full Name *" }),
              /* @__PURE__ */ jsx("input", { value: data.customer_name, onChange: (e) => setData("customer_name", e.target.value), required: true, placeholder: "Ali Khan", className: inputCls })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: "Phone *" }),
              /* @__PURE__ */ jsx("input", { value: data.customer_phone, onChange: (e) => setData("customer_phone", e.target.value), required: true, placeholder: "03001234567", className: inputCls })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: "Email (optional)" }),
              /* @__PURE__ */ jsx("input", { type: "email", value: data.customer_email, onChange: (e) => setData("customer_email", e.target.value), placeholder: "ali@email.com", className: inputCls })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: "City / Address *" }),
              /* @__PURE__ */ jsx("input", { value: data.customer_address, onChange: (e) => setData("customer_address", e.target.value), required: true, placeholder: "House 12, Block 5, Karachi", className: inputCls })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1", children: "Notes (optional)" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.notes,
                onChange: (e) => setData("notes", e.target.value),
                rows: 2,
                placeholder: "Colour preference, delivery instructions, WhatsApp message details…",
                className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Order Items" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowP(!showProducts),
                className: "flex items-center gap-2 h-9 px-4 font-bold text-[12.5px] rounded-xl border-none cursor-pointer",
                style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                children: [
                  /* @__PURE__ */ jsx(IconPlus, { size: 15 }),
                  " Add Product"
                ]
              }
            )
          ] }),
          showProducts && /* @__PURE__ */ jsxs("div", { className: "mb-4 border-2 border-gray-200 rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center px-3 border-b border-gray-200", children: [
              /* @__PURE__ */ jsx(IconSearch, { size: 16, className: "text-gray-400 flex-shrink-0" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: productSearch,
                  onChange: (e) => setPSearch(e.target.value),
                  placeholder: "Search products…",
                  autoFocus: true,
                  className: "flex-1 h-11 px-3 outline-none border-none text-[13.5px]"
                }
              )
            ] }),
            filteredProducts.map((p) => {
              var _a, _b;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => addProduct(p),
                  className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer border-none bg-white text-left",
                  children: [
                    ((_b = (_a = p.product_images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url) && /* @__PURE__ */ jsx("img", { src: p.product_images[0].url, className: "w-9 h-9 rounded-lg object-cover flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold truncate", children: p.name }),
                      /* @__PURE__ */ jsxs("div", { className: "text-[11.5px] text-gray-400", children: [
                        fmt(p.price),
                        " · ",
                        p.stock,
                        " in stock"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11.5px] font-bold text-[var(--color-primary)]", children: "+ Add" })
                  ]
                },
                p.id
              );
            }),
            filteredProducts.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-[13px] text-gray-400 text-center", children: "No products found" })
          ] }),
          items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-gray-400 text-[13px] border-2 border-dashed border-gray-200 rounded-xl", children: 'No items added yet. Click "Add Product" to search and add products.' }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-900 truncate", children: item.product_name }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[11.5px] text-gray-500", children: "Qty:" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: item.quantity,
                    min: "1",
                    onChange: (e) => setQty(idx, +e.target.value),
                    className: "w-16 h-8 px-2 border border-gray-200 rounded-lg text-[12.5px] text-center outline-none focus:border-[var(--color-primary)]"
                  }
                ),
                /* @__PURE__ */ jsx("label", { className: "text-[11.5px] text-gray-500", children: "Price:" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: item.price,
                    min: "0",
                    onChange: (e) => setPrice(idx, +e.target.value),
                    className: "w-24 h-8 px-2 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary)]"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "text-[13px] font-bold w-24 text-right", style: { color: "var(--color-dark-bg)" }, children: fmt(item.price * item.quantity) }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => removeItem(idx), className: "w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 bg-white cursor-pointer border-none", children: /* @__PURE__ */ jsx(IconTrash, { size: 13 }) })
              ] })
            ] }, idx)),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-end pt-2 text-[14px] font-black", style: { color: "var(--color-dark-bg)" }, children: [
              "Total: ",
              /* @__PURE__ */ jsx("span", { className: "ml-2", style: { color: "var(--color-primary)" }, children: fmt(total) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Order Settings" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "Payment Method" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.payment_method,
                onChange: (e) => setData("payment_method", e.target.value),
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white",
                children: [
                  gateways.map((g) => /* @__PURE__ */ jsx("option", { value: g.code, children: g.name }, g.id)),
                  /* @__PURE__ */ jsx("option", { value: "whatsapp", children: "WhatsApp Order" }),
                  /* @__PURE__ */ jsx("option", { value: "phone_order", children: "Phone Order" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "Payment Status" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.payment_status,
                onChange: (e) => setData("payment_status", e.target.value),
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending (not paid yet)" }),
                  /* @__PURE__ */ jsx("option", { value: "paid", children: "Paid ✓" }),
                  /* @__PURE__ */ jsx("option", { value: "failed", children: "Failed" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "Order Status" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.status,
                onChange: (e) => setData("status", e.target.value),
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
                  /* @__PURE__ */ jsx("option", { value: "processing", children: "Processing" }),
                  /* @__PURE__ */ jsx("option", { value: "shipped", children: "Shipped" }),
                  /* @__PURE__ */ jsx("option", { value: "delivered", children: "Delivered" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[14px] mb-3", children: "Order Summary" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-[13px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-600", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                items.length,
                " item(s)"
              ] }),
              /* @__PURE__ */ jsx("span", { children: fmt(subtotal) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Shipping" }),
              /* @__PURE__ */ jsx("span", { children: shipping > 0 ? fmt(shipping) : "Free" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-black text-[15px] pt-2 border-t border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: fmt(total) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing || items.length === 0,
            className: "w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transition-all",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 18 }),
              " ",
              processing ? "Creating…" : "Create Order"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  OrderCreate as default
};
