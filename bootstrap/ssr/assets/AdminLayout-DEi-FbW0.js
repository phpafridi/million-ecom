import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { u as usePage, L as Link_default } from "../ssr.js";
import { IconMenu, IconBell, IconX, IconLayoutDashboard, IconPackage, IconShoppingBag, IconUsers, IconCategory, IconTag, IconStar, IconMail, IconHeadset, IconPhoto, IconTrendingUp, IconFileText, IconChartBar, IconCreditCard, IconChevronLeft, IconMessageCircle, IconUserCheck, IconPalette, IconWorld, IconLock, IconPointFilled, IconSettings, IconExternalLink, IconUser, IconLogout, IconChevronDown } from "@tabler/icons-react";
const NAV = [
  {
    group: "STORE",
    defaultOpen: true,
    items: [
      { label: "Dashboard", icon: IconLayoutDashboard, path: "" },
      { label: "Products", icon: IconPackage, path: "/products" },
      { label: "Orders", icon: IconShoppingBag, path: "/orders" },
      { label: "Customers", icon: IconUsers, path: "/customers" },
      { label: "Categories", icon: IconCategory, path: "/categories" }
    ]
  },
  {
    group: "MARKETING",
    defaultOpen: false,
    items: [
      { label: "Coupons", icon: IconTag, path: "/coupons" },
      { label: "Reviews", icon: IconStar, path: "/reviews" },
      { label: "Email Campaigns", icon: IconMail, path: "/email-campaigns" },
      { label: "Support", icon: IconHeadset, path: "/support" }
    ]
  },
  {
    group: "CONTENT",
    defaultOpen: false,
    items: [
      { label: "Hero Slides", icon: IconPhoto, path: "/hero-slides" },
      { label: "Banners", icon: IconTrendingUp, path: "/banners" },
      { label: "Pages", icon: IconFileText, path: "/pages" }
    ]
  },
  {
    group: "CONFIGURATION",
    defaultOpen: false,
    items: [
      { label: "Analytics", icon: IconChartBar, path: "/analytics" },
      { label: "Reports", icon: IconChartBar, path: "/reports" },
      { label: "Payments", icon: IconCreditCard, path: "/payments" },
      { label: "Returns", icon: IconChevronLeft, path: "/returns" },
      { label: "Live Chat", icon: IconMessageCircle, path: "/chat" },
      { label: "Staff", icon: IconUserCheck, path: "/staff" },
      { label: "WhatsApp", icon: IconMessageCircle, path: "/whatsapp" },
      { label: "Theme", icon: IconPalette, path: "/theme" },
      { label: "SEO", icon: IconWorld, path: "/seo" },
      { label: "IP Firewall", icon: IconLock, path: "/blocked-ips" },
      { label: "System Logs", icon: IconLock, path: "/system-logs" },
      { label: "Backup", icon: IconPointFilled, path: "/backup" },
      { label: "Settings", icon: IconSettings, path: "/settings" }
    ]
  }
];
function NavGroup({ group, items, defaultOpen, ap, url, onNav }) {
  const hasActive = items.some((i) => {
    const full = ap + i.path;
    return i.path === "" ? url === ap || url === ap + "/" : url.startsWith(full);
  });
  const [open, setOpen] = useState(defaultOpen || hasActive);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        className: "flex items-center justify-between w-full px-3 py-1.5 mb-0.5 border-none bg-transparent cursor-pointer group",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-[.16em] text-white/30 group-hover:text-white/50 transition-colors", children: group }),
          /* @__PURE__ */ jsx(
            IconChevronDown,
            {
              size: 11,
              className: "text-white/20 group-hover:text-white/40 transition-all flex-shrink-0",
              style: { transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "space-y-0.5 mb-1", children: items.map((item) => {
      const full = ap + item.path;
      const active = item.path === "" ? url === ap || url === ap + "/" : url.startsWith(full);
      return /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: full,
          onClick: onNav,
          className: `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all no-underline ${active ? "" : "text-white/55 hover:text-white hover:bg-white/6"}`,
          style: active ? { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" } : {},
          children: [
            /* @__PURE__ */ jsx(item.icon, { size: 16, className: "flex-shrink-0" }),
            item.label
          ]
        },
        item.label + item.path
      );
    }) })
  ] });
}
function AdminLayout({ children, title }) {
  var _a, _b, _c, _d, _e, _f, _g;
  const { url, props } = usePage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const siteName = ((_a = props.settings) == null ? void 0 : _a.site_name) ?? "MILLIONAIRE";
  const initial = ((_b = siteName[0]) == null ? void 0 : _b.toUpperCase()) ?? "M";
  const userName = ((_d = (_c = props.auth) == null ? void 0 : _c.user) == null ? void 0 : _d.name) ?? "Admin";
  const notifs = props.adminNotifications;
  const Sidebar = () => /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 h-16 border-b border-white/8 flex-shrink-0", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-8 h-8 rounded-lg flex items-center justify-center font-black text-[14px] flex-shrink-0",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
          children: initial
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-white text-[13px] leading-none truncate", children: siteName }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-white/35 font-semibold uppercase tracking-widest mt-0.5", children: "Admin Panel" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMobileOpen(false),
          className: "lg:hidden text-white/40 hover:text-white border-none bg-transparent cursor-pointer p-1",
          children: /* @__PURE__ */ jsx(IconX, { size: 17 })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto py-3 px-2 space-y-2", children: NAV.map((g) => /* @__PURE__ */ jsx(
      NavGroup,
      {
        ...g,
        ap,
        url,
        onNav: () => setMobileOpen(false)
      },
      g.group
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-white/8 px-2 py-2 space-y-0.5 flex-shrink-0", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/",
          target: "_blank",
          className: "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-white/45 hover:text-white hover:bg-white/6 transition-all no-underline",
          children: [
            /* @__PURE__ */ jsx(IconExternalLink, { size: 15 }),
            " View Store"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `${ap}/profile`,
          className: "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-white/45 hover:text-white hover:bg-white/6 transition-all no-underline",
          children: [
            /* @__PURE__ */ jsx(IconUser, { size: 15 }),
            " My Profile"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: "/logout",
          method: "post",
          as: "button",
          className: "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all w-full border-none bg-transparent cursor-pointer text-left",
          children: [
            /* @__PURE__ */ jsx(IconLogout, { size: 15 }),
            " Logout"
          ]
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", style: { background: "var(--color-body-bg,#f0f2f5)" }, children: [
    /* @__PURE__ */ jsx(
      "aside",
      {
        className: "hidden lg:flex w-56 flex-col flex-shrink-0 h-full",
        style: { background: "var(--color-dark-bg,#0a0a0a)" },
        children: /* @__PURE__ */ jsx(Sidebar, {})
      }
    ),
    mobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-40 lg:hidden", onClick: () => setMobileOpen(false) }),
      /* @__PURE__ */ jsx(
        "aside",
        {
          className: "fixed top-0 left-0 bottom-0 w-60 z-50 lg:hidden flex flex-col",
          style: { background: "var(--color-dark-bg,#0a0a0a)" },
          children: /* @__PURE__ */ jsx(Sidebar, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "bg-white border-b border-gray-100 h-14 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMobileOpen(true),
            className: "lg:hidden text-gray-500 hover:text-gray-800 border-none bg-transparent cursor-pointer p-1",
            children: /* @__PURE__ */ jsx(IconMenu, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-manrope font-bold text-[16px] text-gray-900 truncate", children: title }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
          ((_e = props.flash) == null ? void 0 : _e.success) && /* @__PURE__ */ jsxs("span", { className: "hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full", children: [
            "✓ ",
            props.flash.success
          ] }),
          ((notifs == null ? void 0 : notifs.total) ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setBellOpen((o) => !o),
                className: "relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 border-none cursor-pointer bg-transparent text-gray-600 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(IconBell, { size: 19 }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full text-[9px] font-black flex items-center justify-center px-1 border-2 border-white",
                      style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
                      children: notifs.total
                    }
                  )
                ]
              }
            ),
            bellOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40", onClick: () => setBellOpen(false) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-11 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-gray-100 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-black text-[14px] text-gray-800", children: "Notifications" }),
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "text-[11px] font-bold px-2 py-0.5 rounded-full",
                      style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
                      children: [
                        notifs.total,
                        " new"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
                  notifs.pendingOrders > 0 && /* @__PURE__ */ jsxs(
                    Link_default,
                    {
                      href: `${ap}/orders?status=pending`,
                      onClick: () => setBellOpen(false),
                      className: "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0", style: { background: "#FEF3C7" }, children: "🛍" }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("p", { className: "text-[13px] font-bold text-gray-800", children: [
                            notifs.pendingOrders,
                            " Pending Order",
                            notifs.pendingOrders !== 1 ? "s" : ""
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400", children: "Waiting to be processed" })
                        ] })
                      ]
                    }
                  ),
                  notifs.lowStockCount > 0 && /* @__PURE__ */ jsxs(
                    Link_default,
                    {
                      href: `${ap}/products`,
                      onClick: () => setBellOpen(false),
                      className: "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0", style: { background: "#FEE2E2" }, children: "📦" }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("p", { className: "text-[13px] font-bold text-gray-800", children: [
                            notifs.lowStockCount,
                            " Low Stock"
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400", children: "Products running low" })
                        ] })
                      ]
                    }
                  ),
                  notifs.pendingReviews > 0 && /* @__PURE__ */ jsxs(
                    Link_default,
                    {
                      href: `${ap}/reviews`,
                      onClick: () => setBellOpen(false),
                      className: "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 no-underline",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0", style: { background: "#EDE9FE" }, children: "⭐" }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsxs("p", { className: "text-[13px] font-bold text-gray-800", children: [
                            notifs.pendingReviews,
                            " Review",
                            notifs.pendingReviews !== 1 ? "s" : "",
                            " to Approve"
                          ] }),
                          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400", children: "Awaiting moderation" })
                        ] })
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: `${ap}/profile`,
              className: "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 no-underline transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0",
                    style: { background: "var(--color-primary)" },
                    children: (_f = userName[0]) == null ? void 0 : _f.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:block text-[13px] font-semibold text-gray-700", children: userName })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto p-4 sm:p-6", children: [
        ((_g = props.flash) == null ? void 0 : _g.error) && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700", children: [
          "⚠ ",
          props.flash.error
        ] }),
        children
      ] })
    ] })
  ] });
}
export {
  AdminLayout as A
};
