import { jsxs, jsx } from "react/jsx-runtime";
import { a as useForm, H as Head_default, L as Link_default } from "../ssr.js";
import { IconUser, IconMail, IconLock, IconPhone, IconMapPin } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function Field({ label, icon: Icon, type = "text", placeholder, value, onChange, error, required = false }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-0.5", children: "*" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(Icon, { size: 17, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type,
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder,
          required,
          className: "w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[var(--color-primary,#C9A84C)]"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs mt-1.5", children: error })
  ] });
}
function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    password_confirmation: ""
  });
  function submit(e) {
    e.preventDefault();
    post("/register");
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Create Account" }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxs(Link_default, { href: "/", className: "inline-flex items-center gap-3 mb-3 no-underline", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-12 h-12 rounded-[14px] flex items-center justify-center",
              style: { background: "var(--color-dark-bg,#0a0a0a)" },
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "font-manrope font-black text-xl",
                  style: { color: "var(--color-primary,#C9A84C)" },
                  children: "M"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "font-manrope font-black text-2xl tracking-wider leading-none",
                style: { color: "var(--color-dark-bg,#0a0a0a)" },
                children: "MILLIONAIRE"
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-[9px] font-bold tracking-[.16em] uppercase",
                style: { color: "var(--color-primary,#C9A84C)" },
                children: "Wear Your Status"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm mt-2", children: "Create your account to start shopping" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-8", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsx(Field, { required: true, label: "Full Name", icon: IconUser, placeholder: "Ali Khan", value: data.name, onChange: (v) => setData("name", v), error: errors.name }),
          /* @__PURE__ */ jsx(Field, { required: true, label: "Email", icon: IconMail, type: "email", placeholder: "you@example.com", value: data.email, onChange: (v) => setData("email", v), error: errors.email }),
          /* @__PURE__ */ jsx(Field, { required: true, label: "Password", icon: IconLock, type: "password", placeholder: "Min. 8 characters", value: data.password, onChange: (v) => setData("password", v), error: errors.password }),
          /* @__PURE__ */ jsx(Field, { required: true, label: "Confirm Password", icon: IconLock, type: "password", placeholder: "Repeat password", value: data.password_confirmation, onChange: (v) => setData("password_confirmation", v), error: errors.password_confirmation }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2 border-t border-gray-100", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[11.5px] font-semibold text-gray-400 mb-3 uppercase tracking-wide", children: "Delivery Info (optional — auto-fills checkout)" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx(Field, { label: "Phone Number", icon: IconPhone, type: "tel", placeholder: "03XX XXXXXXX", value: data.phone, onChange: (v) => setData("phone", v), error: errors.phone }),
              /* @__PURE__ */ jsx(Field, { label: "Default Address", icon: IconMapPin, placeholder: "House #, Street, Area", value: data.address, onChange: (v) => setData("address", v), error: errors.address }),
              /* @__PURE__ */ jsx(Field, { label: "City", icon: IconMapPin, placeholder: "Karachi, Lahore, Peshawar…", value: data.city, onChange: (v) => setData("city", v), error: errors.city })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              style: { background: "var(--color-primary,#C9A84C)", color: "var(--color-primary-text,#0a0a0a)" },
              className: "w-full h-12 font-black text-[14px] rounded-xl flex items-center justify-center gap-2 hover:opacity-90 mt-2 disabled:opacity-60 border-none cursor-pointer transition-all",
              children: processing ? "Creating account…" : "Create Account →"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 pt-5 border-t border-gray-100 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsx(
            Link_default,
            {
              href: "/login",
              className: "font-semibold no-underline",
              style: { color: "var(--color-primary,#C9A84C)" },
              children: "Sign in →"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-gray-400 mt-5", children: /* @__PURE__ */ jsx(
        Link_default,
        {
          href: "/",
          className: "no-underline hover:opacity-70",
          style: { color: "var(--color-primary,#C9A84C)" },
          children: "← Back to store"
        }
      ) })
    ] })
  ] });
}
export {
  Register as default
};
