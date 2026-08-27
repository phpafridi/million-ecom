import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { IconUser, IconLock, IconCheck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function ProfileField({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: label }),
    children
  ] });
}
function Profile({ user }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  function submit(e) {
    e.preventDefault();
    post(`${ap}/profile`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "My Profile", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Profile — Admin" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[15px] mb-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(IconUser, { size: 18, style: { color: "var(--color-primary)" } }),
          " Account Information"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs(ProfileField, { label: "Full Name", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                required: true,
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors"
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs(ProfileField, { label: "Email Address", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                required: true,
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors"
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.email })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[15px] mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(IconLock, { size: 18, style: { color: "var(--color-primary)" } }),
          " Change Password"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-400 mb-5", children: "Leave blank to keep your current password." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(ProfileField, { label: "Current Password", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                value: data.current_password,
                onChange: (e) => setData("current_password", e.target.value),
                placeholder: "Enter current password",
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors"
              }
            ),
            errors.current_password && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.current_password })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs(ProfileField, { label: "New Password", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  placeholder: "Min 8 characters",
                  className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors"
                }
              ),
              errors.password && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.password })
            ] }),
            /* @__PURE__ */ jsx(ProfileField, { label: "Confirm New Password", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                value: data.password_confirmation,
                onChange: (e) => setData("password_confirmation", e.target.value),
                placeholder: "Repeat new password",
                className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors"
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "flex items-center justify-center gap-2 h-11 px-8 font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
          children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 16 }),
            " ",
            processing ? "Saving…" : "Save Changes"
          ]
        }
      )
    ] }) })
  ] });
}
export {
  Profile as default
};
