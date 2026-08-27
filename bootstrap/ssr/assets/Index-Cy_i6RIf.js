import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, a as useForm } from "../ssr.js";
import { useState } from "react";
import { IconPlus, IconPencil, IconTrash, IconX, IconInfoCircle, IconUpload } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function SlideForm({ slide, onClose }) {
  const { props: _sp } = usePage();
  const ap = `/${(_sp == null ? void 0 : _sp.adminPath) ?? "ml-admin"}`;
  const { data, setData, post, processing, errors } = useForm({
    _method: slide ? "PUT" : "POST",
    title: (slide == null ? void 0 : slide.title) ?? "",
    subtitle: (slide == null ? void 0 : slide.subtitle) ?? "",
    description: (slide == null ? void 0 : slide.description) ?? "",
    cta_text: (slide == null ? void 0 : slide.cta_text) ?? "View Details",
    cta_url: (slide == null ? void 0 : slide.cta_url) ?? "/shop",
    discount_pct: (slide == null ? void 0 : slide.discount_pct) ?? 0,
    price: (slide == null ? void 0 : slide.price) ?? "",
    compare_price: (slide == null ? void 0 : slide.compare_price) ?? "",
    is_active: (slide == null ? void 0 : slide.is_active) ?? true,
    image: null
  });
  const [preview, setPreview] = useState((slide == null ? void 0 : slide.image) ?? null);
  const [imgErr, setImgErr] = useState("");
  function handleImg(e) {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!f) return;
    setImgErr("");
    const img = new Image();
    img.onload = () => {
      if (img.width < 1e3) {
        setImgErr(`Too small: ${img.width}×${img.height}px. Need ~1400×460px`);
        return;
      }
      setPreview(URL.createObjectURL(f));
      setData("image", f);
    };
    img.src = URL.createObjectURL(f);
  }
  function submit(e) {
    e.preventDefault();
    const opts = { onSuccess: onClose };
    const url = slide ? `${ap}/hero-slides/${slide.id}` : `${ap}/hero-slides`;
    post(url, { ...opts, forceFormData: true });
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b border-gray-100", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[17px]", children: slide ? "Edit Slide" : "Add Hero Slide" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconX, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 flex items-start gap-2", children: [
        /* @__PURE__ */ jsx(IconInfoCircle, { size: 14, className: "flex-shrink-0 mt-0.5 text-blue-500" }),
        "Image: ",
        /* @__PURE__ */ jsx("strong", { children: "1400×460px" }),
        " — wide landscape banner image"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
        { key: "title", label: "Tag (eyebrow)", placeholder: "This Week's Deal" },
        { key: "subtitle", label: "Headline", placeholder: "THE NEW" }
      ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: f.label }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: data[f.key],
            onChange: (e) => setData(f.key, e.target.value),
            placeholder: f.placeholder,
            className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)]"
          }
        )
      ] }, f.key)) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Sub-headline (cyan)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            placeholder: "STANDARD",
            className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)]"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: [
        { key: "price", label: "Price", placeholder: "Rs 74,999" },
        { key: "compare_price", label: "Compare Price", placeholder: "Rs 94,999" },
        { key: "discount_pct", label: "Discount %", placeholder: "21", type: "number" }
      ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: f.label }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: f.type ?? "text",
            value: data[f.key],
            onChange: (e) => setData(f.key, f.type === "number" ? +e.target.value : e.target.value),
            placeholder: f.placeholder,
            min: f.type === "number" ? 0 : void 0,
            max: f.type === "number" ? 99 : void 0,
            className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)]"
          }
        )
      ] }, f.key)) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "CTA Button Text" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.cta_text,
              onChange: (e) => setData("cta_text", e.target.value),
              className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "CTA Link" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.cta_url,
              onChange: (e) => setData("cta_url", e.target.value),
              placeholder: "/products/slug",
              className: "w-full h-10 px-3 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)]"
            }
          )
        ] })
      ] }),
      preview && /* @__PURE__ */ jsx("img", { src: preview, className: "w-full h-28 object-cover rounded-xl border border-gray-200", alt: "preview" }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary, #00c8ff)] rounded-xl px-4 py-3 cursor-pointer transition-colors", children: [
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleImg }),
        /* @__PURE__ */ jsx(IconUpload, { size: 17, className: "text-[var(--color-primary, #00c8ff)]" }),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500", children: "Upload slide image (1400×460px)" })
      ] }),
      imgErr && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500", children: imgErr }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("is_active", !data.is_active),
            className: `w-10 h-5 rounded-full transition-all relative border-none cursor-pointer ${data.is_active ? "bg-[var(--color-primary, #00c8ff)]" : "bg-gray-200"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${data.is_active ? "left-5" : "left-0.5"}` })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-700", children: "Active" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex-1 h-11 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] rounded-xl border-none cursor-pointer disabled:opacity-60",
            children: processing ? "Saving…" : slide ? "Update Slide" : "Create Slide"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function HeroSlidesIndex({ slides }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const [editing, setEditing] = useState(null);
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Hero Slides", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Hero Slides — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-500", children: [
        slides.length,
        " slides"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setEditing("new"),
          className: "flex items-center gap-2 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(IconPlus, { size: 17 }),
            " Add Slide"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: slides.map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch group hover:border-[var(--color-primary, #00c8ff)]/30 transition-colors", children: [
      /* @__PURE__ */ jsx("div", { className: "w-40 flex-shrink-0 bg-gray-50 overflow-hidden", children: s.image ? /* @__PURE__ */ jsx("img", { src: s.image, className: "w-full h-full object-cover", alt: "" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-[12px] text-gray-400", children: "No image" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 px-5 py-4 min-w-0 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10.5px] text-[var(--color-primary, #00c8ff)] font-bold uppercase tracking-wider mb-0.5", children: s.title }),
          /* @__PURE__ */ jsxs("div", { className: "font-manrope font-bold text-[15px] text-gray-900", children: [
            s.subtitle,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-[var(--color-primary, #00c8ff)]", children: s.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[12px] text-gray-400 mt-0.5", children: [
            s.price,
            " · ",
            s.discount_pct,
            "% off · → ",
            s.cta_url
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`, children: s.is_active ? "Active" : "Hidden" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setEditing(s), className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary, #00c8ff)] hover:text-[var(--color-primary, #00c8ff)] flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all", children: /* @__PURE__ */ jsx(IconPencil, { size: 14 }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => confirm("Delete this slide?") && router3.delete(`${ap}/hero-slides/${s.id}`),
              className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all",
              children: /* @__PURE__ */ jsx(IconTrash, { size: 14 })
            }
          )
        ] })
      ] })
    ] }, s.id)) }),
    editing && /* @__PURE__ */ jsx(SlideForm, { slide: editing === "new" ? void 0 : editing, onClose: () => setEditing(null) })
  ] });
}
export {
  HeroSlidesIndex as default
};
