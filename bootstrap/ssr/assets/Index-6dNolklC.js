import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { useState } from "react";
import { IconExternalLink, IconRobot, IconWorld, IconInfoCircle, IconUpload } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-ClODoR4t.js";
import { I as Input, B as Button } from "./Button-CI0-xv_v.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "./cn-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
function Section({ title, icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 sm:p-6", children: [
    /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[15px] sm:text-[16px] text-gray-900 pb-3 sm:pb-4 border-b border-gray-100 mb-4 sm:mb-5 flex items-center gap-2", children: [
      icon,
      " ",
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
  ] });
}
function Field({ label, hint, error, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] sm:text-[13px] font-semibold text-gray-700 mb-1", children: label }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] sm:text-[12px] text-gray-400 mb-1.5", children: hint }),
    children,
    error && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-red-500 mt-1", children: error })
  ] });
}
function ImageUploadField({ label, w, h, hint, current, onFile }) {
  const [preview, setPreview] = useState(current ?? null);
  const [err, setErr] = useState("");
  function handle(e) {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!f) return;
    setErr("");
    const img = new Image();
    img.onload = () => {
      if (img.width < w * 0.5 || img.height < h * 0.5) {
        setErr(`Too small: ${img.width}×${img.height}px. Recommended ~${w}×${h}px`);
        return;
      }
      setPreview(URL.createObjectURL(f));
      onFile(f);
    };
    img.src = URL.createObjectURL(f);
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg mb-2", children: [
      /* @__PURE__ */ jsx(IconInfoCircle, { size: 14, className: "text-blue-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { className: "text-[11.5px] sm:text-[12px]", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-blue-800", children: [
          label,
          ": ",
          w,
          "×",
          h,
          "px"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-blue-600 ml-1", children: [
          "— ",
          hint
        ] })
      ] })
    ] }),
    preview && /* @__PURE__ */ jsx("div", { className: "mb-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center", style: { height: w === h ? 60 : 90 }, children: /* @__PURE__ */ jsx("img", { src: preview, alt: "", className: "max-h-full max-w-full object-contain" }) }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2.5 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-2.5 cursor-pointer transition-colors", children: [
      /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handle }),
      /* @__PURE__ */ jsx(IconUpload, { size: 16, className: "text-[var(--color-primary,#00c8ff)] flex-shrink-0" }),
      /* @__PURE__ */ jsxs("span", { className: "text-[12px] sm:text-[12.5px] text-gray-500", children: [
        "Upload ",
        w,
        "×",
        h,
        "px image"
      ] })
    ] }),
    err && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-red-500 mt-1", children: err })
  ] });
}
function SeoIndex({ seo }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing, errors } = useForm({
    meta_title: seo.meta_title,
    meta_description: seo.meta_description,
    meta_keywords: seo.meta_keywords,
    site_url: seo.site_url,
    seo_indexing_enabled: seo.seo_indexing_enabled,
    custom_head_scripts: seo.custom_head_scripts,
    favicon: null,
    og_image: null
  });
  function submit(e) {
    e.preventDefault();
    post(`${ap}/seo`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "SEO Settings", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "SEO — Admin" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs(Section, { title: "Search Engine Meta Tags", icon: "🔍", children: [
          /* @__PURE__ */ jsxs(Field, { label: "Meta Title", hint: "Shown in browser tabs and Google search results (max 70 chars)", error: errors.meta_title, children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                value: data.meta_title,
                onChange: (e) => setData("meta_title", e.target.value),
                placeholder: "MOIN Electronics — Manage Online IT Needs",
                maxLength: 70
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-gray-400 mt-1", children: [
              data.meta_title.length,
              "/70"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Meta Description", hint: "Shown under your title in search results (max 160 chars)", error: errors.meta_description, children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: data.meta_description,
                onChange: (e) => setData("meta_description", e.target.value),
                rows: 3,
                maxLength: 160,
                className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13px] sm:text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] resize-none transition-all"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-gray-400 mt-1", children: [
              data.meta_description.length,
              "/160"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Meta Keywords", hint: "Comma-separated keywords (less important for modern SEO, still supported)", children: /* @__PURE__ */ jsx(
            Input,
            {
              value: data.meta_keywords,
              onChange: (e) => setData("meta_keywords", e.target.value),
              placeholder: "laptops, smartphones, gaming pc, pakistan electronics"
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "Canonical Site URL", hint: "Your live domain — used for sitemap and canonical tags", error: errors.site_url, children: /* @__PURE__ */ jsx(Input, { value: data.site_url, onChange: (e) => setData("site_url", e.target.value), placeholder: "https://moin.pk" }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Indexing & Crawling", icon: /* @__PURE__ */ jsx(IconRobot, { size: 18, className: "text-[var(--color-primary,#00c8ff)]" }), children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between p-3.5 bg-gray-50 rounded-xl cursor-pointer", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-800", children: "Allow search engines to index this site" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400 mt-0.5", children: "Turn off only if the site is in maintenance or staging mode" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData("seo_indexing_enabled", data.seo_indexing_enabled === "1" ? "0" : "1"),
                className: `w-11 h-6 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data.seo_indexing_enabled === "1" ? "bg-[var(--color-primary,#00c8ff)]" : "bg-gray-300"}`,
                children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.seo_indexing_enabled === "1" ? "left-5.5" : "left-0.5"}`, style: { left: data.seo_indexing_enabled === "1" ? 22 : 2 } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/sitemap.xml",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-[var(--color-primary,#00c8ff)] transition-all no-underline group",
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-800", children: "View Sitemap" }),
                    /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400", children: "/sitemap.xml — auto-generated" })
                  ] }),
                  /* @__PURE__ */ jsx(IconExternalLink, { size: 16, className: "text-gray-400 group-hover:text-[var(--color-primary,#00c8ff)]" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/robots.txt",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:border-[var(--color-primary,#00c8ff)] transition-all no-underline group",
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-800", children: "View robots.txt" }),
                    /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-gray-400", children: "/robots.txt — auto-generated" })
                  ] }),
                  /* @__PURE__ */ jsx(IconExternalLink, { size: 16, className: "text-gray-400 group-hover:text-[var(--color-primary,#00c8ff)]" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(Section, { title: "Advanced — Custom Head Scripts", icon: "⚙️", children: /* @__PURE__ */ jsx(Field, { label: "Custom HTML / Analytics Scripts", hint: "Paste Google Analytics, Meta Pixel, or other tracking scripts here. Inserted into every page's <head>.", children: /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.custom_head_scripts,
            onChange: (e) => setData("custom_head_scripts", e.target.value),
            rows: 5,
            placeholder: "<script>...<\/script>",
            className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[12.5px] font-mono outline-none focus:border-[var(--color-primary,#00c8ff)] resize-none transition-all"
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs(Section, { title: "Favicon & Social Image", icon: /* @__PURE__ */ jsx(IconWorld, { size: 18, className: "text-[var(--color-primary,#00c8ff)]" }), children: [
          /* @__PURE__ */ jsx(
            ImageUploadField,
            {
              label: "Favicon",
              w: 64,
              h: 64,
              hint: "Square icon shown in browser tabs",
              current: seo.favicon_url,
              onFile: (f) => setData("favicon", f)
            }
          ),
          /* @__PURE__ */ jsx(
            ImageUploadField,
            {
              label: "Social Share Image (OG)",
              w: 1200,
              h: 630,
              hint: "Shown when your link is shared on Facebook, Twitter, WhatsApp",
              current: seo.og_image_url,
              onFile: (f) => setData("og_image", f)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[12.5px] text-amber-800", children: [
          /* @__PURE__ */ jsx("strong", { children: "💡 Tip:" }),
          " After saving, share your homepage link on WhatsApp or Facebook to preview how your social image and title appear."
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", disabled: processing, className: "w-full justify-center", children: processing ? "Saving…" : "Save SEO Settings" })
      ] })
    ] })
  ] });
}
export {
  SeoIndex as default
};
