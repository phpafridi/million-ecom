import { jsx, jsxs } from "react/jsx-runtime";
import { u as usePage, L as Link_default } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-Dg6pcwSH.js";
import { IconLock, IconArrowLeft } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function NoPermission({ message, section }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  return /* @__PURE__ */ jsx(AdminLayout, { title: "Access Restricted", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] text-center px-4", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
        style: { background: "rgba(201,168,76,0.1)", border: "2px solid var(--color-primary,#C9A84C)" },
        children: /* @__PURE__ */ jsx(IconLock, { size: 36, style: { color: "var(--color-primary,#C9A84C)" } })
      }
    ),
    /* @__PURE__ */ jsx("h1", { className: "text-[24px] font-black text-gray-900 mb-2", children: "Access Restricted" }),
    section && /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold text-gray-400 mb-3 uppercase tracking-wider", children: section }),
    /* @__PURE__ */ jsx("p", { className: "text-[15px] text-gray-500 mb-8 max-w-md", children: message ?? "You don't have permission to access this section. Contact your administrator." }),
    /* @__PURE__ */ jsxs(
      Link_default,
      {
        href: ap,
        className: "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] no-underline transition-all hover:opacity-90",
        style: { background: "var(--color-primary,#C9A84C)", color: "var(--color-primary-text,#0a0a0a)" },
        children: [
          /* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }),
          " Back to Dashboard"
        ]
      }
    )
  ] }) });
}
export {
  NoPermission as default
};
