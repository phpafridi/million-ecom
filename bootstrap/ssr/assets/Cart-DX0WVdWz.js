import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { useState, useEffect, useRef } from "react";
import { IconShoppingCart, IconBuildingBank, IconUpload, IconX, IconCheck, IconBrandWhatsapp, IconArrowLeft, IconAlertCircle, IconMinus, IconPlus, IconTrash, IconLoader2, IconTruck } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-BxLnnCms.js";
import { AnimatePresence, motion } from "framer-motion";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
function Cart({ items, subtotal, shipping, total, discount = 0, points_discount = 0, coupon_discount = 0, coupon_code = null, loyalty_points = 0, loyalty_value = 0, points_used = 0, loyalty_enabled = true, redeem_enabled = true, user_profile, gateways, settings, auth }) {
  var _a, _b, _c, _d, _e, _f;
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("step") === "checkout") return "checkout";
    return "cart";
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const { props: pageProps } = usePage();
  const [couponMsg, setCouponMsg] = useState(null);
  useEffect(() => {
    var _a2, _b2;
    if ((_a2 = pageProps.flash) == null ? void 0 : _a2.coupon_success) {
      setCouponMsg({ type: "success", text: pageProps.flash.coupon_success });
    } else if ((_b2 = pageProps.flash) == null ? void 0 : _b2.coupon_error) {
      setCouponMsg({ type: "error", text: pageProps.flash.coupon_error });
    }
  }, [(_a = pageProps.flash) == null ? void 0 : _a.coupon_success, (_b = pageProps.flash) == null ? void 0 : _b.coupon_error]);
  const [checkoutError, setCheckoutError] = useState(null);
  useEffect(() => {
    var _a2;
    if ((_a2 = pageProps.flash) == null ? void 0 : _a2.error) setCheckoutError(pageProps.flash.error);
  }, [(_c = pageProps.flash) == null ? void 0 : _c.error]);
  const fileRef = useRef(null);
  const fmt = (n) => `Rs ${n.toLocaleString("en-PK")}`;
  const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
    name: (user_profile == null ? void 0 : user_profile.name) ?? ((_d = auth == null ? void 0 : auth.user) == null ? void 0 : _d.name) ?? "",
    phone: (user_profile == null ? void 0 : user_profile.phone) ?? "",
    email: (user_profile == null ? void 0 : user_profile.email) ?? ((_e = auth == null ? void 0 : auth.user) == null ? void 0 : _e.email) ?? "",
    address: (user_profile == null ? void 0 : user_profile.address) ?? "",
    city: (user_profile == null ? void 0 : user_profile.city) ?? "",
    gateway: ((_f = gateways[0]) == null ? void 0 : _f.code) ?? "cod",
    notes: ""
  });
  const selectedGateway = gateways.find((g) => g.code === data.gateway);
  const isBankTransfer = data.gateway === "bank_transfer";
  !["cod", "bank_transfer"].includes(data.gateway);
  isBankTransfer && (selectedGateway == null ? void 0 : selectedGateway.bank_details) && Object.values(selectedGateway.bank_details).some((v) => v);
  function updateQty(id, qty) {
    router3.patch(`/cart/${id}`, { quantity: qty }, { preserveScroll: true });
  }
  function removeItem(id) {
    router3.delete(`/cart/${id}`, { preserveScroll: true });
  }
  function applyCoupon(e) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);
    router3.post("/cart/coupon", { code: couponCode }, {
      preserveScroll: true,
      onFinish: () => setCouponLoading(false)
    });
  }
  function removeCoupon() {
    setCouponLoading(true);
    router3.delete("/cart/coupon", {
      preserveScroll: true,
      onFinish: () => {
        setCouponLoading(false);
        setCouponCode("");
      }
    });
  }
  function pickProof(file) {
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  }
  function validateForm() {
    clearErrors();
    let valid = true;
    if (!data.name.trim()) {
      setError("name", "Full name is required");
      valid = false;
    }
    if (!data.phone.trim()) {
      setError("phone", "Phone number is required");
      valid = false;
    } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(data.phone.trim())) {
      setError("phone", "Enter a valid phone number");
      valid = false;
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("email", "Enter a valid email address");
      valid = false;
    }
    if (!data.address.trim()) {
      setError("address", "Delivery address is required");
      valid = false;
    }
    if (!data.city.trim()) {
      setError("city", "City is required");
      valid = false;
    }
    return valid;
  }
  function goToPayment(e) {
    e.preventDefault();
    if (!validateForm()) return;
    if (isBankTransfer) {
      setStep("payment");
    } else {
      post("/cart/checkout");
    }
  }
  function submitWithProof(e) {
    e.preventDefault();
    if (!proofFile) return;
    const form = new FormData();
    form.append("name", data.name);
    form.append("phone", data.phone);
    form.append("email", data.email);
    form.append("address", data.address);
    form.append("city", data.city);
    form.append("gateway", data.gateway);
    form.append("notes", data.notes);
    form.append("payment_proof", proofFile);
    router3.post("/cart/checkout", form, { forceFormData: true });
  }
  const inputCls = (err) => `w-full h-11 px-4 border-2 rounded-xl text-[13.5px] outline-none transition-colors ${err ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--color-primary)]"}`;
  if (items.length === 0 && step === "cart") {
    return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
      /* @__PURE__ */ jsx(Head_default, { title: "Cart" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto px-4 py-20 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-7xl mb-6", children: "🛒" }),
        /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-[26px] text-gray-900 mb-3", children: "Your cart is empty" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-8", children: "Browse our products and add items to your cart." }),
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/shop",
            className: "inline-flex items-center gap-2 font-black text-[14px] h-12 px-8 rounded-xl no-underline",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconShoppingCart, { size: 18 }),
              " Start Shopping"
            ]
          }
        )
      ] })
    ] });
  }
  if (step === "payment") {
    const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
    const bankFields = (selectedGateway == null ? void 0 : selectedGateway.bank_details) ?? {};
    const hasAny = Object.values(bankFields).some((v) => v);
    return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
      /* @__PURE__ */ jsx(Head_default, { title: "Complete Payment" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-gray-100", style: { background: "var(--color-dark-bg)" }, children: [
          /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-white text-[20px]", children: "Complete Your Bank Transfer" }),
          /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[13px] mt-1", children: "Transfer the amount below, then upload your payment receipt" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between p-4 rounded-xl border-2",
              style: { borderColor: "var(--color-primary)", background: "var(--color-primary)08" },
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black uppercase tracking-wider text-gray-500", children: "Amount to Transfer" }),
                  /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[28px]", style: { color: "var(--color-primary)" }, children: fmt(total) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[12px] text-gray-500 mt-0.5", children: [
                    "Order for: ",
                    data.name
                  ] })
                ] }),
                /* @__PURE__ */ jsx(IconBuildingBank, { size: 40, className: "text-gray-200" })
              ]
            }
          ),
          hasAny && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-[15px] text-gray-900 mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(IconBuildingBank, { size: 17, style: { color: "var(--color-primary)" } }),
              " Bank Account Details"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2.5", children: [
              Object.entries(bankFields).map(([k, v]) => v ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-[12px] font-semibold text-blue-600 min-w-[130px] capitalize", children: [
                  k.replace(/_/g, " "),
                  ":"
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-manrope font-black text-[14px] text-blue-900 select-all cursor-text", children: v }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigator.clipboard.writeText(v),
                    title: "Copy",
                    className: "text-[11px] text-blue-400 hover:text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 bg-white cursor-pointer transition-colors",
                    children: "Copy"
                  }
                )
              ] }, k) : null),
              /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-blue-200", children: /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-blue-700", children: [
                "⚠️ Include your ",
                /* @__PURE__ */ jsx("strong", { children: "name or phone number" }),
                " in the transfer description so we can match your payment."
              ] }) })
            ] })
          ] }),
          (selectedGateway == null ? void 0 : selectedGateway.instructions) && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800", children: [
            "📋 ",
            selectedGateway.instructions
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submitWithProof, children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-[15px] text-gray-900 mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(IconUpload, { size: 17, style: { color: "var(--color-primary)" } }),
              " Upload Payment Receipt",
              /* @__PURE__ */ jsx("span", { className: "text-red-500 text-[12px] font-normal", children: "* Required" })
            ] }),
            proofPreview ? /* @__PURE__ */ jsxs("div", { className: "relative mb-4", children: [
              /* @__PURE__ */ jsx("img", { src: proofPreview, alt: "Payment proof", className: "w-full max-h-60 object-contain rounded-xl border border-gray-200 bg-gray-50" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setProofFile(null);
                    setProofPreview(null);
                  },
                  className: "absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center border-none cursor-pointer shadow-md",
                  children: /* @__PURE__ */ jsx(IconX, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-[12.5px] text-green-600", children: [
                /* @__PURE__ */ jsx(IconCheck, { size: 14 }),
                " ",
                proofFile == null ? void 0 : proofFile.name,
                " — Ready to submit"
              ] })
            ] }) : /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] rounded-xl p-8 cursor-pointer transition-colors mb-4 group", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: fileRef,
                  type: "file",
                  accept: "image/*,.pdf",
                  className: "hidden",
                  onChange: (e) => {
                    var _a2;
                    const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
                    if (f) pickProof(f);
                  }
                }
              ),
              /* @__PURE__ */ jsx(IconUpload, { size: 28, className: "text-gray-400 group-hover:text-[var(--color-primary)] mb-3 transition-colors" }),
              /* @__PURE__ */ jsx("div", { className: "text-[14px] font-semibold text-gray-700 mb-1", children: "Click to upload payment screenshot" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-400", children: "PNG, JPG, PDF — screenshot of bank transfer or mobile payment" })
            ] }),
            whatsapp && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[#25D366]/8 border border-[#25D366]/30 rounded-xl mb-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[13px] text-gray-700 font-semibold mb-2", children: "📱 Alternatively, send receipt via WhatsApp:" }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi, I made a bank transfer for my order. Amount: ${fmt(total)}. My name: ${data.name}. Phone: ${data.phone}`)}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center justify-center gap-2 w-full h-11 bg-[#25D366] text-white font-bold text-[13.5px] rounded-xl no-underline hover:bg-[#1da853] transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 18 }),
                    " Send Receipt on WhatsApp"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setStep("checkout"),
                  className: "flex items-center gap-2 h-12 px-5 border-2 border-gray-200 rounded-xl font-semibold text-[13px] text-gray-600 bg-white cursor-pointer hover:border-gray-300 transition-all",
                  children: [
                    /* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }),
                    " Back"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  disabled: !proofFile || processing,
                  className: "flex-1 flex items-center justify-center gap-2 h-12 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: [
                    /* @__PURE__ */ jsx(IconCheck, { size: 18 }),
                    processing ? "Submitting Order…" : "Confirm Order & Submit Receipt"
                  ]
                }
              )
            ] }),
            !proofFile && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 text-[12px] text-red-500 mt-2", children: [
              /* @__PURE__ */ jsx(IconAlertCircle, { size: 13 }),
              " Please upload your payment receipt to continue"
            ] })
          ] })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Cart" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-8", children: [
        { n: 1, label: "Cart", active: step === "cart" },
        { n: 2, label: "Checkout", active: step === "checkout" },
        { n: 3, label: "Payment", active: step === "payment" }
      ].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 text-[13px] font-semibold ${s.active ? "" : "text-gray-400"}`, children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black",
              style: { background: s.active ? "var(--color-primary)" : "#e5e7eb", color: s.active ? "var(--color-primary-text)" : "#9ca3af" },
              children: s.n
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:block", children: s.label })
        ] }),
        i < 2 && /* @__PURE__ */ jsx("div", { className: "w-8 sm:w-12 h-px bg-gray-200 mx-1" })
      ] }, s.n)) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          step === "cart" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(AnimatePresence, { children: items.map((item) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, x: -20 },
                className: "bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4",
                children: [
                  /* @__PURE__ */ jsx(Link_default, { href: `/products/${item.product.slug}`, className: "flex-shrink-0 no-underline", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center", children: item.product.image ? /* @__PURE__ */ jsx("img", { src: item.product.image, alt: item.product.name, className: "w-full h-full object-contain" }) : /* @__PURE__ */ jsx(IconShoppingCart, { size: 28, className: "text-gray-300" }) }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(
                      Link_default,
                      {
                        href: `/products/${item.product.slug}`,
                        className: "font-semibold text-[14px] text-gray-900 no-underline hover:text-[var(--color-primary)] transition-colors line-clamp-2",
                        children: item.product.name
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "text-[13px] text-gray-500 mt-0.5", children: [
                      fmt(item.price),
                      " each"
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => updateQty(item.id, Math.max(1, item.quantity - 1)),
                            className: "w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer",
                            children: /* @__PURE__ */ jsx(IconMinus, { size: 14 })
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "w-8 text-center text-[13px] font-semibold", children: item.quantity }),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => updateQty(item.id, Math.min(item.product.stock, item.quantity + 1)),
                            className: "w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer",
                            children: /* @__PURE__ */ jsx(IconPlus, { size: 14 })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => removeItem(item.id),
                          className: "text-red-400 hover:text-red-600 border-none bg-transparent cursor-pointer p-1",
                          children: /* @__PURE__ */ jsx(IconTrash, { size: 16 })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[16px] flex-shrink-0", style: { color: "var(--color-dark-bg)" }, children: fmt(item.subtotal) })
                ]
              },
              item.id
            )) }),
            /* @__PURE__ */ jsxs(Link_default, { href: "/shop", className: "flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline transition-colors mt-2", children: [
              /* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }),
              " Continue Shopping"
            ] })
          ] }),
          step === "checkout" && /* @__PURE__ */ jsxs("form", { onSubmit: goToPayment, className: "space-y-5", noValidate: true, children: [
            checkoutError && /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-4 py-3.5 text-[13.5px] font-semibold flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsx(IconAlertCircle, { size: 18, className: "flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: checkoutError })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px] mb-4", children: "📦 Delivery Information" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "Full Name *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: data.name,
                      onChange: (e) => setData("name", e.target.value),
                      placeholder: "Ali Khan",
                      className: inputCls(errors.name)
                    }
                  ),
                  errors.name && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(IconAlertCircle, { size: 12 }),
                    " ",
                    errors.name
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "Phone Number *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: data.phone,
                      onChange: (e) => setData("phone", e.target.value),
                      placeholder: "03001234567",
                      type: "tel",
                      className: inputCls(errors.phone)
                    }
                  ),
                  errors.phone && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(IconAlertCircle, { size: 12 }),
                    " ",
                    errors.phone
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: [
                    "Email ",
                    /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal", children: "(optional — for receipt)" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: data.email,
                      onChange: (e) => setData("email", e.target.value),
                      placeholder: "ali@email.com",
                      type: "email",
                      className: inputCls(errors.email)
                    }
                  ),
                  errors.email && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(IconAlertCircle, { size: 12 }),
                    " ",
                    errors.email
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "City *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: data.city,
                      onChange: (e) => setData("city", e.target.value),
                      placeholder: "Karachi",
                      className: inputCls(errors.city)
                    }
                  ),
                  errors.city && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(IconAlertCircle, { size: 12 }),
                    " ",
                    errors.city
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: "Full Address *" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: data.address,
                      onChange: (e) => setData("address", e.target.value),
                      rows: 2,
                      placeholder: "House No., Street, Area — be as specific as possible",
                      className: `w-full px-4 py-3 border-2 rounded-xl text-[13.5px] outline-none resize-none transition-colors ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--color-primary)]"}`
                    }
                  ),
                  errors.address && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 mt-1 flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(IconAlertCircle, { size: 12 }),
                    " ",
                    errors.address
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
                  /* @__PURE__ */ jsxs("label", { className: "block text-[12.5px] font-semibold text-gray-700 mb-1.5", children: [
                    "Order Notes ",
                    /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal", children: "(optional)" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: data.notes,
                      onChange: (e) => setData("notes", e.target.value),
                      rows: 2,
                      placeholder: "Colour preference, delivery time, apartment buzzer code…",
                      className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none transition-colors"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px] mb-4", children: "💳 Payment Method" }),
              gateways.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-800", children: "No payment methods are currently available. Please contact us." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: gateways.map((gw) => /* @__PURE__ */ jsxs(
                "label",
                {
                  className: `flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.gateway === gw.code ? "border-[var(--color-primary)]" : "border-gray-200 hover:border-gray-300"}`,
                  style: data.gateway === gw.code ? { background: "var(--color-primary)08" } : {},
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "gateway",
                        value: gw.code,
                        checked: data.gateway === gw.code,
                        onChange: () => setData("gateway", gw.code),
                        className: "mt-1 flex-shrink-0",
                        style: { accentColor: "var(--color-primary)" }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "font-bold text-[14px] text-gray-900", children: gw.name }),
                        gw.code === "cod" && /* @__PURE__ */ jsx("span", { className: "text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700", children: "No advance needed" }),
                        gw.code === "bank_transfer" && /* @__PURE__ */ jsx("span", { className: "text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700", children: "Proof required" })
                      ] }),
                      gw.code === "cod" && data.gateway === "cod" && /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 mt-1.5", children: "Pay cash to our delivery rider when your order arrives. No advance payment needed." }),
                      gw.code === "bank_transfer" && data.gateway === "bank_transfer" && /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-2", children: [
                        gw.instructions && /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-600", children: gw.instructions }),
                        gw.bank_details && Object.values(gw.bank_details).some((v) => v) ? /* @__PURE__ */ jsxs("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-xl", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black text-blue-600 uppercase tracking-wider mb-2", children: "Our Bank Account" }),
                          Object.entries(gw.bank_details).map(([k, v]) => v ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[12.5px] py-0.5", children: [
                            /* @__PURE__ */ jsxs("span", { className: "text-blue-500 capitalize min-w-[110px]", children: [
                              k.replace(/_/g, " "),
                              ":"
                            ] }),
                            /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900", children: v })
                          ] }, k) : null),
                          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-blue-600 mt-2 pt-2 border-t border-blue-200", children: "You will upload the payment receipt on the next step." })
                        ] }) : /* @__PURE__ */ jsx("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-700", children: "Bank details not configured. Contact us on WhatsApp for account details." })
                      ] }),
                      !["cod", "bank_transfer"].includes(gw.code) && gw.instructions && data.gateway === gw.code && /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 mt-1.5", children: gw.instructions })
                    ] })
                  ]
                },
                gw.code
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setStep("cart"),
                  className: "flex items-center gap-2 h-12 px-6 border-2 border-gray-200 rounded-xl font-semibold text-[13px] text-gray-600 bg-white cursor-pointer hover:border-gray-300 transition-all",
                  children: [
                    /* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }),
                    " Back"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  disabled: processing || gateways.length === 0,
                  className: "flex-1 flex items-center justify-center gap-2 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-90 transition-all",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: [
                    processing ? /* @__PURE__ */ jsx(IconLoader2, { size: 18, className: "animate-spin" }) : /* @__PURE__ */ jsx(IconCheck, { size: 18 }),
                    isBankTransfer ? "Continue to Upload Receipt →" : processing ? "Placing Your Order…" : `Place Order — ${fmt(total)}`
                  ]
                }
              )
            ] })
          ] })
        ] }),
        processing && !isBankTransfer && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center", style: { background: "rgba(10,10,10,0.55)", backdropFilter: "blur(3px)" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl px-10 py-9 flex flex-col items-center gap-4 shadow-2xl mx-4 max-w-[320px] text-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-14 h-14", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-gray-100" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 rounded-full border-4 border-transparent animate-spin",
                style: { borderTopColor: "var(--color-primary)", borderRightColor: "var(--color-primary)" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-manrope font-black text-[15px] text-gray-900", children: "Placing your order" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 mt-1", children: "Just a moment — don't close this window" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 sticky top-[130px]", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-4", children: "Order Summary" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2.5 mb-4 max-h-48 overflow-y-auto", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
            item.product.image && /* @__PURE__ */ jsx("img", { src: item.product.image, className: "w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100 flex-shrink-0", alt: "" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[12px] font-semibold text-gray-800 truncate", children: item.product.name }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11.5px] text-gray-400", children: [
                "× ",
                item.quantity
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[12.5px] font-bold flex-shrink-0", children: fmt(item.subtotal) })
          ] }, item.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-t border-gray-100 pt-3 text-[13.5px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-600", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: fmt(subtotal) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-gray-600", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(IconTruck, { size: 14 }),
                " Shipping"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: shipping === 0 ? /* @__PURE__ */ jsx("span", { className: "text-green-600", children: "Free" }) : fmt(shipping) })
            ] }),
            discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-green-600 font-semibold", children: [
              /* @__PURE__ */ jsx("span", { children: "✓ Discount" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "-",
                fmt(discount)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-black text-[16px] pt-2 border-t border-gray-100", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: fmt(total) })
            ] })
          ] }),
          step === "cart" && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-gray-100", children: coupon_code ? (
            // Was previously always showing the "apply" input even
            // after a coupon was already applied — no indication a
            // coupon was active, and no way to remove it at all.
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-3 h-9 rounded-xl border-2", style: { borderColor: "var(--color-primary)", background: "rgba(201,168,76,0.06)" }, children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] font-bold text-green-700", children: [
                '✓ Coupon "',
                coupon_code,
                '" applied'
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: removeCoupon,
                  disabled: couponLoading,
                  className: "text-[11px] font-bold text-red-500 bg-transparent border-none cursor-pointer disabled:opacity-50 underline",
                  children: couponLoading ? "…" : "Remove"
                }
              )
            ] })
          ) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: applyCoupon, className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: couponCode,
                  onChange: (e) => setCouponCode(e.target.value.toUpperCase()),
                  placeholder: "Coupon code",
                  maxLength: 30,
                  className: "flex-1 h-9 px-3 border border-gray-200 rounded-xl text-[12.5px] font-mono outline-none focus:border-[var(--color-primary)] uppercase"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: couponLoading || !couponCode.trim(),
                  className: "h-9 px-3 font-bold text-[12px] rounded-xl border-none cursor-pointer disabled:opacity-50",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: couponLoading ? "…" : "Apply"
                }
              )
            ] }),
            couponMsg && /* @__PURE__ */ jsxs("p", { className: `text-[11.5px] font-semibold mt-2 ${couponMsg.type === "success" ? "text-green-600" : "text-red-500"}`, children: [
              couponMsg.type === "success" ? "✓ " : "⚠ ",
              couponMsg.text
            ] })
          ] }) }),
          step === "cart" && (auth == null ? void 0 : auth.user) && loyalty_enabled && redeem_enabled && loyalty_points > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 rounded-xl border-2 border-dashed", style: { borderColor: "var(--color-primary,#C9A84C)", background: "rgba(201,168,76,0.06)" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-800", children: "🪙 Loyalty Points" }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-500 mt-0.5", children: [
                  loyalty_points,
                  " pts ≈ Rs ",
                  loyalty_value.toLocaleString("en-PK"),
                  " discount"
                ] })
              ] }),
              points_used > 0 ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => router3.post("/cart/points/remove", {}, { preserveScroll: true }), className: "text-[11px] font-bold text-red-500 border border-red-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer", children: "Remove" }) : /* @__PURE__ */ jsx("button", { type: "button", onClick: () => router3.post("/cart/points/redeem", { points: loyalty_points }, { preserveScroll: true }), className: "text-[12px] font-black rounded-lg px-3 py-1.5 border-none cursor-pointer", style: { background: "var(--color-primary,#C9A84C)", color: "var(--color-primary-text,#0a0a0a)" }, children: "Use Points" })
            ] }),
            points_used > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-[12px] font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2", children: [
              "✓ ",
              points_used,
              " points applied — Rs ",
              points_discount.toLocaleString("en-PK"),
              " off"
            ] })
          ] }),
          step === "cart" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setStep("checkout"),
              disabled: items.length === 0,
              className: "w-full mt-5 h-12 flex items-center justify-center gap-2 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-50 transition-all",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: "Proceed to Checkout →"
            }
          ),
          shipping > 0 && parseFloat((settings == null ? void 0 : settings.delivery_threshold) ?? "0") > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-gray-400 mt-3 text-center", children: [
            "Add ",
            fmt(parseFloat(settings.delivery_threshold) - subtotal),
            " more for free shipping"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-5 pt-4 border-t border-gray-100 space-y-2", children: ["🔒 Secure & encrypted checkout", "📦 Fast delivery to your door", "↩️ 7-day easy returns"].map((t) => /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-[12px] text-gray-500", children: /* @__PURE__ */ jsx("span", { children: t }) }, t)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Cart as default
};
