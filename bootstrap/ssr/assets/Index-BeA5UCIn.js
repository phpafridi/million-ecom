import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-F8j_GET5.js";
import AccountSidebar from "./AccountSidebar-zWUfAXZr.js";
import { IconPackage, IconShoppingBag, IconStar, IconTrendingUp, IconChevronRight, IconTruck } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const STATUS_COLOR = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200"
};
function AccountIndex({ orders, stats, settings, auth }) {
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const user = auth == null ? void 0 : auth.user;
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "My Account" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-0 lg:py-8 px-0 lg:px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth, active: "dashboard" }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-5 px-4 pt-5 lg:px-0 lg:pt-0", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl p-6 text-white relative overflow-hidden",
            style: { background: "linear-gradient(135deg, var(--color-dark-bg) 0%, var(--color-dark-bg2) 100%)" },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-0 right-0 w-48 h-48 rounded-full opacity-5",
                  style: { background: "var(--color-primary)", transform: "translate(30%, -30%)" }
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[13px] font-medium mb-1", children: "Welcome back," }),
              /* @__PURE__ */ jsx("h2", { className: "font-black text-2xl mb-1", children: user == null ? void 0 : user.name }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-3", children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "text-[12px] font-bold px-3 py-1 rounded-full",
                    style: { background: stats.level.color + "30", color: stats.level.color },
                    children: [
                      stats.level.name,
                      " Member"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-white/50 text-[12px]", children: [
                  stats.loyalty_points.toLocaleString(),
                  " points · ",
                  fmt(stats.points_value),
                  " value"
                ] })
              ] }),
              stats.level.next && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px] text-white/50 mb-1.5", children: [
                  /* @__PURE__ */ jsx("span", { children: "Progress to next level" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    stats.level.progress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-700",
                    style: { width: `${stats.level.progress}%`, background: stats.level.color }
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          { label: "Total Orders", value: stats.total_orders, icon: IconPackage, color: "#3B82F6" },
          { label: "Total Spent", value: fmt(stats.total_spent), icon: IconShoppingBag, color: "#10B981" },
          { label: "Loyalty Points", value: stats.loyalty_points.toLocaleString(), icon: IconStar, color: "#F59E0B" },
          { label: "Wishlist Items", value: stats.wishlist_count, icon: IconTrendingUp, color: "#EF4444" }
        ].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
              style: { background: s.color + "15" },
              children: /* @__PURE__ */ jsx(s.icon, { size: 18, style: { color: s.color } })
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "font-black text-[20px]", style: { color: "var(--color-dark-bg)" }, children: s.value }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[11.5px] mt-0.5", children: s.label })
        ] }, s.label)) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px]", style: { color: "var(--color-dark-bg)" }, children: "Recent Orders" }),
            /* @__PURE__ */ jsxs(
              Link_default,
              {
                href: "/account/orders",
                className: "text-[12.5px] font-bold no-underline flex items-center gap-1",
                style: { color: "var(--color-primary)" },
                children: [
                  "View all ",
                  /* @__PURE__ */ jsx(IconChevronRight, { size: 14 })
                ]
              }
            )
          ] }),
          orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
            /* @__PURE__ */ jsx(IconPackage, { size: 36, className: "text-gray-200 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[13.5px] mb-4", children: "No orders yet." }),
            /* @__PURE__ */ jsx(
              Link_default,
              {
                href: "/shop",
                className: "inline-flex items-center gap-2 font-bold text-[13px] h-10 px-5 rounded-xl no-underline",
                style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                children: "Start Shopping →"
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: orders.map((order) => /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: `/account/orders/${order.id}`,
              className: "flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all no-underline group",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-xl flex items-center justify-center",
                      style: { background: "var(--color-primary)15" },
                      children: /* @__PURE__ */ jsx(IconTruck, { size: 18, style: { color: "var(--color-primary)" } })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-bold text-[13.5px]", style: { color: "var(--color-dark-bg)" }, children: order.order_number ?? `Order #${order.id}` }),
                    /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[11.5px]", children: [
                      order.items_count,
                      " item",
                      order.items_count !== 1 ? "s" : "",
                      " · ",
                      order.created_at
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status] || ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) }),
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[14px]", style: { color: "var(--color-dark-bg)" }, children: fmt(order.total) }),
                  /* @__PURE__ */ jsx(IconChevronRight, { size: 16, className: "text-gray-300 group-hover:text-gray-400 transition-colors" })
                ] })
              ]
            },
            order.id
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
          { href: "/account/orders", label: "All Orders", sub: "View order history", icon: IconPackage },
          { href: "/account/loyalty", label: "Loyalty Points", sub: `${stats.loyalty_points} pts available`, icon: IconStar },
          { href: "/account/wishlist", label: "My Wishlist", sub: `${stats.wishlist_count} saved items`, icon: IconShoppingBag }
        ].map((q) => /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: q.href,
            className: "bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all no-underline group flex items-center gap-3",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  style: { background: "var(--color-primary)15" },
                  children: /* @__PURE__ */ jsx(q.icon, { size: 18, style: { color: "var(--color-primary)" } })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: q.label }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[11.5px] truncate", children: q.sub })
              ] }),
              /* @__PURE__ */ jsx(IconChevronRight, { size: 15, className: "text-gray-300 ml-auto group-hover:text-gray-400 shrink-0" })
            ]
          },
          q.href
        )) })
      ] })
    ] }) }) })
  ] });
}
export {
  AccountIndex as default
};
