import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-BxLnnCms.js";
import AccountSidebar from "./AccountSidebar-zWUfAXZr.js";
import { IconCheck, IconUser, IconLock, IconMapPin, IconTrash, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
function AccountProfile({ user, addresses, settings, auth }) {
  const { props } = usePage();
  const flash = props.flash;
  const [tab, setTab] = useState("info");
  const profileForm = useForm({
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    gender: user.gender ?? "",
    city: user.city ?? "",
    address: user.address ?? "",
    date_of_birth: user.date_of_birth ?? "",
    newsletter_subscribed: user.newsletter_subscribed ?? false
  });
  const passForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const addrForm = useForm({
    label: "Home",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    is_default: false
  });
  const [showAddrForm, setShowAddrForm] = useState(false);
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "My Profile" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-0 lg:py-8 px-0 lg:px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-4 px-4 pt-5 lg:px-0 lg:pt-0", children: [
        (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-[13.5px] font-semibold", children: [
          /* @__PURE__ */ jsx(IconCheck, { size: 16 }),
          " ",
          flash.success
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "flex border-b border-gray-100", children: [
            { key: "info", label: "Personal Info", icon: IconUser },
            { key: "password", label: "Password", icon: IconLock },
            { key: "address", label: "Addresses", icon: IconMapPin }
          ].map((t) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTab(t.key),
              className: "flex items-center gap-2 px-5 py-3.5 text-[13px] font-bold border-none cursor-pointer transition-all border-b-2 -mb-px",
              style: tab === t.key ? { color: "var(--color-primary)", borderColor: "var(--color-primary)", background: "white" } : { color: "#9CA3AF", borderColor: "transparent", background: "white" },
              children: [
                /* @__PURE__ */ jsx(t.icon, { size: 15 }),
                " ",
                t.label
              ]
            },
            t.key
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            tab === "info" && /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
              e.preventDefault();
              profileForm.post("/account/profile");
            }, children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                [
                  { label: "Full Name", field: "name", type: "text" },
                  { label: "Email Address", field: "email", type: "email" },
                  { label: "Phone Number", field: "phone", type: "tel" },
                  { label: "Date of Birth", field: "date_of_birth", type: "date" },
                  { label: "City", field: "city", type: "text" }
                ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide", children: f.label }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: f.type,
                      value: profileForm.data[f.field],
                      onChange: (e) => profileForm.setData(f.field, e.target.value),
                      className: "w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none focus:border-[var(--color-primary)]"
                    }
                  ),
                  profileForm.errors[f.field] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-[11.5px] mt-1", children: profileForm.errors[f.field] })
                ] }, f.field)),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide", children: "Gender" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: profileForm.data.gender,
                      onChange: (e) => profileForm.setData("gender", e.target.value),
                      className: "w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Select" }),
                        /* @__PURE__ */ jsx("option", { value: "male", children: "Male" }),
                        /* @__PURE__ */ jsx("option", { value: "female", children: "Female" }),
                        /* @__PURE__ */ jsx("option", { value: "other", children: "Other" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide", children: "Address" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: profileForm.data.address,
                    onChange: (e) => profileForm.setData("address", e.target.value),
                    rows: 2,
                    className: "w-full px-4 py-3 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none resize-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    id: "newsletter",
                    checked: profileForm.data.newsletter_subscribed,
                    onChange: (e) => profileForm.setData("newsletter_subscribed", e.target.checked),
                    className: "w-4 h-4 rounded"
                  }
                ),
                /* @__PURE__ */ jsx("label", { htmlFor: "newsletter", className: "text-[13px] text-gray-600 font-medium cursor-pointer", children: "Subscribe to newsletter for exclusive offers" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: profileForm.processing,
                  className: "mt-5 h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: profileForm.processing ? "Saving..." : "Save Changes"
                }
              )
            ] }),
            tab === "password" && /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
              e.preventDefault();
              passForm.post("/account/profile");
            }, className: "max-w-md space-y-4", children: [
              [
                { label: "Current Password", field: "current_password" },
                { label: "New Password", field: "password" },
                { label: "Confirm Password", field: "password_confirmation" }
              ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide", children: f.label }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    value: passForm.data[f.field],
                    onChange: (e) => passForm.setData(f.field, e.target.value),
                    className: "w-full h-11 px-4 rounded-xl border border-gray-200 text-[13.5px] focus:outline-none"
                  }
                ),
                passForm.errors[f.field] && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-[11.5px] mt-1", children: passForm.errors[f.field] })
              ] }, f.field)),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: passForm.processing,
                  className: "h-11 px-8 rounded-xl font-bold text-[14px] disabled:opacity-60 cursor-pointer border-none",
                  style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                  children: passForm.processing ? "Updating..." : "Update Password"
                }
              )
            ] }),
            tab === "address" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              addresses.map((addr) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: addr.label }),
                    addr.is_default && /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "text-[10px] font-bold px-2 py-0.5 rounded-full text-white",
                        style: { background: "var(--color-primary)" },
                        children: "Default"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-600", children: [
                    addr.full_name,
                    " · ",
                    addr.phone
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-gray-400 mt-0.5", children: [
                    addr.address,
                    ", ",
                    addr.city
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      const f = useForm({});
                      f.delete(`/account/addresses/${addr.id}`);
                    },
                    className: "text-gray-400 hover:text-red-500 border-none bg-transparent cursor-pointer p-1",
                    children: /* @__PURE__ */ jsx(IconTrash, { size: 15 })
                  }
                )
              ] }, addr.id)),
              !showAddrForm ? /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setShowAddrForm(true),
                  className: "flex items-center gap-2 h-11 px-5 rounded-xl border-2 border-dashed border-gray-200 text-[13px] font-bold text-gray-400 hover:border-gray-300 w-full justify-center cursor-pointer bg-transparent",
                  children: [
                    /* @__PURE__ */ jsx(IconPlus, { size: 16 }),
                    " Add New Address"
                  ]
                }
              ) : /* @__PURE__ */ jsxs("div", { className: "border border-gray-200 rounded-xl p-4", children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] mb-4", style: { color: "var(--color-dark-bg)" }, children: "New Address" }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  [
                    { label: "Label", field: "label", type: "text", placeholder: "Home / Office" },
                    { label: "Full Name", field: "full_name", type: "text", placeholder: "Your name" },
                    { label: "Phone", field: "phone", type: "tel", placeholder: "03xx-xxxxxxx" },
                    { label: "City", field: "city", type: "text", placeholder: "Lahore" }
                  ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-400 mb-1", children: f.label }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: f.type,
                        placeholder: f.placeholder,
                        value: addrForm.data[f.field],
                        onChange: (e) => addrForm.setData(f.field, e.target.value),
                        className: "w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] focus:outline-none"
                      }
                    )
                  ] }, f.field)),
                  /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-400 mb-1", children: "Address" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Street address",
                        value: addrForm.data.address,
                        onChange: (e) => addrForm.setData("address", e.target.value),
                        className: "w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] focus:outline-none"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mt-4", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => addrForm.post("/account/addresses", { onSuccess: () => {
                        setShowAddrForm(false);
                        addrForm.reset();
                      } }),
                      className: "h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer",
                      style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
                      children: "Save Address"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setShowAddrForm(false),
                      className: "h-10 px-5 rounded-xl font-bold text-[13px] border border-gray-200 bg-white text-gray-600 cursor-pointer",
                      children: "Cancel"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  AccountProfile as default
};
