import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { r as router3, u as usePage, L as Link_default } from "../ssr.js";
import { useState, useEffect } from "react";
import { IconX, IconMinus, IconPlus, IconHeart, IconShoppingBag, IconEye } from "@tabler/icons-react";
import { createPortal } from "react-dom";
function QuickViewModal({ product, onClose }) {
  var _a, _b, _c;
  const [selectedValues, setSelectedValues] = useState({});
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [shakeAttr, setShakeAttr] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const attrs = product.variant_attributes ?? [];
  const img = ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url) ?? "/images/placeholder.jpg";
  function selectValue(attrId, valueId) {
    setSelectedValues((prev) => ({ ...prev, [attrId]: valueId }));
    setShakeAttr(null);
  }
  function findMatchingVariant() {
    const allAttrIds = attrs.map((a) => a.id);
    if (!allAttrIds.every((id) => selectedValues[id] !== void 0)) return null;
    return (product.variants ?? []).find(
      (v) => v.is_active !== false && allAttrIds.every((id) => {
        var _a2;
        return (_a2 = v.variant_values) == null ? void 0 : _a2.some((vv) => vv.variant_attribute_id === id && vv.id === selectedValues[id]);
      })
    ) ?? null;
  }
  function handleAddToCart() {
    const missing = attrs.find((a) => selectedValues[a.id] === void 0);
    if (missing) {
      setShakeAttr(missing.id);
      return;
    }
    const variant = findMatchingVariant();
    setAdding(true);
    router3.post("/cart/add", {
      product_id: product.id,
      quantity: qty,
      variant_id: (variant == null ? void 0 : variant.id) ?? null
    }, {
      preserveScroll: true,
      onFinish: () => {
        setAdding(false);
        onClose();
      }
    });
  }
  const allRequiredSelected = attrs.every((a) => selectedValues[a.id] !== void 0);
  const price = product.price;
  const compare = product.compare_price;
  const disc = compare && compare > price ? Math.round((compare - price) / compare * 100) : 0;
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4", onClick: onClose, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50" }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden flex flex-col",
          style: { height: "min(600px, 88vh)" },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                "aria-label": "Close",
                className: "absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center border-none cursor-pointer",
                children: /* @__PURE__ */ jsx(IconX, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto flex", style: { flexDirection: isDesktop ? "row" : "column" }, children: [
              /* @__PURE__ */ jsx("div", { style: { width: isDesktop ? "50%" : "100%", flexShrink: 0, height: isDesktop ? "100%" : 160, overflow: "hidden" }, children: /* @__PURE__ */ jsx("img", { src: img, alt: product.name, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }) }),
              /* @__PURE__ */ jsxs("div", { style: { width: isDesktop ? "50%" : "100%", padding: isDesktop ? 24 : 16 }, children: [
                /* @__PURE__ */ jsx("h2", { className: "font-bold text-[16px] sm:text-[17px] mb-2 pr-8", children: product.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap gap-2 mb-1", children: [
                  compare && compare > price && /* @__PURE__ */ jsxs("span", { className: "text-gray-400 line-through text-[13px] sm:text-[14px]", children: [
                    "Rs. ",
                    compare.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-[17px] sm:text-[18px]", children: [
                    "Rs. ",
                    price.toLocaleString()
                  ] }),
                  disc > 0 && /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-[11px] font-bold text-red-600", children: "FREE DELIVERY" })
                ] }),
                attrs.map((attr) => /* @__PURE__ */ jsxs("div", { id: `qv-attr-${attr.id}`, className: "mt-4", style: { padding: shakeAttr === attr.id ? 8 : 0, borderRadius: 8, border: shakeAttr === attr.id ? "1px solid #DC2626" : "none" }, children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-[11px] font-bold uppercase tracking-wide mb-2", style: { color: shakeAttr === attr.id ? "#DC2626" : "#6B7280" }, children: [
                    attr.name,
                    shakeAttr === attr.id && /* @__PURE__ */ jsxs("span", { className: "ml-2 normal-case font-semibold", children: [
                      "— please select a ",
                      attr.name.toLowerCase()
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: attr.values.map((val) => {
                    const isSelected = selectedValues[attr.id] === val.id;
                    return /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => selectValue(attr.id, val.id),
                        className: "px-3.5 py-2 rounded-lg text-[13px] font-semibold border cursor-pointer transition-colors",
                        style: {
                          background: isSelected ? "#0a0a0a" : "#fff",
                          color: isSelected ? "#fff" : "#111",
                          borderColor: isSelected ? "#0a0a0a" : "#d1d5db"
                        },
                        children: val.value
                      },
                      val.id
                    );
                  }) })
                ] }, attr.id))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 border-t border-gray-100 p-4 flex items-center gap-3 bg-white", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setQty((q) => Math.max(1, q - 1)),
                    className: "w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center bg-white cursor-pointer",
                    children: /* @__PURE__ */ jsx(IconMinus, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "w-8 text-center font-semibold", children: qty }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setQty((q) => q + 1),
                    className: "w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center bg-white cursor-pointer",
                    children: /* @__PURE__ */ jsx(IconPlus, { size: 14 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleAddToCart,
                  disabled: adding,
                  className: "flex-1 py-3 rounded-xl font-bold text-[13px] sm:text-[14px] text-white border-none cursor-pointer",
                  style: {
                    background: allRequiredSelected ? "#0a0a0a" : "#9CA3AF",
                    opacity: adding ? 0.6 : 1
                  },
                  children: adding ? "Adding..." : allRequiredSelected ? "Add to Cart" : `Select ${((_c = attrs.find((a) => selectedValues[a.id] === void 0)) == null ? void 0 : _c.name) ?? "Options"}`
                }
              )
            ] })
          ]
        }
      )
    ] }),
    document.body
  );
}
function ProductCard({ product, whatsapp }) {
  var _a, _b, _c;
  const { props } = usePage();
  const wishIds = Array.isArray(props == null ? void 0 : props.wishlistIds) ? props.wishlistIds : [];
  const [wished, setWished] = useState(wishIds.includes(product.id));
  const [hover, setHover] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ id: 0, url: "/images/placeholder.jpg", thumb: "/images/placeholder.jpg" }];
  const [activeImg, setActiveImg] = useState(0);
  const currentImg = ((_a = imgs[activeImg]) == null ? void 0 : _a.url) ?? ((_b = imgs[0]) == null ? void 0 : _b.url) ?? "/images/placeholder.jpg";
  const fmt = (n) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;
  const settings = ((_c = usePage().props) == null ? void 0 : _c.settings) ?? {};
  const saleActive = settings.sale_enabled === "1" && !!settings.sale_ends_at && new Date(settings.sale_ends_at) > /* @__PURE__ */ new Date();
  const salePct = saleActive && settings.sale_discount ? parseInt(settings.sale_discount) : 0;
  const origPrice = product.price;
  const salePrice = salePct > 0 ? Math.round(origPrice * (1 - salePct / 100)) : origPrice;
  const cmp = salePct > 0 ? origPrice : product.compare_price ?? 0;
  const disc = salePct > 0 ? salePct : product.discount_pct ?? (product.compare_price && product.compare_price > origPrice ? Math.round((product.compare_price - origPrice) / product.compare_price * 100) : 0);
  const displayPrice = salePct > 0 ? salePrice : origPrice;
  const rating = product.rating_avg ?? 0;
  const rcount = product.rating_count ?? 0;
  function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    setWished((w) => !w);
    router3.post("/wishlist/toggle", { product_id: product.id }, {
      preserveScroll: true,
      preserveState: true,
      onError: () => setWished((w) => !w)
    });
  }
  function quickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  }
  function selectImage(e, i) {
    e.preventDefault();
    e.stopPropagation();
    setActiveImg(i);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Link_default,
      {
        href: `/products/${product.slug}`,
        onMouseEnter: () => {
          setHover(true);
          if (imgs.length > 1) setActiveImg(1);
        },
        onMouseLeave: () => {
          setHover(false);
          setActiveImg(0);
        },
        style: {
          display: "block",
          textDecoration: "none",
          borderRadius: 16,
          overflow: "hidden",
          background: "white",
          boxShadow: hover ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
          // Blocks the "ghost click" mobile browsers sometimes fire
          // ~300ms after a touch — without this, that delayed
          // synthetic click can land on this still-present link
          // underneath the modal and silently navigate away.
          pointerEvents: showQuickView ? "none" : "auto",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hover ? "translateY(-4px)" : "translateY(0)"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#F5F5F3" }, children: [
            /* @__PURE__ */ jsx("img", { src: currentImg, alt: product.name, loading: "lazy", style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s, transform 0.6s",
              transform: hover ? "scale(1.06)" : "scale(1)"
            } }),
            disc > 0 && /* @__PURE__ */ jsxs("div", { style: {
              position: "absolute",
              top: 10,
              left: 10,
              background: "#E31E24",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 800,
              padding: "5px 9px",
              borderRadius: 3
            }, children: [
              disc,
              "% OFF"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: toggleWishlist, style: {
              position: "absolute",
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: wished ? "var(--color-primary,#C9A84C)" : "rgba(255,255,255,0.92)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
            }, children: /* @__PURE__ */ jsx(
              IconHeart,
              {
                size: 15,
                fill: wished ? "var(--color-primary-text,#0a0a0a)" : "none",
                color: wished ? "var(--color-primary-text,#0a0a0a)" : "#374151"
              }
            ) }),
            /* @__PURE__ */ jsx("button", { onClick: quickAdd, disabled: adding, style: {
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              border: "none",
              cursor: adding ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              transition: "transform 0.15s",
              opacity: adding ? 0.6 : 1
            }, children: /* @__PURE__ */ jsx(IconShoppingBag, { size: 16, color: "#111" }) }),
            imgs.length > 1 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }, children: imgs.map((_, i) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => selectImage(e, i),
                style: {
                  width: i === activeImg ? 14 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === activeImg ? "#fff" : "rgba(255,255,255,0.6)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  transition: "width 0.2s"
                }
              },
              i
            )) }),
            /* @__PURE__ */ jsxs("div", { style: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: "50%",
              background: "var(--color-dark-bg,#0a0a0a)",
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 800,
              padding: "10px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: hover ? "translateY(0)" : "translateY(100%)",
              opacity: hover ? 1 : 0,
              pointerEvents: "none"
            }, children: [
              /* @__PURE__ */ jsx(IconEye, { size: 13 }),
              " View"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "12px 12px 14px" }, children: [
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13.5, fontWeight: 700, color: "#111", margin: "0 0 6px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }, children: product.name }),
            rating > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }, children: [
              /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 1 }, children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsx("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: s <= Math.round(rating) ? "var(--color-primary,#C9A84C)" : "#E5E7EB", children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }) }, s)) }),
              rcount > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: 11, color: "#9CA3AF", fontWeight: 600 }, children: [
                "(",
                rcount,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 6 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 15, fontWeight: 900, color: salePct > 0 ? "#DC2626" : "#111" }, children: fmt(displayPrice) }),
              (salePct > 0 || cmp > product.price) && /* @__PURE__ */ jsx("span", { style: { fontSize: 11.5, color: "#9CA3AF", textDecoration: "line-through", fontWeight: 500 }, children: fmt(salePct > 0 ? origPrice : cmp) })
            ] }) })
          ] })
        ]
      }
    ),
    showQuickView && /* @__PURE__ */ jsx(QuickViewModal, { product, onClose: () => setShowQuickView(false) })
  ] });
}
export {
  ProductCard as P
};
