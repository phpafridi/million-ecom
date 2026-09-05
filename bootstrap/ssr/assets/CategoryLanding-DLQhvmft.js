import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconChevronLeft } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function CategoryLanding({ category, children, settings }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head_default, { title: category.name }),
    /* @__PURE__ */ jsxs("div", { style: { background: (settings == null ? void 0 : settings.category_page_bg_color) || "var(--color-dark-bg, #0a0a0a)", minHeight: "100dvh", paddingBottom: 24 }, children: [
      /* @__PURE__ */ jsxs("div", { style: { position: "relative", padding: "20px 16px 16px", background: "#000" }, children: [
        /* @__PURE__ */ jsx(
          Link_default,
          {
            href: "/",
            "aria-label": "Back to home",
            className: "no-underline",
            style: { position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
            children: /* @__PURE__ */ jsx(IconChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "no-underline", style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
            (settings == null ? void 0 : settings.logo_url) && /* @__PURE__ */ jsx(
              "img",
              {
                src: settings.logo_url,
                alt: (settings == null ? void 0 : settings.site_name) ?? "Logo",
                style: { height: "clamp(24px,3vw,32px)", width: "auto", objectFit: "contain" }
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { color: (settings == null ? void 0 : settings.category_page_title_color) || "#fff", fontSize: "clamp(15px,2vw,20px)", fontWeight: 500, letterSpacing: "0.15em" }, children: (settings == null ? void 0 : settings.site_name) ?? "MILLIONAIRE" })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6, letterSpacing: "0.1em" }, children: category.name.toUpperCase() })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-2", style: { padding: "4px 12px 0" }, children: children.map((child) => /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `/category/${child.slug}`,
          className: "relative block no-underline overflow-hidden group",
          style: { borderRadius: 10, height: "clamp(140px,20vw,220px)" },
          children: [
            /* @__PURE__ */ jsxs("picture", { children: [
              /* @__PURE__ */ jsx("source", { media: "(min-width: 1024px)", srcSet: child.image ?? "/images/placeholder.jpg" }),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: child.mobile_image ?? child.image ?? "/images/placeholder.jpg",
                  alt: child.name,
                  className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]",
                  loading: "lazy"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 50%,transparent 100%)" } }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center" }, children: /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#fff", fontSize: "clamp(11px,1.4vw,14px)", fontWeight: 600, letterSpacing: "0.04em" }, children: child.name.toUpperCase() }) })
          ]
        },
        child.id
      )) })
    ] })
  ] });
}
export {
  CategoryLanding as default
};
