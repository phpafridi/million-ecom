import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, a as useForm } from "../ssr.js";
import { useState } from "react";
import { IconDeviceDesktop, IconDeviceMobile, IconPlus, IconPencil, IconTrash, IconX, IconCheck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { D as DualImageUpload } from "./ImageUpload-zHhWKIfi.js";
import { C as ConfirmDeleteModal } from "./ConfirmDeleteModal-upZ6GLRW.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const IMAGE_SPECS = {
  banner_tall: { w: 1080, h: 1080, label: "Promo Tall Card (left)", hint: "This tile is portrait on desktop but landscape on mobile — use a square, centered image so both crops look right" },
  banner_sm: { w: 900, h: 540, label: "Small Banner", hint: "Top-right 2 banners in promo grid — keep subject centered" },
  banner_wide: { w: 1600, h: 450, label: "Wide Banner", hint: "Bottom-left wide banner in promo grid (desktop only)" },
  full_banner: { w: 1920, h: 520, label: "Full-Width Banner", hint: "Gaming/section full-width banner — keep subject centered" }
};
const POSITIONS = [
  { value: "full_hero", label: "① Full-Width Hero", desk: "1920×520px landscape", mob: "900×900px square" },
  { value: "promo", label: "② Promo Left Card", desk: "1080×1080px square", mob: "900×900px square" },
  { value: "small_top_1", label: "③ Small Top Right 1", desk: "900×540px landscape", mob: "900×900px square" },
  { value: "small_top_2", label: "④ Small Top Right 2", desk: "900×540px landscape", mob: "900×900px square" },
  { value: "wide_bottom", label: "⑤ Wide Bottom", desk: "1600×450px landscape", mob: "N/A (desktop only)" }
];
function getSpec(position) {
  if (position === "promo") return IMAGE_SPECS.banner_tall;
  if (position === "wide_bottom") return IMAGE_SPECS.banner_wide;
  if (position.startsWith("full")) return IMAGE_SPECS.full_banner;
  return IMAGE_SPECS.banner_sm;
}
const MOBILE_SPEC = { w: 900, h: 900, label: "Mobile Image", hint: "Square — fills portrait card on phones. Falls back to desktop image if not uploaded." };
function BannerForm({ banner, onClose }) {
  const { props } = usePage();
  const ap = `/${(props == null ? void 0 : props.adminPath) ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
    _method: banner ? "PUT" : "POST",
    title: (banner == null ? void 0 : banner.title) ?? "",
    subtitle: (banner == null ? void 0 : banner.subtitle) ?? "",
    cta_text: (banner == null ? void 0 : banner.cta_text) ?? "Shop now",
    link: (banner == null ? void 0 : banner.link) ?? "/shop",
    position: (banner == null ? void 0 : banner.position) ?? "small_top_1",
    is_active: (banner == null ? void 0 : banner.is_active) ?? true,
    image: null,
    mobile_image: null,
    video_url: (banner == null ? void 0 : banner.video_url) ?? "",
    media_type: (banner == null ? void 0 : banner.video_url) ? "video" : "image"
  });
  const spec = getSpec(data.position);
  const posInfo = POSITIONS.find((p) => p.value === data.position);
  function submit(e) {
    e.preventDefault();
    post(banner ? `${ap}/banners/${banner.id}` : `${ap}/banners`, { onSuccess: onClose, forceFormData: true });
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-100", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-manrope font-black text-[17px] text-gray-900", children: banner ? "Edit Banner" : "Add Banner" }),
        /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mt-0.5", children: "Configure image, link, and text for this slot" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer rounded-lg hover:bg-gray-100 transition-colors", children: /* @__PURE__ */ jsx(IconX, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide", children: "Slot Position *" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: data.position,
            onChange: (e) => setData("position", e.target.value),
            className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] bg-white transition-all",
            children: POSITIONS.map((p) => /* @__PURE__ */ jsxs("option", { value: p.value, children: [
              p.label,
              " — ",
              p.desk
            ] }, p.value))
          }
        ),
        posInfo && /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100", children: [
            /* @__PURE__ */ jsx(IconDeviceDesktop, { size: 14, className: "text-gray-400" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Desktop" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11.5px] font-bold text-gray-700", children: posInfo.desk })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100", children: [
            /* @__PURE__ */ jsx(IconDeviceMobile, { size: 14, className: "text-gray-400" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-bold uppercase", children: "Mobile" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11.5px] font-bold text-gray-700", children: posInfo.mob })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-bold text-gray-700 mb-1.5", children: "Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.title,
              onChange: (e) => setData("title", e.target.value),
              placeholder: "e.g. Summer Sale",
              required: true,
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-bold text-gray-700 mb-1.5", children: "Tag / Subtitle" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.subtitle,
              onChange: (e) => setData("subtitle", e.target.value),
              placeholder: "e.g. Limited time",
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-bold text-gray-700 mb-1.5", children: "Button Text" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.cta_text,
              onChange: (e) => setData("cta_text", e.target.value),
              placeholder: "Shop now",
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-bold text-gray-700 mb-1.5", children: "Link URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.link,
              onChange: (e) => setData("link", e.target.value),
              placeholder: "/shop",
              className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[12.5px] font-bold text-gray-700 mb-2 uppercase tracking-wide", children: "Banner Media" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1 p-1 bg-gray-100 rounded-xl mb-4", children: [{ key: "image", label: "🖼️ Image" }, { key: "video_file", label: "📁 Video File" }, { key: "video", label: "🔗 Video URL" }].map((t) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("media_type", t.key),
            className: "flex-1 py-2 rounded-lg text-[12px] font-bold cursor-pointer border-none transition-all",
            style: data.media_type === t.key ? { background: "white", color: "var(--color-dark-bg)", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" } : { background: "transparent", color: "#9CA3AF" },
            children: t.label
          },
          t.key
        )) }),
        data.media_type === "image" ? /* @__PURE__ */ jsx(
          DualImageUpload,
          {
            label: "Banner Image",
            desktopSpec: spec,
            mobileSpec: MOBILE_SPEC,
            currentDesktop: banner == null ? void 0 : banner.image,
            currentMobile: banner == null ? void 0 : banner.mobile_image,
            onDesktopFile: (f) => setData("image", f),
            onMobileFile: (f) => setData("mobile_image", f)
          }
        ) : data.media_type === "video_file" ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-gray-50", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl mb-1", children: "🎬" }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-gray-600", children: "Click to upload video" }),
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
          data.video && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-green-600 font-bold mt-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 13 }),
            " ",
            data.video.name
          ] })
        ] }) : /* @__PURE__ */ jsx(
          "input",
          {
            type: "url",
            value: data.video_url,
            onChange: (e) => setData("video_url", e.target.value),
            placeholder: "https://example.com/video.mp4",
            className: "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-all"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer py-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setData("is_active", !data.is_active),
            className: `w-11 h-6 rounded-full transition-all relative flex-shrink-0 border-none cursor-pointer ${data.is_active ? "bg-[var(--color-primary)]" : "bg-gray-200"}`,
            children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.is_active ? "left-5" : "left-0.5"}` })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[13.5px] font-semibold text-gray-700", children: "Active" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400", children: data.is_active ? "Visible on storefront" : "Hidden from storefront" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex-1 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
            children: processing ? "Saving…" : banner ? "✓ Update Banner" : "✓ Create Banner"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "h-12 px-6 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer transition-all",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function BannersIndex({ banners }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const posMap = {
    full_hero: "① Full-Width Hero",
    promo: "② Promo Left",
    small_top_1: "③ Small Top 1",
    small_top_2: "④ Small Top 2",
    wide_bottom: "⑤ Wide Bottom"
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Banners", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Banners — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl", children: [
      /* @__PURE__ */ jsx("p", { className: "font-bold text-[13.5px] text-blue-900 mb-2", children: "📐 Image Guide — Desktop + Mobile" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: POSITIONS.map((p) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl p-3 border border-blue-100", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-[12px] text-gray-800 mb-1", children: p.label }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-gray-500 mb-0.5", children: [
          /* @__PURE__ */ jsx(IconDeviceDesktop, { size: 11 }),
          " ",
          p.desk
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-gray-500", children: [
          /* @__PURE__ */ jsx(IconDeviceMobile, { size: 11 }),
          " ",
          p.mob
        ] })
      ] }, p.value)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-500", children: [
        banners.length,
        " banner",
        banners.length !== 1 ? "s" : "",
        " configured"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setEditing("new"),
          className: "flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer transition-colors",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)" },
          children: [
            /* @__PURE__ */ jsx(IconPlus, { size: 16 }),
            " Add Banner"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      banners.map((b) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch group hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-40 flex-shrink-0 bg-gray-50 overflow-hidden grid grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden border-r border-gray-100", children: [
            b.image ? /* @__PURE__ */ jsx("img", { src: b.image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300", children: [
              /* @__PURE__ */ jsx(IconDeviceDesktop, { size: 18 }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px]", children: "No desktop" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] font-bold text-center py-0.5", children: "DESKTOP" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
            b.mobile_image ? /* @__PURE__ */ jsx("img", { src: b.mobile_image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300", children: [
              /* @__PURE__ */ jsx(IconDeviceMobile, { size: 18 }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px]", children: "Fallback" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] font-bold text-center py-0.5", children: "MOBILE" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 px-5 py-4 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10.5px] font-black uppercase tracking-wider mb-0.5", style: { color: "var(--color-primary)" }, children: posMap[b.position] ?? b.position }),
            /* @__PURE__ */ jsx("div", { className: "font-black text-gray-900 text-[15px] truncate", children: b.title || /* @__PURE__ */ jsx("span", { className: "text-gray-300 italic", children: "No title" }) }),
            b.subtitle && /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-400 mt-0.5 truncate", children: b.subtitle }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11.5px] text-gray-400 mt-1.5 flex items-center gap-1", children: [
              "→ ",
              /* @__PURE__ */ jsx("span", { className: "truncate", children: b.link })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsx("span", { className: `text-[11px] font-bold px-2.5 py-1 rounded-full border ${b.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`, children: b.is_active ? "Active" : "Hidden" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setEditing(b),
                className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all border-solid",
                children: /* @__PURE__ */ jsx(IconPencil, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setPendingDelete(b),
                className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 cursor-pointer transition-all border-solid",
                children: /* @__PURE__ */ jsx(IconTrash, { size: 14 })
              }
            )
          ] })
        ] }) })
      ] }, b.id)),
      banners.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 text-gray-400", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[40px] mb-3", children: "🖼️" }),
        /* @__PURE__ */ jsx("p", { className: "font-bold text-[15px] text-gray-600", children: "No banners yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] mt-1", children: "Add your first banner to display on the homepage" })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsx(BannerForm, { banner: editing === "new" ? void 0 : editing, onClose: () => setEditing(null) }),
    /* @__PURE__ */ jsx(
      ConfirmDeleteModal,
      {
        open: !!pendingDelete,
        title: "Delete this banner?",
        onConfirm: () => {
          if (pendingDelete) router3.delete(`${ap}/banners/${pendingDelete.id}`, { onFinish: () => setPendingDelete(null) });
        },
        onCancel: () => setPendingDelete(null)
      }
    )
  ] });
}
export {
  BannersIndex as default
};
