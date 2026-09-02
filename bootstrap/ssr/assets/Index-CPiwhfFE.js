import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { IconInfoCircle, IconUpload } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DNtREoCY.js";
import { I as Input, B as Button } from "./Button-CI0-xv_v.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "./cn-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
function PromoVideoIndex({ current_video, video_title, video_tag, video_cta }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
    video: null,
    video_title,
    video_tag,
    video_cta
  });
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Promo Video Card", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Promo Video — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px] text-amber-800", children: [
        /* @__PURE__ */ jsx("strong", { children: "📹 Video Card" }),
        " — This video appears in the promo banner grid on the homepage (bottom-right card). Upload a short vertical/portrait promo video (9:16 ratio, max 50MB, MP4 recommended)."
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        post(`${ap}/promo-video`);
      }, className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px] text-gray-900 pb-3 border-b border-gray-100", children: "Video Text Overlay" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Tag / Badge" }),
              /* @__PURE__ */ jsx(Input, { value: data.video_tag, onChange: (e) => setData("video_tag", e.target.value), placeholder: "🔥 Hot Deal" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Title" }),
              /* @__PURE__ */ jsx(Input, { value: data.video_title, onChange: (e) => setData("video_title", e.target.value), placeholder: "ASUS ROG Gaming PCs" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1.5", children: "Button Text" }),
              /* @__PURE__ */ jsx(Input, { value: data.video_cta, onChange: (e) => setData("video_cta", e.target.value), placeholder: "Enquire Now" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[16px] text-gray-900 pb-3 border-b border-gray-100", children: "Video File" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl", children: [
            /* @__PURE__ */ jsx(IconInfoCircle, { size: 15, className: "text-blue-500 flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { className: "text-[12px] text-blue-700", children: [
              /* @__PURE__ */ jsx("strong", { children: "Recommended:" }),
              " Portrait/vertical video (9:16), 1080×1920px, 15–30 seconds, MP4 format, max 50MB. The video autoplays muted and loops."
            ] })
          ] }),
          current_video && /* @__PURE__ */ jsx("div", { className: "rounded-xl overflow-hidden border border-gray-200 bg-gray-50", style: { maxHeight: 200 }, children: /* @__PURE__ */ jsx("video", { src: current_video, className: "h-[200px] mx-auto block object-contain", muted: true, controls: true }) }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-4 cursor-pointer transition-colors", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "video/mp4,video/webm",
                className: "hidden",
                onChange: (e) => {
                  var _a;
                  return setData("video", ((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                }
              }
            ),
            /* @__PURE__ */ jsx(IconUpload, { size: 20, className: "text-[var(--color-primary,#00c8ff)] flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13.5px] font-semibold text-gray-700", children: data.video ? data.video.name : "Click to upload video" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-400", children: "MP4 or WebM, max 50MB, portrait orientation" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, size: "lg", className: "w-full justify-center", children: processing ? "Uploading…" : "Save Promo Video" })
      ] })
    ] })
  ] });
}
export {
  PromoVideoIndex as default
};
