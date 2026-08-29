import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { IconDeviceDesktop, IconDeviceMobile, IconInfoCircle, IconX, IconCheck, IconUpload } from "@tabler/icons-react";
function ImageUpload({ spec, current, onFile, onRemove }) {
  const [preview, setPreview] = useState(current ?? null);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  function processFile(file) {
    setErr(null);
    setOk(false);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const okW = img.width >= spec.w * 0.7;
      const okH = img.height >= spec.h * 0.7;
      if (!okW || !okH) {
        setErr(`Image is ${img.width}×${img.height}px — recommended ~${spec.w}×${spec.h}px. It may look stretched or cropped.`);
      }
      setPreview(url);
      setOk(true);
      onFile(file);
    };
    img.src = url;
  }
  function handleFile(e) {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (f) processFile(f);
  }
  function handleDrop(e) {
    var _a;
    e.preventDefault();
    setDrag(false);
    const f = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (f && f.type.startsWith("image/")) processFile(f);
  }
  const ratio = spec.w / spec.h;
  const previewH = Math.min(140, Math.max(80, 140 / ratio));
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl", children: [
      /* @__PURE__ */ jsx(IconInfoCircle, { size: 13, className: "text-blue-400 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("span", { className: "text-[11.5px] text-blue-700 font-semibold", children: [
        spec.w,
        "×",
        spec.h,
        "px — ",
        spec.hint
      ] })
    ] }),
    preview && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50",
        style: { height: previewH, background: "repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 0 0 / 16px 16px" },
        children: [
          /* @__PURE__ */ jsx("img", { src: preview, alt: "", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" }),
          onRemove && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setPreview(null);
                setOk(false);
                onRemove();
              },
              className: "absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-none cursor-pointer shadow-lg transition-colors",
              children: /* @__PURE__ */ jsx(IconX, { size: 13 })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 10 }),
            " Ready"
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = inputRef.current) == null ? void 0 : _a.click();
              },
              className: "absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-700 text-[10px] font-bold px-2 py-1 rounded-full border-none cursor-pointer shadow transition-colors",
              children: [
                /* @__PURE__ */ jsx(IconUpload, { size: 10 }),
                " Replace"
              ]
            }
          )
        ]
      }
    ),
    !preview && /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        onDragOver: (e) => {
          e.preventDefault();
          setDrag(true);
        },
        onDragLeave: () => setDrag(false),
        onDrop: handleDrop,
        className: "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-all py-6",
        style: {
          borderColor: drag ? "var(--color-primary)" : "#E5E7EB",
          background: drag ? "rgba(var(--color-primary-rgb, 201,168,76),0.04)" : "#FAFAFA"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-10 h-10 rounded-xl flex items-center justify-center",
              style: { background: "var(--color-primary,#C9A84C)20" },
              children: /* @__PURE__ */ jsx(IconUpload, { size: 20, style: { color: "var(--color-primary,#C9A84C)" } })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-700", children: "Click or drag image here" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-0.5", children: "PNG, JPG, WebP — max 10MB" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("input", { ref: inputRef, type: "file", accept: "image/*", className: "hidden", onChange: handleFile }),
    err && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl", children: [
      /* @__PURE__ */ jsx(IconInfoCircle, { size: 13, className: "text-amber-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-amber-700", children: err })
    ] })
  ] });
}
function DualImageUpload({ label, desktopSpec, mobileSpec, currentDesktop, currentMobile, onDesktopFile, onMobileFile }) {
  const [tab, setTab] = useState("desktop");
  const hasDesktop = !!currentDesktop;
  const hasMobile = !!currentMobile;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-gray-800", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "flex bg-gray-100 rounded-lg p-0.5 gap-0.5", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setTab("desktop"),
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border-none cursor-pointer transition-all",
            style: tab === "desktop" ? { background: "white", color: "var(--color-dark-bg,#0a0a0a)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { background: "transparent", color: "#9CA3AF" },
            children: [
              /* @__PURE__ */ jsx(IconDeviceDesktop, { size: 13 }),
              "Desktop ",
              hasDesktop && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-400 inline-block" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setTab("mobile"),
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border-none cursor-pointer transition-all",
            style: tab === "mobile" ? { background: "white", color: "var(--color-dark-bg,#0a0a0a)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { background: "transparent", color: "#9CA3AF" },
            children: [
              /* @__PURE__ */ jsx(IconDeviceMobile, { size: 13 }),
              "Mobile ",
              hasMobile && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-400 inline-block" }),
              !hasMobile && /* @__PURE__ */ jsx("span", { className: "text-[9px] text-gray-400", children: "(optional)" })
            ]
          }
        )
      ] })
    ] }),
    tab === "desktop" ? /* @__PURE__ */ jsx(ImageUpload, { spec: desktopSpec, current: currentDesktop, onFile: onDesktopFile }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl", children: [
        /* @__PURE__ */ jsx(IconDeviceMobile, { size: 13, className: "text-purple-400 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11.5px] text-purple-700 font-medium", children: "If not set, the desktop image is used on mobile as a fallback. Upload a portrait/square image for best mobile results." })
      ] }),
      /* @__PURE__ */ jsx(ImageUpload, { spec: mobileSpec, current: currentMobile, onFile: onMobileFile })
    ] })
  ] });
}
export {
  DualImageUpload as D
};
