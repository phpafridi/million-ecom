import { jsxs, jsx } from "react/jsx-runtime";
import { a as useForm, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-BxLnnCms.js";
import AccountSidebar from "./AccountSidebar-zWUfAXZr.js";
import { IconHeart, IconShoppingCart, IconTrash } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
function AccountWishlist({ items, settings, auth }) {
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const addForm = useForm({ product_id: 0, quantity: 1 });
  const removeForm = useForm({});
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "My Wishlist" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-8 px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth, active: "wishlist" }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-black text-[18px]", style: { color: "var(--color-dark-bg)" }, children: [
            "My Wishlist ",
            /* @__PURE__ */ jsxs("span", { className: "text-gray-400 font-normal text-[14px] ml-1", children: [
              "(",
              items.length,
              ")"
            ] })
          ] }),
          items.length > 0 && /* @__PURE__ */ jsx(Link_default, { href: "/shop", className: "text-[12.5px] font-bold no-underline", style: { color: "var(--color-primary)" }, children: "Continue Shopping →" })
        ] }),
        items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx(IconHeart, { size: 44, className: "text-gray-200 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[14px] mb-4", children: "Your wishlist is empty." }),
          /* @__PURE__ */ jsx(
            Link_default,
            {
              href: "/shop",
              className: "inline-flex items-center gap-2 font-bold text-[13px] h-10 px-5 rounded-xl no-underline",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: "Browse Products →"
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: items.map(({ id, product }) => /* @__PURE__ */ jsxs("div", { className: "border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all group", children: [
          /* @__PURE__ */ jsxs(Link_default, { href: `/products/${product.slug}`, className: "block relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: product.first_image,
                alt: product.name,
                className: "w-full h-44 object-cover bg-gray-50"
              }
            ),
            product.discount_pct > 0 && /* @__PURE__ */ jsxs(
              "span",
              {
                className: "absolute top-3 left-3 text-white text-[11px] font-black px-2 py-1 rounded-lg",
                style: { background: "var(--color-accent)" },
                children: [
                  "-",
                  product.discount_pct,
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            product.category && /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1", children: product.category }),
            /* @__PURE__ */ jsx(
              Link_default,
              {
                href: `/products/${product.slug}`,
                className: "font-bold text-[13.5px] no-underline line-clamp-2 leading-snug mb-3 block",
                style: { color: "var(--color-dark-bg)" },
                children: product.name
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsx("span", { className: "font-black text-[16px]", style: { color: "var(--color-primary)" }, children: fmt(product.price) }),
              product.compare_price && product.compare_price > product.price && /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-[12px] line-through", children: fmt(product.compare_price) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    if (product.has_variants) {
                      router3.visit(`/products/${product.slug}`);
                      return;
                    }
                    addForm.setData("product_id", product.id);
                    addForm.post("/cart/add");
                  },
                  disabled: product.stock === 0,
                  className: "flex-1 h-9 rounded-xl font-bold text-[12.5px] disabled:opacity-50 flex items-center justify-center gap-1.5",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: [
                    /* @__PURE__ */ jsx(IconShoppingCart, { size: 14 }),
                    product.stock === 0 ? "Out of Stock" : product.has_variants ? "Select Options" : "Add to Cart"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => removeForm.post(`/wishlist/toggle`, { data: { product_id: product.id } }),
                  className: "w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors",
                  children: /* @__PURE__ */ jsx(IconTrash, { size: 14 })
                }
              )
            ] })
          ] })
        ] }, id)) })
      ] }) })
    ] }) }) })
  ] });
}
export {
  AccountWishlist as default
};
