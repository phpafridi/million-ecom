import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, L as Link_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconHeart, IconEye } from "@tabler/icons-react";
function ProductCard({ product, whatsapp }) {
  var _a, _b, _c, _d;
  const { props } = usePage();
  const wishIds = Array.isArray(props == null ? void 0 : props.wishlistIds) ? props.wishlistIds : [];
  const [wished, setWished] = useState(wishIds.includes(product.id));
  const [hover, setHover] = useState(false);
  const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : [{ id: 0, url: "/images/placeholder.jpg", thumb: "/images/placeholder.jpg" }];
  const img1 = ((_a = imgs[0]) == null ? void 0 : _a.url) ?? "/images/placeholder.jpg";
  const img2 = ((_b = imgs[1]) == null ? void 0 : _b.url) ?? null;
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
  return /* @__PURE__ */ jsxs(
    Link_default,
    {
      href: `/products/${product.slug}`,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "block",
        textDecoration: "none",
        borderRadius: 16,
        overflow: "hidden",
        background: "white",
        boxShadow: hover ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hover ? "translateY(-4px)" : "translateY(0)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", aspectRatio: "3/4", overflow: "hidden", background: "#F5F5F3" }, children: [
          /* @__PURE__ */ jsx("img", { src: img1, alt: product.name, loading: "lazy", style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.4s, transform 0.6s",
            opacity: hover && img2 ? 0 : 1,
            transform: hover ? "scale(1.06)" : "scale(1)"
          } }),
          img2 && /* @__PURE__ */ jsx("img", { src: img2, alt: product.name, loading: "lazy", style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.4s, transform 0.6s",
            opacity: hover ? 1 : 0,
            transform: hover ? "scale(1.06)" : "scale(1.03)"
          } }),
          disc > 0 && /* @__PURE__ */ jsxs("div", { style: {
            position: "absolute",
            top: 10,
            left: 10,
            background: "var(--color-primary,#C9A84C)",
            color: "var(--color-primary-text,#0a0a0a)",
            fontSize: 10,
            fontWeight: 800,
            padding: "4px 8px",
            borderRadius: 100
          }, children: [
            "-",
            disc,
            "%"
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
          /* @__PURE__ */ jsxs("div", { style: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--color-dark-bg,#0a0a0a)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 800,
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform: hover ? "translateY(0)" : "translateY(100%)",
            opacity: hover ? 1 : 0
          }, children: [
            /* @__PURE__ */ jsx(IconEye, { size: 14 }),
            " View Product"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { padding: "12px 12px 14px" }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontSize: 9.5, fontWeight: 800, color: "var(--color-primary,#C9A84C)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }, children: ((_d = product.category) == null ? void 0 : _d.name) ?? "" }),
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
  );
}
export {
  ProductCard as P
};
