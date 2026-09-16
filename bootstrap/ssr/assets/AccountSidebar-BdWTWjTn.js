import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { u as usePage, L as Link_default } from "../ssr.js";
import { IconLayoutDashboard, IconPackage, IconScissors, IconHeart, IconStar, IconUser, IconTruck, IconLogout } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
const NAV = [
  { href: "/account", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: IconPackage },
  { href: "/account/tailor-orders", label: "Tailor", icon: IconScissors },
  { href: "/account/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/account/loyalty", label: "Loyalty", icon: IconStar },
  { href: "/account/profile", label: "Profile", icon: IconUser },
  { href: "/track-order", label: "Track", icon: IconTruck }
];
function AccountSidebar({ auth }) {
  var _a;
  const { url } = usePage();
  const user = auth == null ? void 0 : auth.user;
  function isActive(href) {
    if (href === "/account") return url === "/account";
    return url.startsWith(href);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "lg:hidden w-full overflow-x-auto", style: { background: "white", borderBottom: "1px solid #F3F4F6" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", padding: "8px 12px", gap: 6, minWidth: "max-content" }, children: [
      NAV.map((item) => {
        const active = isActive(item.href);
        return /* @__PURE__ */ jsxs(Link_default, { href: item.href, style: {
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "7px 14px",
          borderRadius: 100,
          textDecoration: "none",
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
          background: active ? "var(--color-primary)" : "#F3F4F6",
          color: active ? "var(--color-primary-text, #0a0a0a)" : "#6B7280"
        }, children: [
          /* @__PURE__ */ jsx(item.icon, { size: 13 }),
          item.label
        ] }, item.href);
      }),
      /* @__PURE__ */ jsxs(Link_default, { href: "/logout", method: "post", as: "button", style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "7px 14px",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        background: "#FEF2F2",
        color: "#EF4444",
        border: "none",
        cursor: "pointer"
      }, children: [
        /* @__PURE__ */ jsx(IconLogout, { size: 13 }),
        " Logout"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 sticky top-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center mb-5 pb-5 border-b border-gray-100", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black mb-3",
            style: { background: "var(--color-primary)" },
            children: (_a = user == null ? void 0 : user.name) == null ? void 0 : _a.charAt(0).toUpperCase()
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px]", style: { color: "var(--color-body-text)" }, children: user == null ? void 0 : user.name }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[11.5px] mt-0.5 truncate w-full", children: user == null ? void 0 : user.email })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "space-y-0.5", children: [
        NAV.map((item) => {
          const active = isActive(item.href);
          return /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: item.href,
              className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold no-underline transition-all",
              style: active ? { background: "var(--color-primary)", color: "var(--color-primary-text)" } : { color: "#6B7280" },
              children: [
                /* @__PURE__ */ jsx(item.icon, { size: 16 }),
                item.label
              ]
            },
            item.href
          );
        }),
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: "/logout",
            method: "post",
            as: "button",
            className: "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 w-full border-none bg-transparent cursor-pointer mt-2",
            children: [
              /* @__PURE__ */ jsx(IconLogout, { size: 16 }),
              " Logout"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AccountSidebar as default
};
