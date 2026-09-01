import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { IconHeart, IconShoppingCart, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-K_5Bgk86.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
function Wishlist({ items, settings, auth }) {
  const fmt = (n) => `Rs ${n.toLocaleString("en-PK")}`;
  function removeFromWishlist(productId) {
    router3.post("/wishlist/toggle", { product_id: productId }, { preserveScroll: true });
  }
  function addToCart(productId) {
    router3.post("/cart/add", { product_id: productId, quantity: 1 }, { preserveScroll: true });
  }
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "My Wishlist" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx(IconHeart, { size: 24, style: { color: "var(--color-accent)" }, fill: "currentColor" }),
        /* @__PURE__ */ jsx("h1", { className: "font-manrope font-black text-[24px]", style: { color: "var(--color-dark-bg)" }, children: "My Wishlist" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[13px] text-gray-500 ml-2", children: [
          "(",
          items.length,
          " items)"
        ] })
      ] }),
      items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-16 text-center", children: [
        /* @__PURE__ */ jsx(IconHeart, { size: 48, className: "text-gray-200 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "font-manrope font-bold text-[20px] text-gray-700 mb-2", children: "Your wishlist is empty" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[14px] mb-6", children: "Browse products and click the heart icon to save them here." }),
        /* @__PURE__ */ jsx(
          Link_default,
          {
            href: "/shop",
            className: "inline-flex items-center gap-2 font-black text-[14px] h-12 px-8 rounded-xl no-underline",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: "Browse Products →"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((product) => {
        var _a, _b, _c;
        return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsx(Link_default, { href: `/products/${product.slug}`, className: "block no-underline", children: /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-50 flex items-center justify-center p-6", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url) ?? "/images/placeholder.jpg",
              alt: product.name,
              className: "max-w-full max-h-full object-contain"
            }
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10.5px] font-bold uppercase tracking-wider mb-1", style: { color: "var(--color-primary)" }, children: (_c = product.category) == null ? void 0 : _c.name }),
            /* @__PURE__ */ jsx(Link_default, { href: `/products/${product.slug}`, className: "font-semibold text-[14px] text-gray-900 no-underline hover:text-[var(--color-primary)] line-clamp-2 block mb-2", children: product.name }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 mb-3", children: [
              /* @__PURE__ */ jsx("span", { className: "font-manrope font-black text-[16px]", style: { color: "var(--color-dark-bg)" }, children: fmt(product.price) }),
              product.compare_price > product.price && /* @__PURE__ */ jsx("span", { className: "text-[12px] text-gray-400 line-through", children: fmt(product.compare_price) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => addToCart(product.id),
                  className: "flex-1 flex items-center justify-center gap-2 h-10 font-bold text-[12.5px] rounded-xl border-none cursor-pointer",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: [
                    /* @__PURE__ */ jsx(IconShoppingCart, { size: 15 }),
                    " Add to Cart"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removeFromWishlist(product.id),
                  className: "w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-300 cursor-pointer bg-white transition-all",
                  children: /* @__PURE__ */ jsx(IconTrash, { size: 15 })
                }
              )
            ] })
          ] })
        ] }, product.id);
      }) }),
      /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline mt-6 transition-colors", children: [
        /* @__PURE__ */ jsx(IconArrowLeft, { size: 15 }),
        " Continue Shopping"
      ] })
    ] })
  ] });
}
export {
  Wishlist as default
};
