import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { r as router3, H as Head_default } from "../ssr.js";
import { IconX, IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-K_5Bgk86.js";
import { P as ProductCard } from "./ProductCard-B4XFm4Gt.js";
import { P as ProductCardSkeleton } from "./Skeleton-C7zZnlgf.js";
import { motion } from "framer-motion";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
import "./cn-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const SORTS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Best Deals" }
];
const PRICES = [
  { label: "All Prices", max: void 0 },
  { label: "Under Rs 25,000", max: 25e3 },
  { label: "Under Rs 75,000", max: 75e3 },
  { label: "Under Rs 200,000", max: 2e5 },
  { label: "Rs 200,000+", max: 9999999 }
];
function ShopIndex({ products, categories, filters: rawFilters, settings, auth }) {
  var _a;
  const filters = rawFilters ?? {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState(filters.sort ?? "default");
  const [loading, setLoading] = useState(false);
  const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "923001234567";
  useEffect(() => {
    const removeStart = router3.on("start", () => setLoading(true));
    const removeFinish = router3.on("finish", () => setLoading(false));
    return () => {
      removeStart();
      removeFinish();
    };
  }, []);
  function apply(params) {
    const base = {};
    if (filters && typeof filters === "object" && !Array.isArray(filters)) Object.assign(base, filters);
    Object.assign(base, params);
    Object.keys(base).forEach((k) => {
      if (base[k] == null || base[k] === "") delete base[k];
    });
    router3.get("/shop", base, { preserveState: true, preserveScroll: true });
  }
  const title = filters.q ? `"${filters.q}"` : filters.category ? ((_a = categories.find((c) => c.slug === filters.category)) == null ? void 0 : _a.name) ?? filters.category : "All Products";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "px-4 sm:px-6 lg:px-10 py-4 sm:py-5",
        style: { background: "var(--color-dark-bg,#0a0a0a)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-[10px] sm:text-[11px] font-bold uppercase tracking-[.1em] mb-1",
              style: { color: "var(--color-primary,#C9A84C)" },
              children: filters.q ? "Search Results" : "Shop"
            }
          ),
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: "font-manrope font-black text-[22px] sm:text-[26px] tracking-tight",
              style: { color: "#ffffff" },
              children: title
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 items-start", children: [
      /* @__PURE__ */ jsxs(Fragment, { children: [
        sidebarOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 z-30 lg:hidden", onClick: () => setSidebarOpen(false) }),
        /* @__PURE__ */ jsxs("aside", { className: `
                        bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto transition-all duration-300
                        fixed top-0 left-0 bottom-0 z-40 w-72 shadow-2xl lg:shadow-none
                        lg:static lg:w-56 lg:block lg:sticky lg:top-[116px] lg:z-0 lg:max-h-[calc(100vh-116px)]
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    `, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100 lg:hidden", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[15px]", children: "Filters" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setSidebarOpen(false), className: "border-none bg-transparent cursor-pointer text-gray-500", children: /* @__PURE__ */ jsx(IconX, { size: 20 }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3", children: "Categories" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "cat",
                        value: "",
                        checked: !filters.category,
                        onChange: () => apply({ category: void 0 }),
                        className: "accent-[var(--color-primary,#00c8ff)] w-4 h-4 cursor-pointer"
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary,#00c8ff)]", children: "All" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: products.total })
                ] }),
                categories.map((cat) => {
                  var _a2;
                  return /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "radio",
                          name: "cat",
                          value: cat.slug,
                          checked: filters.category === cat.slug,
                          onChange: () => {
                            apply({ category: cat.slug });
                            setSidebarOpen(false);
                          },
                          className: "w-4 h-4 cursor-pointer",
                          style: { accentColor: "var(--color-primary)" }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary)]", children: cat.name })
                    ] }) }),
                    (_a2 = cat.children) == null ? void 0 : _a2.map((sub) => /* @__PURE__ */ jsx("label", { className: "flex items-center justify-between pl-8 pr-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer group", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "radio",
                          name: "cat",
                          value: sub.slug,
                          checked: filters.category === sub.slug,
                          onChange: () => {
                            apply({ category: sub.slug });
                            setSidebarOpen(false);
                          },
                          className: "w-3.5 h-3.5 cursor-pointer",
                          style: { accentColor: "var(--color-primary)" }
                        }
                      ),
                      /* @__PURE__ */ jsxs("span", { className: "text-[12px] text-gray-500 group-hover:text-[var(--color-primary)]", children: [
                        "└ ",
                        sub.name
                      ] })
                    ] }) }, sub.id))
                  ] }, cat.id);
                })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3", children: "Price Range" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: PRICES.map((r, i) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: "price",
                    className: "accent-[var(--color-primary,#00c8ff)] w-4 h-4 cursor-pointer",
                    checked: filters.max_price === r.max,
                    onChange: () => {
                      apply({ max_price: r.max });
                      setSidebarOpen(false);
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-700 group-hover:text-[var(--color-primary,#00c8ff)]", children: r.label })
              ] }, i)) })
            ] }),
            (filters.q || filters.category || filters.max_price) && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => router3.get("/shop"),
                className: "flex items-center gap-1.5 text-[12.5px] text-red-500 hover:text-red-600 font-semibold border-none bg-transparent cursor-pointer px-3",
                children: [
                  /* @__PURE__ */ jsx(IconX, { size: 14 }),
                  " Clear all filters"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 p-3 sm:p-4 lg:p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-100 rounded-2xl flex items-center flex-wrap px-3 sm:px-4 py-2.5 mb-4 gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSidebarOpen(true),
              className: "lg:hidden flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-[var(--color-primary,#00c8ff)] border border-gray-200 rounded-xl px-3 py-2 bg-white cursor-pointer transition-colors flex-shrink-0",
              children: [
                /* @__PURE__ */ jsx(IconAdjustmentsHorizontal, { size: 16 }),
                " Filter"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] sm:text-[13px] text-gray-500 flex-shrink-0", children: [
            /* @__PURE__ */ jsx("strong", { className: "text-gray-900", children: products.total }),
            " products"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 ml-auto flex-wrap", children: SORTS.map((s) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setSort(s.value);
                apply({ sort: s.value });
              },
              className: `px-2.5 sm:px-3 py-1.5 rounded-[10px] text-[11px] sm:text-[12px] font-semibold transition-all border-none cursor-pointer whitespace-nowrap
                                        ${sort === s.value ? "bg-[var(--color-primary,#00c8ff)] text-[var(--color-dark-bg,#0a0e1a)]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
              children: s.label
            },
            s.value
          )) })
        ] }),
        loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3", children: Array(8).fill(0).map((_, i) => /* @__PURE__ */ jsx(ProductCardSkeleton, {}, i)) }) : products.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16 sm:py-24", children: [
          /* @__PURE__ */ jsx("div", { className: "text-6xl mb-5", children: "🛍️" }),
          /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[20px] text-gray-800 mb-2", children: filters.q || filters.category ? "No products found" : "No products yet" }),
          /* @__PURE__ */ jsx("div", { className: "text-[14px] text-gray-400 mb-6", children: filters.q || filters.category ? "Try a different search or category" : "Products will appear here once added from the admin panel" }),
          filters.q || filters.category ? /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => router3.get("/shop", {}),
              className: "inline-flex items-center gap-2 h-11 px-7 font-black text-[13px] rounded-xl border-none cursor-pointer",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: "Clear Filters"
            }
          ) : /* @__PURE__ */ jsx(
            "a",
            {
              href: "/",
              className: "inline-flex items-center gap-2 h-11 px-7 font-black text-[13px] rounded-xl no-underline",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: "← Go Home"
            }
          )
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3", children: products.data.map((p, i) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }, children: /* @__PURE__ */ jsx(ProductCard, { product: p, whatsapp }) }, p.id)) }),
        products.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mt-6", children: [
          products.current_page > 1 && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => apply({ page: products.current_page - 1 }),
              className: "h-9 sm:h-10 px-4 sm:px-5 text-[12.5px] sm:text-[13px] font-semibold border border-gray-200 rounded-xl hover:border-[var(--color-primary,#00c8ff)] hover:text-[var(--color-primary,#00c8ff)] bg-white cursor-pointer transition-all",
              children: "← Prev"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] sm:text-[13px] text-gray-500 px-3 sm:px-4", children: [
            products.current_page,
            " / ",
            products.last_page
          ] }),
          products.current_page < products.last_page && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => apply({ page: products.current_page + 1 }),
              className: "h-9 sm:h-10 px-4 sm:px-5 text-[12.5px] sm:text-[13px] font-semibold border border-gray-200 rounded-xl hover:border-[var(--color-primary,#00c8ff)] hover:text-[var(--color-primary,#00c8ff)] bg-white cursor-pointer transition-all",
              children: "Next →"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  ShopIndex as default
};
