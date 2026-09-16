import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { useState, useRef } from "react";
import { IconX, IconChevronLeft, IconChevronRight, IconTag, IconHeart, IconZoomIn, IconCheck, IconMinus, IconPlus, IconShoppingCart, IconBrandWhatsapp, IconBrandFacebookFilled, IconPhone, IconStarFilled, IconStar } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { S as StorefrontLayout } from "./StorefrontLayout-BzEeKzY0.js";
import { P as ProductCard } from "./ProductCard-Dl9N4E2E.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
function StarRating({ rating, count, size = 14 }) {
  const r = Number(rating) || 0;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx(IconStarFilled, { size, className: i <= Math.round(r) ? "text-amber-400" : "text-gray-200" }, i)) }),
    /* @__PURE__ */ jsxs("span", { className: "text-[13px] text-gray-500", children: [
      r.toFixed(1),
      " (",
      count,
      " review",
      count !== 1 ? "s" : "",
      ")"
    ] })
  ] });
}
function parseDescription(desc) {
  if (!desc) return { specs: [], prose: "" };
  const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
  const specs = [];
  const proseLines = [];
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 25) {
      const label = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      if (label && value) {
        specs.push({ label, value });
      } else {
        proseLines.push(line);
      }
    } else {
      proseLines.push(line);
    }
  }
  return { specs, prose: proseLines.join("\n") };
}
function ProductShow({ product, related, wishlisted: initWishlisted, settings, auth }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const { props: pageProps } = usePage();
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(initWishlisted);
  const [qty, setQty] = useState(1);
  const [cartError, setCartError] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    ((_a = product.variants) == null ? void 0 : _a.find((v) => v.is_active && v.stock > 0)) ?? null
  );
  const [selectedValues, setSelectedValues] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const mainImgRef = useRef(null);
  function handleMouseMove(e) {
    if (!mainImgRef.current) return;
    const rect = mainImgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.5)"
    });
  }
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const imgs = ((_b = product.images) == null ? void 0 : _b.length) ? product.images : [{ id: 0, url: "/images/placeholder.jpg", thumb: "/images/placeholder.jpg" }];
  const hasVariants = (((_c = product.variant_attributes) == null ? void 0 : _c.length) ?? 0) > 0;
  const missingRequired = hasVariants ? (product.variant_attributes ?? []).filter(
    (a) => {
      var _a2;
      return (((_a2 = a.values) == null ? void 0 : _a2.length) ?? 0) > 0 && !selectedValues[a.id] && (a.is_required ?? true);
    }
  ) : [];
  const rawPrice = (selectedVariant == null ? void 0 : selectedVariant.price) ?? product.price;
  const rawCompare = (selectedVariant == null ? void 0 : selectedVariant.compare_price) ?? product.compare_price;
  const activeStock = selectedVariant && product.track_variant_stock !== false ? selectedVariant.stock : product.stock;
  const _settings = pageProps.settings ?? settings ?? {};
  const _saleActive = _settings.sale_enabled === "1" && !!_settings.sale_ends_at && new Date(_settings.sale_ends_at) > /* @__PURE__ */ new Date();
  const _salePct = _saleActive && _settings.sale_discount ? parseInt(_settings.sale_discount) : 0;
  const activePrice = _salePct > 0 ? Math.round(rawPrice * (1 - _salePct / 100)) : rawPrice;
  const activeCompare = _salePct > 0 ? rawPrice : rawCompare ?? 0;
  const activeDiscount = _salePct > 0 ? _salePct : activeCompare > activePrice ? Math.round((activeCompare - activePrice) / activeCompare * 100) : 0;
  const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const pageSettings = pageProps.settings ?? settings ?? {};
  const contactMethod = pageSettings.product_contact_method ?? "whatsapp";
  const messengerUrl = pageSettings.messenger_url ?? "";
  const waProductMsg = pageSettings.whatsapp_product_msg ?? "Hi! I am interested in: {product_name} (Rs {price}). Please provide details.";
  const waMsg = encodeURIComponent(
    waProductMsg.replace("{product_name}", product.name).replace("{price}", String(activePrice))
  );
  const { specs, prose } = parseDescription(product.description ?? "");
  const reviews = product.approved_reviews ?? [];
  function selectValue(attrId, valueId) {
    var _a2, _b2;
    const newSel = { ...selectedValues, [attrId]: valueId };
    setSelectedValues(newSel);
    const allAttrIds = ((_a2 = product.variant_attributes) == null ? void 0 : _a2.map((a) => a.id)) ?? [];
    if (allAttrIds.every((id) => newSel[id] !== void 0)) {
      const match = (_b2 = product.variants) == null ? void 0 : _b2.find(
        (v) => v.is_active && allAttrIds.every((id) => {
          var _a3;
          return (_a3 = v.variant_values) == null ? void 0 : _a3.some((vv) => vv.variant_attribute_id === id && vv.id === newSel[id]);
        })
      );
      setSelectedVariant(match ?? null);
    }
  }
  function addToCart() {
    var _a2;
    if (missingRequired.length > 0) {
      const el = document.getElementById(`attr-${missingRequired[0].id}`);
      if (el) {
        el.style.cssText += ";outline:2px solid #ef4444;outline-offset:4px;border-radius:8px;animation:mlShake 0.4s ease";
        setTimeout(() => {
          if (el) el.style.cssText = el.style.cssText.replace(/outline[^;]*;/g, "").replace(/animation[^;]*;/g, "");
        }, 1800);
      }
      return;
    }
    const hasVariantStockRecords = (((_a2 = product.variants) == null ? void 0 : _a2.length) ?? 0) > 0;
    const allRequiredSelected = (product.variant_attributes ?? []).every(
      (a) => {
        var _a3;
        return (((_a3 = a.values) == null ? void 0 : _a3.length) ?? 0) === 0 || !(a.is_required ?? true) || selectedValues[a.id];
      }
    );
    if (hasVariantStockRecords && hasVariants && !selectedVariant && allRequiredSelected && Object.keys(selectedValues).length > 0) {
      alert("This combination is out of stock. Please try different options.");
      return;
    }
    if (adding) return;
    setAdding(true);
    router3.post("/cart/add", {
      product_id: product.id,
      quantity: qty,
      variant_id: (selectedVariant == null ? void 0 : selectedVariant.id) ?? null
    }, {
      preserveScroll: true,
      onSuccess: () => setAdding(false),
      onError: () => setAdding(false),
      onFinish: () => setAdding(false)
    });
  }
  function buyNow() {
    var _a2;
    if (missingRequired.length > 0) {
      const el = document.getElementById(`attr-${missingRequired[0].id}`);
      if (el) {
        el.style.cssText += ";outline:2px solid #ef4444;outline-offset:4px;border-radius:8px;animation:mlShake 0.4s ease";
        setTimeout(() => {
          if (el) el.style.cssText = el.style.cssText.replace(/outline[^;]*;/g, "").replace(/animation[^;]*;/g, "");
        }, 1800);
      }
      return;
    }
    const hasVariantStockRecords = (((_a2 = product.variants) == null ? void 0 : _a2.length) ?? 0) > 0;
    const allRequiredSelected = (product.variant_attributes ?? []).every(
      (a) => {
        var _a3;
        return (((_a3 = a.values) == null ? void 0 : _a3.length) ?? 0) === 0 || !(a.is_required ?? true) || selectedValues[a.id];
      }
    );
    if (hasVariantStockRecords && hasVariants && !selectedVariant && allRequiredSelected && Object.keys(selectedValues).length > 0) {
      alert("This combination is out of stock. Please try different options.");
      return;
    }
    if (adding) return;
    setAdding(true);
    router3.post("/cart/add", {
      product_id: product.id,
      quantity: qty,
      variant_id: (selectedVariant == null ? void 0 : selectedVariant.id) ?? null
    }, {
      preserveScroll: true,
      onSuccess: () => router3.visit("/cart"),
      onError: () => setAdding(false)
    });
  }
  function toggleWishlist() {
    setWished((w) => !w);
    router3.post("/wishlist/toggle", { product_id: product.id }, {
      preserveScroll: true,
      preserveState: true,
      onError: () => setWished((w) => !w)
    });
  }
  const { data: revData, setData: setRevData, post: postReview, processing: revProcessing, reset: resetRev } = useForm({
    name: ((_d = auth == null ? void 0 : auth.user) == null ? void 0 : _d.name) ?? "",
    email: ((_e = auth == null ? void 0 : auth.user) == null ? void 0 : _e.email) ?? "",
    rating: 5,
    title: "",
    body: ""
  });
  function submitReview(e) {
    e.preventDefault();
    postReview(`/products/${product.id}/reviews`, {
      onSuccess: () => {
        setShowReviewForm(false);
        resetRev();
      }
    });
  }
  const currentImgUrl = (selectedVariant == null ? void 0 : selectedVariant.image) ?? ((_f = imgs[activeImg]) == null ? void 0 : _f.url) ?? "/images/placeholder.jpg";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: product.name }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: lightbox && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: { background: "rgba(0,0,0,0.96)" },
        onClick: () => setLightbox(false),
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setLightbox(false),
              className: "absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all z-10",
              children: /* @__PURE__ */ jsx(IconX, { size: 20 })
            }
          ),
          imgs.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setActiveImg((i) => (i - 1 + imgs.length) % imgs.length);
                },
                className: "absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all z-10",
                children: /* @__PURE__ */ jsx(IconChevronLeft, { size: 22 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setActiveImg((i) => (i + 1) % imgs.length);
                },
                className: "absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all z-10",
                children: /* @__PURE__ */ jsx(IconChevronRight, { size: 22 })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            motion.img,
            {
              initial: { scale: 0.92, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              src: currentImgUrl,
              alt: product.name,
              className: "max-w-[88vw] max-h-[88vh] object-contain rounded-2xl select-none",
              style: { boxShadow: "0 0 80px rgba(0,0,0,0.8)" },
              onClick: (e) => e.stopPropagation(),
              draggable: false
            },
            activeImg
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm font-semibold tracking-wider", children: [
            activeImg + 1,
            " / ",
            imgs.length
          ] }),
          imgs.length > 1 && /* @__PURE__ */ jsx("div", { className: "absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2", children: imgs.map((_, i) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                setActiveImg(i);
              },
              className: "rounded-full cursor-pointer border-none transition-all h-2",
              style: { width: i === activeImg ? 24 : 8, background: i === activeImg ? "var(--color-primary)" : "rgba(255,255,255,0.3)" }
            },
            i
          )) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border-b border-gray-100 px-4 sm:px-8 lg:px-12 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[12px] text-gray-400 overflow-x-auto whitespace-nowrap", children: [
      /* @__PURE__ */ jsx(Link_default, { href: "/", className: "hover:text-gray-700 no-underline transition-colors", children: "Home" }),
      /* @__PURE__ */ jsx(IconChevronRight, { size: 11 }),
      /* @__PURE__ */ jsx(Link_default, { href: "/shop", className: "hover:text-gray-700 no-underline transition-colors", children: "Shop" }),
      product.category && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(IconChevronRight, { size: 11 }),
        /* @__PURE__ */ jsx(Link_default, { href: `/shop?category=${product.category.slug}`, className: "hover:text-gray-700 no-underline transition-colors", children: product.category.name })
      ] }),
      /* @__PURE__ */ jsx(IconChevronRight, { size: 11 }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-700 font-semibold truncate max-w-[200px]", children: product.name })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 sm:px-8 lg:px-12 py-6 pb-24 lg:pb-6 max-w-[1400px] mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          imgs.length > 1 && /* @__PURE__ */ jsx("div", { className: "ml-thumbs-desktop flex-col gap-2.5 w-[72px] flex-shrink-0", children: imgs.map((img, i) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveImg(i),
              className: "relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 cursor-pointer transition-all hover:opacity-100",
              style: {
                borderColor: i === activeImg ? "var(--color-primary)" : "transparent",
                opacity: i === activeImg ? 1 : 0.55
              },
              children: /* @__PURE__ */ jsx("img", { src: img.thumb ?? img.url, alt: "", className: "w-full h-full object-contain p-1" })
            },
            img.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                ref: mainImgRef,
                className: "relative bg-[#F7F7F7] rounded-2xl overflow-hidden cursor-zoom-in select-none",
                style: { aspectRatio: "1/1" },
                onMouseEnter: () => setZoomActive(true),
                onMouseLeave: () => {
                  setZoomActive(false);
                  setZoomStyle({});
                },
                onMouseMove: handleMouseMove,
                onClick: () => setLightbox(true),
                children: [
                  /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
                    motion.img,
                    {
                      src: currentImgUrl,
                      alt: product.name,
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      transition: { duration: 0.2 },
                      className: "w-full h-full object-contain p-8 lg:p-12 will-change-transform",
                      style: zoomActive ? zoomStyle : { transition: "transform 0.1s ease" },
                      draggable: false
                    },
                    activeImg
                  ) }),
                  activeDiscount > 0 && /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "absolute top-4 left-4 flex items-center gap-1 text-white text-[11px] font-black px-3 py-1.5 rounded-full pointer-events-none",
                      style: { background: "var(--color-accent)" },
                      children: [
                        /* @__PURE__ */ jsx(IconTag, { size: 12 }),
                        " -",
                        activeDiscount,
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        toggleWishlist();
                      },
                      className: `absolute top-4 right-4 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer z-10
                                        ${wished ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400"}`,
                      style: wished ? { background: "#EF4444", borderColor: "#EF4444" } : {},
                      children: /* @__PURE__ */ jsx(IconHeart, { size: 17, fill: wished ? "currentColor" : "none" })
                    }
                  ),
                  !zoomActive && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/40 text-white/80 text-[10.5px] font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-sm pointer-events-none", children: [
                    /* @__PURE__ */ jsx(IconZoomIn, { size: 13 }),
                    " Hover to zoom · Click to expand"
                  ] }),
                  imgs.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          setActiveImg((i) => (i - 1 + imgs.length) % imgs.length);
                        },
                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all z-10 text-gray-600 text-lg font-bold leading-none",
                        children: "‹"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          setActiveImg((i) => (i + 1) % imgs.length);
                        },
                        className: "absolute right-14 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white transition-all z-10 text-gray-600 text-lg font-bold leading-none",
                        children: "›"
                      }
                    )
                  ] })
                ]
              }
            ),
            imgs.length > 1 && /* @__PURE__ */ jsx("div", { className: "ml-thumbs-mobile gap-2 overflow-x-auto pb-1", children: imgs.map((img, i) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActiveImg(i),
                className: "w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 cursor-pointer transition-all",
                style: {
                  borderColor: i === activeImg ? "var(--color-primary)" : "transparent",
                  opacity: i === activeImg ? 1 : 0.5
                },
                children: /* @__PURE__ */ jsx("img", { src: img.thumb ?? img.url, alt: "", className: "w-full h-full object-contain p-1" })
              },
              img.id
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            product.category && /* @__PURE__ */ jsx(
              Link_default,
              {
                href: `/shop?category=${product.category.slug}`,
                className: "text-[10.5px] font-black uppercase tracking-[.15em] px-3 py-1.5 rounded-full no-underline",
                style: { color: "var(--color-primary)", background: "var(--color-primary)12" },
                children: product.category.name
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border
                                ${activeStock > 0 ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-500 border-red-200"}`, children: activeStock > 0 ? `✓ In Stock (${activeStock})` : "✕ Out of Stock" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "h1",
              {
                className: "font-black text-[26px] sm:text-[30px] lg:text-[32px] leading-[1.15] tracking-tight",
                style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" },
                children: product.name
              }
            ),
            (product.review_count ?? 0) > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(StarRating, { rating: product.avg_rating ?? 0, count: product.review_count ?? 0, size: 15 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-4 flex-wrap py-4 border-y border-gray-100", children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "font-black text-[32px] sm:text-[36px] leading-none",
                style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" },
                children: /* @__PURE__ */ jsx("span", { style: { color: _salePct > 0 ? "#DC2626" : "inherit" }, children: fmt(activePrice) })
              }
            ),
            activeCompare > activePrice && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[16px] text-gray-400 line-through font-medium", children: fmt(activeCompare) }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "text-[12px] font-black px-3 py-1 rounded-full",
                  style: { background: "#FEF3C7", color: "#D97706" },
                  children: [
                    "Save ",
                    fmt(activeCompare - activePrice)
                  ]
                }
              )
            ] })
          ] }),
          (product.sku || product.made_in) && /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-[12px] text-gray-400", children: [
            product.sku && /* @__PURE__ */ jsxs("span", { children: [
              "SKU: ",
              /* @__PURE__ */ jsx("strong", { className: "text-gray-600", children: product.sku })
            ] }),
            product.made_in && /* @__PURE__ */ jsxs("span", { children: [
              "Made in: ",
              /* @__PURE__ */ jsx("strong", { className: "text-gray-600", children: product.made_in })
            ] })
          ] }),
          hasVariants && ((_g = product.variant_attributes) == null ? void 0 : _g.map((attr) => {
            var _a2, _b2, _c2;
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2.5", id: `attr-${attr.id}`, children: [
                /* @__PURE__ */ jsx("span", { className: "text-[12px] font-black text-gray-800 uppercase tracking-widest", children: attr.name.replace(/\d+$/, "").replace(/_/g, " ") }),
                (((_a2 = attr.values) == null ? void 0 : _a2.length) ?? 0) > 0 && (attr.is_required ?? true) && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-[13px]", children: "*" }),
                selectedValues[attr.id] && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold", style: { color: "var(--color-primary)" }, children: [
                  "— ",
                  (_b2 = attr.values.find((v) => v.id === selectedValues[attr.id])) == null ? void 0 : _b2.value
                ] }),
                !selectedValues[attr.id] && (((_c2 = attr.values) == null ? void 0 : _c2.length) ?? 0) > 0 && /* @__PURE__ */ jsx("span", { className: "text-[10.5px] font-semibold text-red-400 normal-case tracking-normal", children: "← select" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: attr.values.map((val) => {
                const isSelected = selectedValues[attr.id] === val.id;
                return val.color_hex ? /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => selectValue(attr.id, val.id),
                    title: val.value,
                    className: `w-9 h-9 rounded-full border-2 cursor-pointer transition-all ${isSelected ? "scale-110 shadow-md" : "border-gray-300 hover:border-gray-500"}`,
                    style: { background: val.color_hex, borderColor: isSelected ? "var(--color-primary)" : void 0 },
                    children: isSelected && /* @__PURE__ */ jsx(IconCheck, { size: 14, className: "text-white mx-auto" })
                  },
                  val.id
                ) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => selectValue(attr.id, val.id),
                    className: `px-4 py-2 rounded-xl text-[12.5px] font-bold border-2 cursor-pointer transition-all
                                                    ${isSelected ? "text-[var(--color-primary-text)]" : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"}`,
                    style: isSelected ? { background: "var(--color-primary)", borderColor: "var(--color-primary)" } : {},
                    children: val.value
                  },
                  val.id
                );
              }) })
            ] }, attr.id);
          })),
          activeStock > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center border-2 border-gray-200 rounded-xl overflow-hidden", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQty(Math.max(1, qty - 1)),
                  className: "w-11 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer transition-colors",
                  children: /* @__PURE__ */ jsx(IconMinus, { size: 15 })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "w-12 text-center text-[15px] font-black", style: { color: "var(--color-body-text)" }, children: qty }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQty(Math.min(activeStock, qty + 1)),
                  className: "w-11 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 border-none bg-transparent cursor-pointer transition-colors",
                  children: /* @__PURE__ */ jsx(IconPlus, { size: 15 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] text-gray-400 font-medium", children: [
              activeStock,
              " units available"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2.5", children: [
            activeStock > 0 && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: addToCart,
                  disabled: adding,
                  className: `col-span-2 flex items-center justify-center gap-2.5 h-[54px] font-black text-[14px] rounded-2xl transition-all border-none cursor-pointer disabled:cursor-not-allowed
                                            ${missingRequired.length > 0 ? "opacity-60 grayscale" : "hover:opacity-90 disabled:opacity-70"}`,
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
                  children: [
                    /* @__PURE__ */ jsx(IconShoppingCart, { size: 20 }),
                    adding ? "Adding…" : missingRequired.length > 0 ? `Select ${((_i = (_h = missingRequired[0]) == null ? void 0 : _h.name) == null ? void 0 : _i.replace(/\d+$/, "")) || "Option"} First` : "Add to Cart"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: buyNow,
                  disabled: adding,
                  className: `col-span-2 flex items-center justify-center gap-2.5 h-[52px] font-black text-[14px] rounded-2xl transition-all border-none cursor-pointer disabled:cursor-not-allowed
                                            ${missingRequired.length > 0 ? "opacity-60 grayscale" : "hover:opacity-90 disabled:opacity-70"}`,
                  style: { background: "var(--color-dark-bg,#0a0a0a)", color: "#ffffff" },
                  children: adding ? "Processing…" : "Buy It Now"
                }
              ),
              /* @__PURE__ */ jsx(
                Link_default,
                {
                  href: "/cart",
                  className: "flex items-center justify-center gap-2 h-[48px] font-bold text-[13px] rounded-2xl no-underline border-2 transition-all hover:opacity-80",
                  style: { background: "transparent", borderColor: "var(--color-dark-bg)", color: "var(--color-body-text)" },
                  children: "View Cart"
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => toggleWishlist(),
                  className: `flex items-center justify-center gap-2 h-[48px] font-bold text-[13px] rounded-2xl border-2 cursor-pointer transition-all
                                            ${wished ? "text-white border-transparent" : "border-gray-200 text-gray-600 bg-transparent hover:border-rose-300 hover:text-rose-500"}`,
                  style: wished ? { background: "#EF4444", borderColor: "#EF4444" } : {},
                  children: [
                    /* @__PURE__ */ jsx(IconHeart, { size: 16, fill: wished ? "currentColor" : "none" }),
                    wished ? "Saved" : "Wishlist"
                  ]
                }
              )
            ] }),
            contactMethod === "whatsapp" && whatsapp && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `https://wa.me/${whatsapp}?text=${waMsg}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-bold text-[14px] h-[52px] rounded-2xl no-underline hover:bg-[#1da853] transition-all",
                children: [
                  /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 21 }),
                  " Order via WhatsApp"
                ]
              }
            ),
            contactMethod === "messenger" && messengerUrl && /* @__PURE__ */ jsxs(
              "a",
              {
                href: messengerUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-center gap-2.5 bg-[#0084FF] text-white font-bold text-[14px] h-[52px] rounded-2xl no-underline hover:bg-[#0070d6] transition-all",
                children: [
                  /* @__PURE__ */ jsx(IconBrandFacebookFilled, { size: 21 }),
                  " Message on Messenger"
                ]
              }
            ),
            (settings == null ? void 0 : settings.phone) && /* @__PURE__ */ jsxs(
              "a",
              {
                href: `tel:${settings.phone}`,
                className: "flex items-center justify-center gap-2 h-[46px] font-bold text-[13px] rounded-2xl no-underline border-2 transition-all",
                style: { borderColor: "var(--color-primary)", color: "var(--color-primary)" },
                children: [
                  /* @__PURE__ */ jsx(IconPhone, { size: 17 }),
                  " ",
                  settings.phone
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2.5", children: [["🛡️", "100% Genuine", "Verified quality"], ["🚚", "Fast Delivery", "Pakistan-wide"], ["↩️", "7-Day Returns", "Hassle-free"], ["✅", "Warranty", "Covered"]].map(([icon, title, sub]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl", children: icon }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[12px] font-bold text-gray-800 leading-none", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-gray-400 mt-0.5", children: sub })
            ] })
          ] }, title)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100", children: [
        prose && /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-black text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-gray-100",
              style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" },
              children: "About This Product"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[14px] text-gray-600 leading-[1.85] whitespace-pre-line", children: prose })
        ] }),
        specs.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-black text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-gray-100",
              style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" },
              children: "Specifications"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: specs.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex py-3 gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[12.5px] font-bold text-gray-400 uppercase tracking-wide w-36 flex-shrink-0 pt-0.5", children: s.label }),
            /* @__PURE__ */ jsx("span", { className: "text-[13.5px] font-semibold text-gray-800", children: s.value })
          ] }, i)) })
        ] }),
        !prose && specs.length === 0 && product.description && /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 lg:col-span-2", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: "font-black text-[15px] uppercase tracking-wider mb-4 pb-3 border-b border-gray-100",
              style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" },
              children: "Product Details"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[14px] text-gray-600 leading-[1.85]", children: product.description })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-white rounded-2xl border border-gray-100 p-6 lg:p-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "font-black text-[20px]", style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" }, children: "Customer Reviews" }),
            reviews.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsx(StarRating, { rating: product.avg_rating ?? 0, count: product.review_count ?? 0, size: 16 }) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowReviewForm(!showReviewForm),
              className: "h-10 px-5 font-bold text-[13px] rounded-xl border-2 cursor-pointer transition-all bg-white",
              style: { borderColor: "var(--color-primary)", color: "var(--color-primary)" },
              children: showReviewForm ? "✕ Cancel" : "+ Write Review"
            }
          )
        ] }),
        showReviewForm && /* @__PURE__ */ jsxs(
          motion.form,
          {
            onSubmit: submitReview,
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            className: "mb-6 p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[15px] text-gray-800", children: "Write Your Review" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Name *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: revData.name,
                      onChange: (e) => setRevData("name", e.target.value),
                      required: true,
                      placeholder: "Ali Khan",
                      className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Email (optional)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: revData.email,
                      onChange: (e) => setRevData("email", e.target.value),
                      placeholder: "ali@email.com",
                      className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Rating *" }),
                /* @__PURE__ */ jsx("div", { className: "flex gap-1.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRevData("rating", n), className: "border-none bg-transparent cursor-pointer p-0", children: /* @__PURE__ */ jsx(IconStarFilled, { size: 30, className: n <= revData.rating ? "text-amber-400" : "text-gray-200" }) }, n)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: revData.title,
                    onChange: (e) => setRevData("title", e.target.value),
                    placeholder: "Great product!",
                    className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Review" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: revData.body,
                    onChange: (e) => setRevData("body", e.target.value),
                    rows: 3,
                    placeholder: "Share your honest experience…",
                    className: "w-full px-4 py-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none bg-white"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: revProcessing,
                    className: "h-11 px-8 font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60",
                    style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                    children: revProcessing ? "Submitting…" : "Submit Review"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: "Reviews are published after approval." })
              ] })
            ]
          }
        ),
        reviews.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
          /* @__PURE__ */ jsx(IconStar, { size: 38, className: "mx-auto mb-3 text-gray-200" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-gray-400", children: "No reviews yet." }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px] text-gray-400 mt-1", children: "Be the first to review this product!" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100", children: reviews.map((r) => {
          var _a2;
          return /* @__PURE__ */ jsxs("div", { className: "py-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-2", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-[14px] flex-shrink-0",
                  style: { background: "var(--color-primary)" },
                  children: (_a2 = r.name[0]) == null ? void 0 : _a2.toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[13.5px]", style: { color: "var(--color-body-text)" }, children: r.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11.5px] text-gray-400", children: new Date(r.created_at).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 mt-1", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx(IconStarFilled, { size: 12, className: i <= r.rating ? "text-amber-400" : "text-gray-200" }, i)) })
              ] })
            ] }),
            r.title && /* @__PURE__ */ jsx("p", { className: "font-bold text-[13.5px] mb-1 ml-13", style: { color: "var(--color-body-text)" }, children: r.title }),
            r.body && /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-gray-600 leading-relaxed", children: r.body })
          ] }, r.id);
        }) })
      ] }),
      related.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-black text-[20px] mb-5", style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" }, children: "You May Also Like" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4", children: related.slice(0, 4).map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p, whatsapp }, p.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
                .ml-sticky-buybar { display: none; }
                .ml-thumbs-desktop { display: none; }
                .ml-thumbs-mobile { display: flex; }
                @media (max-width: 1023px) {
                    .ml-sticky-buybar { display: flex; }
                }
                @media (min-width: 1024px) {
                    .ml-thumbs-desktop { display: flex; }
                    .ml-thumbs-mobile { display: none; }
                }
            ` }),
    activeStock > 0 && /* @__PURE__ */ jsxs("div", { className: "ml-sticky-buybar", style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
      zIndex: 9975,
      background: "white",
      borderTop: "1px solid #E5E7EB",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      padding: "10px 14px",
      alignItems: "center",
      gap: 12
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { minWidth: 0, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx("div", { className: "font-black", style: { fontSize: 16, whiteSpace: "nowrap", color: "var(--color-body-text)" }, children: fmt(rawPrice) }),
        rawCompare > rawPrice && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }, children: fmt(rawCompare) })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: addToCart,
          disabled: adding,
          className: `flex-1 flex items-center justify-center gap-1.5 h-[46px] font-black text-[12.5px] rounded-xl border-none cursor-pointer transition-all disabled:cursor-not-allowed
                            ${missingRequired.length > 0 ? "opacity-60 grayscale" : "disabled:opacity-70"}`,
          style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
          children: [
            /* @__PURE__ */ jsx(IconShoppingCart, { size: 15 }),
            adding ? "Adding…" : missingRequired.length > 0 ? `Select ${((_k = (_j = missingRequired[0]) == null ? void 0 : _j.name) == null ? void 0 : _k.replace(/\d+$/, "")) || "Option"}` : "Add to Cart"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: buyNow,
          disabled: adding,
          className: `flex-1 flex items-center justify-center h-[46px] font-black text-[12.5px] rounded-xl border-none cursor-pointer transition-all disabled:cursor-not-allowed
                            ${missingRequired.length > 0 ? "opacity-60 grayscale" : "disabled:opacity-70"}`,
          style: { background: "var(--color-dark-bg,#0a0a0a)", color: "#ffffff" },
          children: adding ? "Processing…" : "Buy Now"
        }
      )
    ] })
  ] });
}
export {
  ProductShow as default
};
