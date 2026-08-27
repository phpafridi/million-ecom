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
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 6 }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: 15, fontWeight: 900, color: salePct > 0 ? "#DC2626" : "#111" }, children: fmt(displayPrice) }),
              (salePct > 0 || cmp > product.price) && /* @__PURE__ */ jsx("span", { style: { fontSize: 11.5, color: "#9CA3AF", textDecoration: "line-through", fontWeight: 500 }, children: fmt(salePct > 0 ? origPrice : cmp) })
            ] }),
            whatsapp && /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! Interested in: ${product.name} — ${fmt(displayPrice)}`)}`,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: (e) => e.stopPropagation(),
                style: { width: 28, height: 28, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textDecoration: "none" },
                children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "white", children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" }) })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  ProductCard as P
};
