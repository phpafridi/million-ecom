import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@tabler/icons-react";
function PagesIndex({ pages, settings }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const [active, setActive] = useState(Object.keys(pages)[0]);
  const page = pages[active];
  const allFields = Object.values(pages).flatMap((p) => p.fields);
  const initialData = Object.fromEntries(allFields.map((f) => [f.key, settings[f.key] ?? ""]));
  const { data, setData, put, processing, recentlySuccessful } = useForm(initialData);
  function save(e) {
    e.preventDefault();
    put(`${ap}/pages/${active}`);
  }
  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white";
  const textareaCls = inputCls + " resize-y min-h-[120px] leading-relaxed";
  return /* @__PURE__ */ jsxs(AdminLayout, { auth: usePage().props.auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Pages" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-black text-[22px] text-gray-900", children: "Pages & Policies" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] text-gray-500 mt-1", children: "Edit all public pages and policy content. All changes are live immediately after saving." })
      ] }),
      recentlySuccessful && /* @__PURE__ */ jsxs("div", { className: "mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-semibold", children: [
        "✅ ",
        page.title,
        " saved successfully."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-5 flex-col lg:flex-row", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:w-56 flex-shrink-0", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: Object.entries(pages).map(([key, pg]) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActive(key),
              className: "w-full flex items-center gap-3 px-4 py-3.5 text-left border-none cursor-pointer transition-all text-[13px] font-semibold border-b border-gray-50 last:border-0",
              style: { background: active === key ? "var(--color-primary)" : "white", color: active === key ? "var(--color-primary-text, #0a0a0a)" : "#374151" },
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg", children: pg.icon }),
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: pg.title })
              ]
            },
            key
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-white rounded-2xl border border-gray-100 p-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1", children: "Preview" }),
            [
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Return Policy", "/pages/return-policy"],
              ["Privacy Policy", "/pages/privacy-policy"],
              ["Terms", "/pages/terms"],
              ["Shipping", "/pages/shipping-policy"],
              ["Payment", "/pages/payment-policy"]
            ].map(([l, h]) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: h,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-between px-2.5 py-2 text-[12px] font-semibold text-gray-500 no-underline rounded-lg hover:bg-gray-50 transition-colors",
                children: [
                  l,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "↗" })
                ]
              },
              l
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("form", { onSubmit: save, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl", children: page.icon }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "font-black text-[15px] text-gray-900", children: page.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400", children: [
                  page.fields.length,
                  " editable field",
                  page.fields.length !== 1 ? "s" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "flex items-center gap-2 border-none rounded-xl cursor-pointer font-black text-[13px] px-5 py-2.5 transition-opacity",
                style: { background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)", opacity: processing ? 0.7 : 1 },
                children: processing ? "Saving..." : "💾 Save Changes"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-5 space-y-5", children: page.fields.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-gray-400", children: [
            /* @__PURE__ */ jsx("p", { className: "text-4xl mb-3", children: "📄" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[14px]", children: "This page has no editable text fields." }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] mt-1", children: "Content is managed via Settings or other sections." })
          ] }) : page.fields.map((field, idx) => {
            var _a;
            field.key.includes("_title") && !field.key.endsWith("_title") === false && field.label.includes("Section");
            const sectionNum = (_a = field.key.match(/_s(\d+)_/)) == null ? void 0 : _a[1];
            const isFirstInSection = field.key.endsWith("_title") && field.label.includes("Section");
            return /* @__PURE__ */ jsxs("div", { children: [
              isFirstInSection && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 mt-2", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0",
                    style: { background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)" },
                    children: sectionNum
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-100" }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest", children: [
                  "Section ",
                  sectionNum
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-gray-100" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: isFirstInSection ? "" : "", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11.5px] font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: field.label }),
                field.type === "textarea" ? /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: textareaCls,
                    value: data[field.key] ?? "",
                    onChange: (e) => setData(field.key, e.target.value),
                    placeholder: `Enter ${field.label.toLowerCase()}...`,
                    rows: field.label.includes("Content") ? 8 : 4
                  }
                ) : /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: inputCls,
                    value: data[field.key] ?? "",
                    onChange: (e) => setData(field.key, e.target.value),
                    placeholder: `Enter ${field.label.toLowerCase()}...`
                  }
                ),
                field.label.includes("Content") && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1.5", children: "💡 Use bullet points starting with • for lists. Press Enter for new lines." })
              ] })
            ] }, field.key);
          }) }),
          page.fields.length > 0 && /* @__PURE__ */ jsx("div", { className: "px-5 pb-5", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full flex items-center justify-center gap-2 border-none rounded-xl cursor-pointer font-black text-[14px] py-3.5 transition-opacity",
              style: { background: "var(--color-primary)", color: "var(--color-primary-text, #0a0a0a)", opacity: processing ? 0.7 : 1 },
              children: processing ? "Saving..." : "💾 Save Changes"
            }
          ) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  PagesIndex as default
};
