import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { a as useForm, H as Head_default, L as Link_default } from "../ssr.js";
import { IconShieldLock, IconMail, IconLock, IconLogin } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function Login({ settings, isAdmin = false }) {
  var _a;
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const siteName = (settings == null ? void 0 : settings.site_name) ?? "Our Store";
  const tagline = (settings == null ? void 0 : settings.site_tagline) ?? "Admin Panel";
  const initial = ((_a = siteName[0]) == null ? void 0 : _a.toUpperCase()) ?? "O";
  const adminPath = (settings == null ? void 0 : settings.admin_path) || "ml-admin";
  function submit(e) {
    e.preventDefault();
    post(isAdmin ? `/${adminPath}/login` : "/login");
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center p-4", style: { background: "var(--color-body-bg, #f0f2f5)" }, children: [
    /* @__PURE__ */ jsx(Head_default, { title: `Sign In — ${siteName}` }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-3 mb-2", children: (settings == null ? void 0 : settings.logo_url) ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("img", { src: settings.logo_url, alt: siteName, className: "h-12 w-auto object-contain", style: { maxWidth: 90 } }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-2xl tracking-wider leading-none", style: { color: (settings == null ? void 0 : settings.header_title_color) || "var(--color-dark-bg, #0a0e1a)" }, children: siteName.toUpperCase() }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold tracking-[.16em] uppercase mt-0.5", style: { color: (settings == null ? void 0 : settings.header_subtitle_color) || "var(--color-primary, #00c8ff)" }, children: tagline })
          ] })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-12 h-12 rounded-[14px] flex items-center justify-center shadow-lg",
              style: { background: "var(--color-dark-bg, #0a0e1a)" },
              children: /* @__PURE__ */ jsx("span", { className: "font-manrope font-black text-xl", style: { color: "var(--color-primary, #00c8ff)" }, children: initial })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-2xl tracking-wider leading-none", style: { color: (settings == null ? void 0 : settings.header_title_color) || "var(--color-dark-bg, #0a0e1a)" }, children: siteName.toUpperCase() }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold tracking-[.16em] uppercase mt-0.5", style: { color: (settings == null ? void 0 : settings.header_subtitle_color) || "var(--color-primary, #00c8ff)" }, children: tagline })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-3", children: isAdmin ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-semibold", style: { color: "var(--color-primary,#00c8ff)" }, children: [
          /* @__PURE__ */ jsx(IconShieldLock, { size: 14 }),
          " Staff sign in"
        ] }) : "Sign in to your account" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-8", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: "Email address" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(IconMail, { size: 17, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  placeholder: "admin@yourstore.com",
                  required: true,
                  autoFocus: true,
                  className: "w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary,#00c8ff)]"
                }
              )
            ] }),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(IconLock, { size: 17, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  placeholder: "••••••••",
                  required: true,
                  className: "w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary,#00c8ff)]"
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2.5 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: data.remember,
                onChange: (e) => setData("remember", e.target.checked),
                className: "w-4 h-4 rounded cursor-pointer",
                style: { accentColor: "var(--color-primary,#00c8ff)" }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Remember me" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full h-12 disabled:opacity-60 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border-none cursor-pointer",
              style: { background: "var(--color-primary,#00c8ff)", color: "var(--color-primary-text,#0a0e1a)" },
              children: [
                /* @__PURE__ */ jsx(IconLogin, { size: 18 }),
                processing ? "Signing in…" : "Sign In"
              ]
            }
          )
        ] }),
        !isAdmin && /* @__PURE__ */ jsx("div", { className: "mt-6 pt-5 border-t border-gray-100 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsx(Link_default, { href: "/register", className: "font-semibold no-underline", style: { color: "var(--color-primary,#00c8ff)" }, children: "Create one" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-gray-400 mt-5", children: /* @__PURE__ */ jsx(Link_default, { href: "/", className: "hover:underline no-underline text-gray-400", children: "← Back to store" }) })
    ] })
  ] });
}
export {
  Login as default
};
