import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { IconArrowLeft, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function CategoryTile({ child }) {
  const THRESHOLD = 80;
  function handleDragEnd(_, info) {
    if (info.offset.x < -THRESHOLD) {
      router3.visit(`/category/${child.slug}`);
    } else if (info.offset.x > THRESHOLD) {
      router3.visit("/");
    }
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "relative overflow-hidden",
      style: { height: "100dvh" },
      drag: "x",
      dragConstraints: { left: 0, right: 0 },
      dragElastic: 0.15,
      onDragEnd: handleDragEnd,
      children: [
        /* @__PURE__ */ jsxs(Link_default, { href: `/category/${child.slug}`, className: "relative block no-underline overflow-hidden group", style: { height: "100%" }, children: [
          /* @__PURE__ */ jsxs("picture", { children: [
            /* @__PURE__ */ jsx("source", { media: "(min-width: 1024px)", srcSet: child.image ?? "/images/placeholder.jpg" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: child.mobile_image ?? child.image ?? "/images/placeholder.jpg",
                alt: child.name,
                className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                loading: "lazy",
                draggable: false
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)" } }),
          /* @__PURE__ */ jsxs("div", { style: { position: "absolute", bottom: 32, left: 0, right: 0, textAlign: "center" }, children: [
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#fff", fontSize: "clamp(22px,3vw,30px)", fontWeight: 500, letterSpacing: "0.1em" }, children: child.name.toUpperCase() }),
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 8 }, children: "Shop the collection →" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => router3.visit("/"),
            "aria-label": "Back to home",
            className: "no-underline",
            style: { position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "none", cursor: "pointer" },
            children: /* @__PURE__ */ jsx(IconChevronLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => router3.visit(`/category/${child.slug}`),
            "aria-label": `Shop ${child.name}`,
            className: "no-underline",
            style: { position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "none", cursor: "pointer" },
            children: /* @__PURE__ */ jsx(IconChevronRight, { size: 20 })
          }
        )
      ]
    }
  );
}
function CategoryLanding({ category, children, settings }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head_default, { title: category.name }),
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: 5 }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 20, left: 0, right: 0, textAlign: "center" }, children: /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "no-underline", style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
        (settings == null ? void 0 : settings.logo_url) && /* @__PURE__ */ jsx(
          "img",
          {
            src: settings.logo_url,
            alt: (settings == null ? void 0 : settings.site_name) ?? "Logo",
            style: { height: "clamp(26px,3.5vw,36px)", width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }
          }
        ),
        /* @__PURE__ */ jsx("span", { style: { color: "#fff", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 500, letterSpacing: "0.15em", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }, children: (settings == null ? void 0 : settings.site_name) ?? "MILLIONAIRE" })
      ] }) }),
      /* @__PURE__ */ jsx(Link_default, { href: "/", className: "no-underline flex items-center gap-1.5", style: { position: "absolute", top: 22, left: 16, color: "#fff", fontSize: 13, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }, children: /* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2", children: children.map((child) => /* @__PURE__ */ jsx(CategoryTile, { child }, child.id)) })
  ] });
}
export {
  CategoryLanding as default
};
