import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { H as Head_default } from "../ssr.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function PayFastRedirect({ payfast_url, data, order, sandbox }) {
  const formRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      var _a;
      (_a = formRef.current) == null ? void 0 : _a.submit();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Redirecting to PayFast..." }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center p-4",
        style: { background: "var(--color-body-bg, #f5f5f0)" },
        children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-md w-full text-center", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5",
              style: { background: "#00b8f1" },
              children: /* @__PURE__ */ jsx("span", { className: "text-white font-black text-xl", children: "PF" })
            }
          ),
          sandbox && /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-5", children: /* @__PURE__ */ jsx("p", { className: "text-amber-700 text-[12px] font-bold", children: "🧪 SANDBOX MODE — No real money will be charged" }) }),
          /* @__PURE__ */ jsx("h1", { className: "font-black text-[20px] text-gray-900 mb-1", children: "Redirecting to PayFast" }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-[14px] mb-5", children: [
            "Secure payment for Order #",
            order.id
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13.5px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Customer" }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-800", children: order.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[13.5px]", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Order" }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-gray-800", children: [
                "#",
                order.id
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[15px] font-black border-t border-gray-200 pt-2 mt-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Amount" }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--color-primary)" }, children: fmt(order.total) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-5 h-5 border-2 border-gray-200 rounded-full animate-spin",
                style: { borderTopColor: "#00b8f1" }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500 font-medium", children: "Redirecting in a moment…" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                var _a;
                return (_a = formRef.current) == null ? void 0 : _a.submit();
              },
              className: "w-full h-12 rounded-xl font-bold text-[14px] text-white border-none cursor-pointer transition-all hover:opacity-90",
              style: { background: "#00b8f1" },
              children: "Continue to PayFast →"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400 mt-4", children: [
            "🔒 You will be redirected to PayFast's secure payment page.",
            /* @__PURE__ */ jsx("br", {}),
            "Your card details are never shared with us."
          ] }),
          /* @__PURE__ */ jsx("form", { ref: formRef, method: "POST", action: payfast_url, style: { display: "none" }, children: Object.entries(data).map(([key, value]) => /* @__PURE__ */ jsx("input", { type: "hidden", name: key, value }, key)) })
        ] })
      }
    )
  ] });
}
export {
  PayFastRedirect as default
};
