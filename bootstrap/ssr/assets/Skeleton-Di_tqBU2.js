import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./cn-H80jjgLf.js";
function Skeleton({ className, style }) {
  return /* @__PURE__ */ jsx("div", { className: cn("skeleton-shimmer rounded-xl", className), style });
}
function ProductCardSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[13px] border border-gray-100 overflow-hidden", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "w-full aspect-square rounded-none" }),
    /* @__PURE__ */ jsxs("div", { className: "p-3.5 space-y-2.5", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-20 rounded-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-24 mt-1" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-full mt-2 rounded-lg" })
    ] })
  ] });
}
export {
  ProductCardSkeleton as P
};
