import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { IconAlertTriangle, IconX, IconTrash } from "@tabler/icons-react";
function ConfirmDeleteModal({ open, title, itemName, requireTypedConfirmation, onConfirm, onCancel, danger = true }) {
  const [typed, setTyped] = useState("");
  if (!open) return null;
  const canConfirm = !requireTypedConfirmation || typed.trim() === requireTypedConfirmation;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-[9999] flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.55)" },
      onClick: onCancel,
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              style: { background: danger ? "#FEE2E2" : "#FEF3C7" },
              children: /* @__PURE__ */ jsx(IconAlertTriangle, { size: 20, color: danger ? "#DC2626" : "#D97706" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] text-gray-900", children: title }),
            itemName && /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-500 mt-0.5 break-words", children: [
              '"',
              itemName,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: onCancel, className: "text-gray-300 hover:text-gray-500 border-none bg-transparent cursor-pointer flex-shrink-0", children: /* @__PURE__ */ jsx(IconX, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] text-gray-500 mb-4", children: "This action cannot be undone." }),
        requireTypedConfirmation && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-[11.5px] font-semibold text-gray-500 mb-1.5", children: [
            "Type ",
            /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-gray-800", children: requireTypedConfirmation }),
            " to confirm"
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: typed,
              onChange: (e) => setTyped(e.target.value),
              autoFocus: true,
              className: "w-full h-10 px-3 border-2 border-gray-200 rounded-lg text-[13.5px] outline-none focus:border-red-400",
              placeholder: requireTypedConfirmation
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onCancel,
              className: "flex-1 h-10 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-[13px] cursor-pointer bg-white",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onConfirm,
              disabled: !canConfirm,
              className: "flex-1 h-10 rounded-xl border-none text-white font-bold text-[13px] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed",
              style: { background: danger ? "#DC2626" : "#D97706" },
              children: [
                /* @__PURE__ */ jsx(IconTrash, { size: 14 }),
                " Delete"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
export {
  ConfirmDeleteModal as C
};
