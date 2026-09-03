import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default, L as Link_default } from "../ssr.js";
import { IconArrowLeft } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-Cs1s_TRO.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function CategoryLanding({ category, children, settings, auth }) {
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: category.name }),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-2", children: /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "no-underline flex items-center gap-1.5 text-[13px]", style: { color: "var(--color-body-text)" }, children: [
      /* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }),
      /* @__PURE__ */ jsx("span", { children: category.name })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2", children: children.map((child) => /* @__PURE__ */ jsxs(
      Link_default,
      {
        href: `/category/${child.slug}`,
        className: "relative block no-underline overflow-hidden group",
        style: { height: "clamp(180px,32vw,260px)" },
        children: [
          /* @__PURE__ */ jsxs("picture", { children: [
            /* @__PURE__ */ jsx("source", { media: "(min-width: 1024px)", srcSet: child.image ?? "/images/placeholder.jpg" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: child.mobile_image ?? child.image ?? "/images/placeholder.jpg",
                alt: child.name,
                className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                style: { objectPosition: "center 20%" },
                loading: "lazy"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)" } }),
          /* @__PURE__ */ jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 20px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "#fff", fontSize: 19, fontWeight: 500, lineHeight: 1.2 }, children: child.name }),
            /* @__PURE__ */ jsx("span", { style: { display: "block", color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 }, children: "Shop the collection →" })
          ] })
        ]
      },
      child.id
    )) })
  ] });
}
export {
  CategoryLanding as default
};
