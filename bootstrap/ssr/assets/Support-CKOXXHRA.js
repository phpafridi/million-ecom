import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, L as Link_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-Cs1s_TRO.js";
import { IconBrandWhatsapp, IconPhone, IconMail, IconTicket, IconCheck, IconSend } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function Support({ settings, orders, auth }) {
  var _a, _b;
  const { props } = usePage();
  const flash = props.flash;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: ((_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.name) ?? "",
    email: ((_b = auth == null ? void 0 : auth.user) == null ? void 0 : _b.email) ?? "",
    phone: "",
    order_id: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  function submit(e) {
    e.preventDefault();
    post("/support", { onSuccess: () => reset("subject", "message", "phone") });
  }
  const wa = settings.whatsapp_number ?? "";
  const ph = settings.phone ?? "";
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Support — MILLIONAIRE" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "font-black text-[32px] sm:text-[40px]",
            style: { fontFamily: "Manrope,sans-serif", color: "var(--color-body-text)" },
            children: "How Can We Help?"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-[16px] mt-2", children: "We reply within 24 hours — usually much faster" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          wa && /* @__PURE__ */ jsxs(
            "a",
            {
              href: `https://wa.me/${wa}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline group",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 22, color: "white" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[14px] text-gray-800", children: "WhatsApp" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-400", children: "Quick response · Usually instant" })
                ] })
              ]
            }
          ),
          ph && /* @__PURE__ */ jsxs(
            "a",
            {
              href: `tel:${ph}`,
              className: "flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline",
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    style: { background: "var(--color-primary)" },
                    children: /* @__PURE__ */ jsx(IconPhone, { size: 22, style: { color: "var(--color-primary-text)" } })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[14px] text-gray-800", children: ph }),
                  /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-400", children: "Call us directly" })
                ] })
              ]
            }
          ),
          settings.email && /* @__PURE__ */ jsxs(
            "a",
            {
              href: `mailto:${settings.email}`,
              className: "flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(IconMail, { size: 22, color: "white" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[14px] text-gray-800", children: settings.email }),
                  /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-400", children: "Email support" })
                ] })
              ]
            }
          ),
          (auth == null ? void 0 : auth.user) && /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: "/support/my-tickets",
              className: "flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all no-underline",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(IconTicket, { size: 22, className: "text-purple-600" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[14px] text-gray-800", children: "My Tickets" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-400", children: "View your support history" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-[14px] text-gray-800 mb-3", children: "Common Questions" }),
            [
              ["How do I track my order?", "/track-order"],
              ["What is your return policy?", "/pages/returns"],
              ["How long does delivery take?", "/pages/shipping"],
              ["Can I change my order?", "/contact"]
            ].map(([q, link]) => /* @__PURE__ */ jsxs(
              Link_default,
              {
                href: link,
                className: "block text-[12.5px] font-semibold no-underline py-2 border-b border-gray-50 last:border-0",
                style: { color: "var(--color-primary)" },
                children: [
                  q,
                  " →"
                ]
              },
              q
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-black text-[18px] text-gray-800 mb-5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(IconTicket, { size: 20, style: { color: "var(--color-primary)" } }),
            "Submit a Support Ticket"
          ] }),
          (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 18, className: "text-green-600 mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-green-700 font-semibold text-[13.5px]", children: flash.success })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Name *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]",
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    required: true,
                    placeholder: "Your full name"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Email *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]",
                    value: data.email,
                    onChange: (e) => setData("email", e.target.value),
                    required: true,
                    placeholder: "your@email.com"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Phone" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]",
                    value: data.phone,
                    onChange: (e) => setData("phone", e.target.value),
                    placeholder: "+92 300 0000000"
                  }
                )
              ] }),
              orders.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Related Order" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white",
                    value: data.order_id,
                    onChange: (e) => setData("order_id", e.target.value),
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "None" }),
                      orders.map((o) => /* @__PURE__ */ jsxs("option", { value: o.id, children: [
                        "Order #",
                        o.order_number ?? o.id,
                        " — ",
                        o.status
                      ] }, o.id))
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Subject *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "w-full h-11 px-4 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)]",
                  value: data.subject,
                  onChange: (e) => setData("subject", e.target.value),
                  required: true,
                  placeholder: "Brief description of your issue"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Priority" }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [["low", "Low", "#6B7280"], ["normal", "Normal", "#3B82F6"], ["high", "High", "#F59E0B"]].map(([v, l, c]) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setData("priority", v),
                  className: "flex-1 h-10 rounded-xl text-[12.5px] font-bold border-2 cursor-pointer transition-all",
                  style: {
                    borderColor: data.priority === v ? c : "#E5E7EB",
                    background: data.priority === v ? c + "15" : "white",
                    color: data.priority === v ? c : "#9CA3AF"
                  },
                  children: l
                },
                v
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Message *" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "w-full px-4 py-3 border border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none",
                  rows: 5,
                  value: data.message,
                  onChange: (e) => setData("message", e.target.value),
                  required: true,
                  placeholder: "Describe your issue in detail. Include order numbers, product names, or any relevant information."
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "w-full h-12 rounded-xl font-black text-[14px] border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60",
                style: { background: "var(--color-dark-bg)", color: "white" },
                children: [
                  /* @__PURE__ */ jsx(IconSend, { size: 17 }),
                  processing ? "Sending..." : "Submit Ticket — We'll Reply Within 24hrs"
                ]
              }
            )
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  Support as default
};
