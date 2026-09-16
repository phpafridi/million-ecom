import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconCheck, IconUsers, IconBell, IconSend, IconPlus, IconUpload, IconTrash } from "@tabler/icons-react";
import { C as ConfirmDeleteModal } from "./ConfirmDeleteModal-upZ6GLRW.js";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white transition-colors";
const textareaCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white resize-none transition-colors";
const TEMPLATES = [
  { label: "Sale", subject: "🔥 Big Sale — Up to 50% Off!", body: "Hi {name},\n\nGreat news! We're running a huge sale.\n\n🏷️ Up to 50% off selected items\n🚚 Free delivery on orders over Rs 5,000\n⏰ Limited time only!\n\nShop now: {store_url}\n\n{store_name} Team" },
  { label: "New Arrivals", subject: "✨ New Products Just Arrived!", body: "Hi {name},\n\nWe've just added exciting new products you'll love!\n\n🆕 Fresh arrivals across all categories\n⭐ Handpicked by our team\n\nShop now before they sell out: {store_url}\n\n{store_name} Team" },
  { label: "Follow-up", subject: "How was your experience? 😊", body: "Hi {name},\n\nWe hope you're enjoying your recent purchase!\n\nWe'd love to hear your feedback. A quick review helps other shoppers and means a lot to us.\n\nLeave a review: {store_url}\n\nThank you!\n{store_name} Team" },
  { label: "Custom", subject: "", body: "" }
];
function EmailCampaigns({ subscribers, subscriberCount, orderedCount, registeredCount, totalCount }) {
  var _a, _b;
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const [tab, setTab] = useState("compose");
  const [tpl, setTpl] = useState(0);
  const [showImport, setShowImport] = useState(false);
  const [pendingRemoveSub, setPendingRemoveSub] = useState(null);
  const { data, setData, post, processing } = useForm({
    subject: TEMPLATES[0].subject,
    body: TEMPLATES[0].body,
    audiences: ["subscribers"],
    test_email: ""
  });
  const addForm = useForm({ email: "", name: "" });
  const importForm = useForm({ emails: "" });
  function applyTemplate(i) {
    setTpl(i);
    setData("subject", TEMPLATES[i].subject);
    setData("body", TEMPLATES[i].body);
  }
  function toggleAudience(val) {
    setData("audiences", data.audiences.includes(val) ? data.audiences.filter((a) => a !== val) : [...data.audiences, val]);
  }
  const totalSelected = (data.audiences.includes("subscribers") ? subscriberCount : 0) + (data.audiences.includes("ordered") ? orderedCount : 0) + (data.audiences.includes("registered") ? registeredCount : 0);
  function sendTest(e) {
    e.preventDefault();
    post(`${ap}/email-campaigns/test`);
  }
  function sendCampaign(e) {
    e.preventDefault();
    if (!confirm(`Send to ${totalSelected} recipients?`)) return;
    post(`${ap}/email-campaigns/send`);
  }
  function addSub(e) {
    e.preventDefault();
    addForm.post(`${ap}/email-campaigns/subscribers`, { onSuccess: () => addForm.reset() });
  }
  function importSubs(e) {
    e.preventDefault();
    importForm.post(`${ap}/email-campaigns/subscribers/import`, { onSuccess: () => {
      importForm.reset();
      setShowImport(false);
    } });
  }
  function removeSub(id) {
    setPendingRemoveSub(id);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Email Campaigns", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Email Campaigns" }),
    ((_a = props.flash) == null ? void 0 : _a.success) && /* @__PURE__ */ jsxs("div", { className: "mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(IconCheck, { size: 18, className: "text-green-600 flex-shrink-0" }),
      /* @__PURE__ */ jsx("span", { className: "text-[13.5px] font-semibold text-green-800", children: props.flash.success })
    ] }),
    ((_b = props.flash) == null ? void 0 : _b.error) && /* @__PURE__ */ jsxs("div", { className: "mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-[13.5px] font-semibold text-red-700", children: [
      "⚠ ",
      props.flash.error
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5", children: [
      { label: "Total Reach", count: totalCount, color: "var(--color-primary)" },
      { label: "Subscribers", count: subscriberCount, color: "#8b5cf6" },
      { label: "Past Customers", count: orderedCount, color: "#10b981" },
      { label: "Registered Accounts", count: registeredCount, color: "#f59e0b" }
    ].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "font-manrope font-black text-[22px]", style: { color: s.color }, children: s.count }),
      /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-500 font-semibold", children: s.label })
    ] }, s.label)) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit", children: [["compose", "✉ Compose Campaign"], ["subscribers", "👥 Manage Subscribers"]].map(([t, l]) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setTab(t),
        className: `px-4 py-2 rounded-lg text-[13px] font-bold cursor-pointer border-none transition-all ${tab === t ? "bg-white shadow-sm text-gray-900" : "bg-transparent text-gray-500 hover:text-gray-700"}`,
        children: l
      },
      t
    )) }),
    tab === "compose" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-4", children: "Quick Templates" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: TEMPLATES.map((t, i) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => applyTemplate(i),
              className: `p-3 rounded-xl text-left border-2 cursor-pointer transition-all bg-white text-[13px] font-semibold
                                            ${tpl === i ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-gray-200 text-gray-600 hover:border-gray-300"}`,
              children: t.label
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Compose Email" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Subject Line *" }),
            /* @__PURE__ */ jsx("input", { className: inputCls, value: data.subject, onChange: (e) => setData("subject", e.target.value), placeholder: "Enter subject…" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Message *" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-gray-400 mb-2", children: [
              "Placeholders: ",
              /* @__PURE__ */ jsx("code", { className: "bg-gray-100 px-1 rounded", children: "{name}" }),
              " ",
              /* @__PURE__ */ jsx("code", { className: "bg-gray-100 px-1 rounded", children: "{store_name}" }),
              " ",
              /* @__PURE__ */ jsx("code", { className: "bg-gray-100 px-1 rounded", children: "{store_url}" })
            ] }),
            /* @__PURE__ */ jsx("textarea", { className: textareaCls, rows: 10, value: data.body, onChange: (e) => setData("body", e.target.value), placeholder: "Write your message…" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[14px] mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(IconUsers, { size: 16, style: { color: "var(--color-primary)" } }),
            " Audience",
            /* @__PURE__ */ jsxs("span", { className: "ml-auto text-[12px] font-bold", style: { color: "var(--color-primary)" }, children: [
              totalSelected,
              " selected"
            ] })
          ] }),
          [
            { val: "subscribers", label: "Subscribers", count: subscriberCount, hint: "Manually added email list" },
            { val: "ordered", label: "Past Customers", count: orderedCount, hint: "Placed an order" },
            { val: "registered", label: "Registered Users", count: registeredCount, hint: "Have an account" }
          ].map((a) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: `flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2 transition-all
                                    ${data.audiences.includes(a.val) ? "border-[var(--color-primary)]" : "border-gray-200 hover:border-gray-300"}`,
              style: data.audiences.includes(a.val) ? { background: "var(--color-primary)08" } : {},
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: data.audiences.includes(a.val),
                    onChange: () => toggleAudience(a.val),
                    className: "mt-1",
                    style: { accentColor: "var(--color-primary)" }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13px] text-gray-900", children: a.label }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400", children: a.hint }),
                  /* @__PURE__ */ jsxs("div", { className: "text-[12px] font-bold mt-0.5", style: { color: "var(--color-primary)" }, children: [
                    a.count,
                    " people"
                  ] })
                ] })
              ]
            },
            a.val
          ))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[14px] mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(IconBell, { size: 16, style: { color: "var(--color-primary)" } }),
            " Test First"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mb-3", children: "Always send a test before the real campaign." }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: inputCls,
              type: "email",
              value: data.test_email,
              onChange: (e) => setData("test_email", e.target.value),
              placeholder: "your@email.com"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: sendTest,
              disabled: !data.test_email || processing,
              className: "w-full mt-2 h-10 font-bold text-[13px] rounded-xl border-2 border-gray-200 bg-white cursor-pointer disabled:opacity-50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all",
              children: "Send Test Email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: sendCampaign,
            disabled: !data.subject || !data.body || totalSelected === 0 || processing,
            className: "w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transition-all",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconSend, { size: 17 }),
              processing ? "Sending…" : `Send to ${totalSelected} People`
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-800", children: [
          "⚠️ Configure SMTP in ",
          /* @__PURE__ */ jsx("code", { children: ".env" }),
          " before sending. Test first!"
        ] })
      ] })
    ] }),
    tab === "subscribers" && /* @__PURE__ */ jsxs("div", { className: "max-w-3xl space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-4", children: "Add Subscriber" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: addSub, className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: addForm.data.name,
              onChange: (e) => addForm.setData("name", e.target.value),
              placeholder: "Name (optional)",
              className: "flex-1 h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              required: true,
              value: addForm.data.email,
              onChange: (e) => addForm.setData("email", e.target.value),
              placeholder: "email@example.com",
              className: "flex-1 h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] bg-white"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: addForm.processing,
              className: "h-11 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer flex items-center gap-2 disabled:opacity-60",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: [
                /* @__PURE__ */ jsx(IconPlus, { size: 16 }),
                " Add"
              ]
            }
          )
        ] }),
        addForm.errors.email && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-[12px] mt-2", children: addForm.errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px]", children: "Bulk Import" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowImport(!showImport),
              className: "text-[12.5px] font-bold border border-gray-200 px-3 py-1.5 rounded-lg bg-white cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors",
              children: showImport ? "Hide" : "Import Emails"
            }
          )
        ] }),
        showImport && /* @__PURE__ */ jsxs("form", { onSubmit: importSubs, className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 mb-2", children: "Paste emails — one per line, comma separated, or in any of these formats:" }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11.5px] text-gray-400 bg-gray-50 rounded-lg p-3 mb-3 space-y-0.5 font-mono", children: [
              /* @__PURE__ */ jsx("div", { children: "ali@email.com" }),
              /* @__PURE__ */ jsx("div", { children: "sara@email.com, Sara Khan" }),
              /* @__PURE__ */ jsx("div", { children: "Ahmed Ali <ahmed@email.com>" })
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: importForm.data.emails,
                onChange: (e) => importForm.setData("emails", e.target.value),
                rows: 8,
                placeholder: "Paste emails here…",
                className: textareaCls
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: !importForm.data.emails || importForm.processing,
              className: "flex items-center gap-2 h-10 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer disabled:opacity-50",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
              children: [
                /* @__PURE__ */ jsx(IconUpload, { size: 15 }),
                " ",
                importForm.processing ? "Importing…" : "Import"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[15px]", children: [
          "Subscribers (",
          subscriberCount,
          ")"
        ] }) }),
        subscribers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "px-5 py-12 text-center text-gray-400", children: [
          /* @__PURE__ */ jsx(IconUsers, { size: 36, className: "mx-auto mb-3 text-gray-200" }),
          /* @__PURE__ */ jsx("p", { className: "text-[13px]", children: "No subscribers yet. Add emails above." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: subscribers.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0",
              style: { background: "var(--color-primary)" },
              children: (s.name ?? s.email)[0].toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            s.name && /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-900", children: s.name }),
            /* @__PURE__ */ jsx("div", { className: "text-[12.5px] text-gray-500", children: s.email })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-[10.5px] font-bold text-gray-400 uppercase tracking-wider", children: s.source }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => removeSub(s.id),
              className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-300 bg-white cursor-pointer transition-all",
              children: /* @__PURE__ */ jsx(IconTrash, { size: 13 })
            }
          )
        ] }, s.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ConfirmDeleteModal,
      {
        open: !!pendingRemoveSub,
        title: "Remove this subscriber?",
        onConfirm: () => {
          if (pendingRemoveSub) router3.delete(`${ap}/email-campaigns/subscribers/${pendingRemoveSub}`, { preserveScroll: true, onFinish: () => setPendingRemoveSub(null) });
        },
        onCancel: () => setPendingRemoveSub(null)
      }
    )
  ] });
}
export {
  EmailCampaigns as default
};
