import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconTruck, IconHeadset } from "@tabler/icons-react";
import { motion } from "framer-motion";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function Home({ categories, settings }) {
  const tiles = categories.slice(0, 2);
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setExpanded(false), 3e3);
    return () => clearTimeout(t);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Home" }),
    /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", zIndex: 5 }, children: [
        /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "no-underline", style: { display: "inline-flex", alignItems: "center", gap: 10 }, children: [
          (settings == null ? void 0 : settings.logo_url) && /* @__PURE__ */ jsx(
            "img",
            {
              src: settings.logo_url,
              alt: (settings == null ? void 0 : settings.site_name) ?? "Logo",
              style: { height: "clamp(30px,4vw,44px)", width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }
            }
          ),
          /* @__PURE__ */ jsx("span", { style: { color: "#fff", fontSize: "clamp(20px,3vw,28px)", fontWeight: 500, letterSpacing: "0.15em", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }, children: (settings == null ? void 0 : settings.site_name) ?? "MILLIONAIRE" })
        ] }),
        (settings == null ? void 0 : settings.site_tagline) && /* @__PURE__ */ jsx("div", { style: { color: "rgba(255,255,255,0.85)", fontSize: "clamp(10px,1.3vw,13px)", letterSpacing: "0.2em", marginTop: 8, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }, children: settings.site_tagline.toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { position: "absolute", top: 20, right: 16, zIndex: 6, display: "flex", flexDirection: "column", gap: 8 }, children: [
        /* @__PURE__ */ jsxs(
          motion.a,
          {
            href: "/track-order",
            className: "no-underline",
            layout: true,
            transition: { duration: 0.35, ease: "easeInOut" },
            style: { background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: expanded ? 10 : 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: expanded ? "8px 14px" : 0, width: expanded ? "auto" : 34, height: expanded ? "auto" : 34, overflow: "hidden" },
            children: [
              /* @__PURE__ */ jsx(IconTruck, { size: 16, style: { color: "#C9A84C", flexShrink: 0 } }),
              expanded && /* @__PURE__ */ jsx("span", { style: { color: "#fff", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }, children: "Track Order" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.a,
          {
            href: "/contact",
            className: "no-underline",
            layout: true,
            transition: { duration: 0.35, ease: "easeInOut" },
            style: { background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: expanded ? 10 : 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: expanded ? "8px 14px" : 0, width: expanded ? "auto" : 34, height: expanded ? "auto" : 34, overflow: "hidden" },
            children: [
              /* @__PURE__ */ jsx(IconHeadset, { size: 16, style: { color: "#C9A84C", flexShrink: 0 } }),
              expanded && /* @__PURE__ */ jsx("span", { style: { color: "#fff", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }, children: "Support 24/7" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row", style: { height: "100dvh" }, children: tiles.map((cat) => /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `/category/${cat.slug}`,
          className: "relative block no-underline overflow-hidden group flex-1",
          style: { minHeight: "50dvh" },
          children: [
            /* @__PURE__ */ jsxs("picture", { children: [
              /* @__PURE__ */ jsx("source", { media: "(min-width: 640px)", srcSet: cat.image ?? "/images/placeholder.jpg" }),
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: cat.mobile_image ?? cat.image ?? "/images/placeholder.jpg",
                  alt: cat.name,
                  className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                  loading: "lazy"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 50%)" } }),
            /* @__PURE__ */ jsxs("div", { style: { position: "absolute", bottom: 28, left: 0, right: 0, textAlign: "center" }, children: [
              /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#fff", fontSize: "clamp(22px,3vw,30px)", fontWeight: 500, letterSpacing: "0.1em" }, children: cat.name.toUpperCase() }),
              /* @__PURE__ */ jsx("span", { style: { display: "block", color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 6 }, children: "Shop the collection →" })
            ] })
          ]
        },
        cat.id
      )) })
    ] })
  ] });
}
export {
  Home as default
};
