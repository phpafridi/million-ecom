import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, a as useForm } from "../ssr.js";
import { useState } from "react";
import { IconInfoCircle, IconX, IconCheck, IconUpload, IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function ImageUpload({ spec, current, onFile, onRemove }) {
  const [preview, setPreview] = useState(current ?? null);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);
  function handleFile(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setErr(null);
    setOk(false);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const okW = img.width >= spec.w * 0.8 && img.width <= spec.w * 1.3;
      const okH = img.height >= spec.h * 0.8 && img.height <= spec.h * 1.3;
      if (!okW || !okH) {
        setErr(`Wrong size: ${img.width}×${img.height}px. Required: ~${spec.w}×${spec.h}px`);
        return;
      }
      setPreview(url);
      setOk(true);
      onFile(file);
    };
    img.src = url;
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl", children: [
      /* @__PURE__ */ jsx(IconInfoCircle, { size: 15, className: "text-blue-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[12.5px] font-bold text-blue-800", children: [
          spec.label,
          " — ",
          spec.w,
          "×",
          spec.h,
          "px"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px] text-blue-600", children: spec.hint })
      ] })
    ] }),
    preview && /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center", style: { height: 90 }, children: [
      /* @__PURE__ */ jsx("img", { src: preview, alt: "", className: "max-h-full max-w-full object-contain" }),
      onRemove && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setPreview(null);
            setOk(false);
            onRemove();
          },
          className: "absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors border-none cursor-pointer",
          children: /* @__PURE__ */ jsx(IconX, { size: 12 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition-colors
                ${ok ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-[var(--color-primary, #00c8ff)] bg-white"}`, children: [
      /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleFile }),
      ok ? /* @__PURE__ */ jsx(IconCheck, { size: 17, className: "text-green-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(IconUpload, { size: 17, className: "text-[var(--color-primary, #00c8ff)] flex-shrink-0" }),
      /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500 truncate", children: ok ? "Image ready ✓" : `Upload ${spec.w}×${spec.h}px image` })
    ] }),
    err && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2", children: [
      /* @__PURE__ */ jsx(IconInfoCircle, { size: 13, className: "flex-shrink-0" }),
      " ",
      err
    ] })
  ] });
}
const IMAGE_SPECS = {
  banner_tall: { w: 600, h: 500, label: "Tall Banner (left)", hint: "Left side tall banner in promo grid" },
  banner_sm: { w: 600, h: 200, label: "Small Banner", hint: "Top-right 2 banners in promo grid" },
  banner_wide: { w: 900, h: 252, label: "Wide Banner", hint: "Bottom-left wide banner in promo grid" },
  full_banner: { w: 1400, h: 360, label: "Full-Width Banner", hint: "Gaming/section full-width banner" }
};
const POSITIONS = [
  { value: "full_hero", label: "① Full-Width Hero — below categories, 1400×380px" },
  { value: "promo", label: "② Promo Left Tall Card — homepage left column, 600×500px" },
  { value: "small_top_1", label: "③ Small Top Right 1 — homepage top right, 600×200px" },
  { value: "small_top_2", label: "④ Small Top Right 2 — homepage top right, 600×200px" },
  { value: "wide_bottom", label: "⑤ Wide Bottom — homepage bottom left, 900×252px" }
];
function getSpec(position) {
  if (position === "promo") return IMAGE_SPECS.banner_tall;
  if (position === "wide_bottom") return IMAGE_SPECS.banner_wide;
  if (position.startsWith("full")) return IMAGE_SPECS.full_banner;
  return IMAGE_SPECS.banner_sm;
}
function BannerForm({ banner, onClose }) {
  const { props: _bf } = usePage();
  const ap = `/${(_bf == null ? void 0 : _bf.adminPath) ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
    _method: banner ? "PUT" : "POST",
    title: (banner == null ? void 0 : banner.title) ?? "",
    subtitle: (banner == null ? void 0 : banner.subtitle) ?? "",
    cta_text: (banner == null ? void 0 : banner.cta_text) ?? "Shop now",
    link: (banner == null ? void 0 : banner.link) ?? "/shop",
    position: (banner == null ? void 0 : banner.position) ?? "tall_left",
    is_active: (banner == null ? void 0 : banner.is_active) ?? true,
    image: null,
    video_url: (banner == null ? void 0 : banner.video_url) ?? "",
    media_type: (banner == null ? void 0 : banner.video_url) ? "video" : "image"
  });
  function submit(e) {
    e.preventDefault();
    const opts = { onSuccess: onClose };
    const url = banner ? `${ap}/banners/${banner.id}` : `${ap}/banners`;
    post(url, { ...opts, forceFormData: true });
  }
  const spec = getSpec(data.position);
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-100", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[17px] text-gray-900", children: banner ? "Edit Banner" : "Add Banner" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer", children: /* @__PURE__ */ jsx(IconX, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Position / Slot *" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: data.position,
            onChange: (e) => setData("position", e.target.value),
            className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all bg-white",
            children: POSITIONS.map((p) => /* @__PURE__ */ jsx("option", { value: p.value, children: p.label }, p.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: data.title,
            onChange: (e) => setData("title", e.target.value),
            required: true,
            className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Subtitle / Tag" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.subtitle,
              onChange: (e) => setData("subtitle", e.target.value),
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "CTA Button Text" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.cta_text,
              onChange: (e) => setData("cta_text", e.target.value),
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Link URL" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: data.link,
            onChange: (e) => setData("link", e.target.value),
            placeholder: "/shop?category=laptops",
            className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary, #00c8ff)] transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-2", children: "Banner Media *" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1 p-1 bg-gray-100 rounded-xl mb-4", children: [{ key: "image", label: "🖼️ Upload Image" }, { key: "video_file", label: "📁 Upload Video" }, { key: "video", label: "🔗 Video URL" }].map((t) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("media_type", t.key),
            className: "flex-1 py-2 rounded-lg text-[13px] font-bold cursor-pointer border-none transition-all",
            style: data.media_type === t.key ? { background: "white", color: "var(--color-dark-bg)", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" } : { background: "transparent", color: "#9CA3AF" },
            children: t.label
          },
          t.key
        )) }),
        data.media_type === "image" ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(ImageUpload, { spec, current: banner == null ? void 0 : banner.image, onFile: (f) => setData("image", f) }),
          (banner == null ? void 0 : banner.image) && /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsx("img", { src: banner.image, alt: "Current", className: "h-20 rounded-xl object-cover border border-gray-200" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Current image (upload new to replace)" })
          ] })
        ] }) : data.media_type === "video_file" ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-gray-50", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl mb-1", children: "🎬" }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-gray-600", children: "Click to upload video from PC" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400", children: "MP4, WebM, MOV — max 100MB" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "video/mp4,video/webm,video/mov",
                className: "hidden",
                onChange: (e) => {
                  var _a;
                  const f = (_a = e.target.files) == null ? void 0 : _a[0];
                  if (f) setData("video", f);
                }
              }
            )
          ] }),
          data.video && /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-xl", children: /* @__PURE__ */ jsxs("span", { className: "text-green-600 text-[12px] font-bold", children: [
            "✅ Video selected: ",
            data.video.name
          ] }) }),
          (banner == null ? void 0 : banner.video_url) && !data.video && /* @__PURE__ */ jsx("video", { src: banner.video_url, autoPlay: true, muted: true, loop: true, playsInline: true, className: "mt-2 h-24 w-full rounded-xl object-cover border border-gray-200" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-2", children: "Video will autoplay, muted, looping on the storefront." })
        ] }) : /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "url",
              value: data.video_url,
              onChange: (e) => setData("video_url", e.target.value),
              placeholder: "https://example.com/video.mp4",
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-all"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-amber-700 mb-1", children: "💡 Video Tips:" }),
            /* @__PURE__ */ jsxs("ul", { className: "text-[11.5px] text-amber-600 space-y-0.5 list-none m-0 p-0", children: [
              /* @__PURE__ */ jsx("li", { children: "• Use direct MP4 URL (not YouTube/Vimeo)" }),
              /* @__PURE__ */ jsx("li", { children: "• Recommended: 3-5 seconds loop, no audio" }),
              /* @__PURE__ */ jsx("li", { children: "• Upload to S3/Cloudflare R2 for best performance" }),
              /* @__PURE__ */ jsx("li", { children: "• Keep file under 5MB for fast loading" })
            ] })
          ] }),
          data.video_url && /* @__PURE__ */ jsx(
            "video",
            {
              src: data.video_url,
              autoPlay: true,
              muted: true,
              loop: true,
              playsInline: true,
              className: "mt-2 h-28 w-full rounded-xl object-cover border border-gray-200",
              onError: (e) => e.currentTarget.style.display = "none"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("is_active", !data.is_active),
            className: `w-10 h-5 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data.is_active ? "bg-[var(--color-primary, #00c8ff)]" : "bg-gray-200"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${data.is_active ? "left-5" : "left-0.5"}` })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[13.5px] font-semibold text-gray-700", children: "Active" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex-1 h-11 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] rounded-xl transition-all disabled:opacity-60 border-none cursor-pointer",
            children: processing ? "Saving…" : banner ? "Update Banner" : "Create Banner"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 h-11 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[13px] rounded-xl transition-all bg-white cursor-pointer",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function BannersIndex({ banners }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const [editing, setEditing] = useState(null);
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Banners", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Banners — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800", children: [
      /* @__PURE__ */ jsx("strong", { children: "📐 Banner Positions & Image Sizes:" }),
      " Each banner slot has a fixed position on the homepage. Upload images at the correct dimensions to avoid layout distortion. ±20% tolerance is accepted."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
        banners.length,
        " banners configured"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setEditing("new"),
          className: "flex items-center gap-2 bg-[var(--color-primary, #00c8ff)] hover:bg-[var(--color-primary-dark, #00b0e0)] text-[var(--color-dark-bg, #0a0e1a)] font-black text-[13px] px-5 h-10 rounded-xl transition-colors border-none cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(IconPlus, { size: 17 }),
            " Add Banner"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: banners.map((b) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch group hover:border-[var(--color-primary, #00c8ff)]/30 transition-colors", children: [
      /* @__PURE__ */ jsx("div", { className: "w-36 flex-shrink-0 bg-gray-50 overflow-hidden", children: b.image ? /* @__PURE__ */ jsx("img", { src: b.image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-[12px] text-gray-400", children: "No image" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 px-5 py-4 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[var(--color-primary, #00c8ff)] font-bold uppercase tracking-wider mb-0.5", children: b.position }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-gray-900 text-[15px]", children: b.title }),
          b.subtitle && /* @__PURE__ */ jsx("div", { className: "text-[12.5px] text-gray-500 mt-0.5", children: b.subtitle }),
          /* @__PURE__ */ jsxs("div", { className: "text-[12px] text-gray-400 mt-1", children: [
            "→ ",
            b.link
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${b.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`, children: b.is_active ? "Active" : "Hidden" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setEditing(b), className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary, #00c8ff)] hover:bg-[rgba(0,200,255,0.05)] hover:text-[var(--color-primary, #00c8ff)] flex items-center justify-center text-gray-400 transition-all border-none cursor-pointer", children: /* @__PURE__ */ jsx(IconPencil, { size: 14 }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => confirm("Delete?") && router3.delete(`${ap}/banners/${b.id}`),
              className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-all border-none cursor-pointer",
              children: /* @__PURE__ */ jsx(IconTrash, { size: 14 })
            }
          )
        ] })
      ] }) })
    ] }, b.id)) }),
    editing && /* @__PURE__ */ jsx(BannerForm, { banner: editing === "new" ? void 0 : editing, onClose: () => setEditing(null) })
  ] });
}
export {
  BannersIndex as default
};
