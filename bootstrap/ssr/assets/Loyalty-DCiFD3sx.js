import { jsxs, jsx } from "react/jsx-runtime";
import { H as Head_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-Dwo0iPSU.js";
import AccountSidebar from "./AccountSidebar-DVJqFEyl.js";
import { IconTrendingUp, IconStar, IconGift, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const LEVELS = [
  { name: "Bronze", min: 0, max: 499, color: "#CD7F32", perks: ["1 point per Rs 10 spent", "Birthday bonus 50 pts"] },
  { name: "Silver", min: 500, max: 1999, color: "#6B7280", perks: ["1.5x points multiplier", "Free shipping on orders 2000+", "Early sale access"] },
  { name: "Gold", min: 2e3, max: 4999, color: "#F59E0B", perks: ["2x points multiplier", "Free shipping always", "Priority support", "Exclusive offers"] },
  { name: "Platinum", min: 5e3, max: null, color: "#8B5CF6", perks: ["3x points multiplier", "Free shipping always", "VIP support", "Early product access", "Birthday gift"] }
];
function Loyalty({ points, points_value, total_earned, level, transactions, settings, auth }) {
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Loyalty Points" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen py-8 px-4", style: { background: "var(--color-body-bg)" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsx(AccountSidebar, { auth, active: "loyalty" }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 space-y-5", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-2xl p-6 text-white relative overflow-hidden",
            style: { background: `linear-gradient(135deg, ${level.color} 0%, ${level.color}cc 100%)` },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5",
                  style: { transform: "translate(30%, -30%)" }
                }
              ),
              /* @__PURE__ */ jsxs("p", { className: "text-white/70 text-[13px] font-medium mb-1", children: [
                level.name,
                " Member"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-4 mb-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-black text-5xl leading-none", children: points.toLocaleString() }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/60 text-[13px] mt-1", children: "points available" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pb-1", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-white/80 text-[14px]", children: [
                    "≈ Rs ",
                    points_value.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/50 text-[11px]", children: "redeemable value" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-white/70 text-[12px]", children: [
                /* @__PURE__ */ jsx(IconTrendingUp, { size: 14 }),
                /* @__PURE__ */ jsxs("span", { children: [
                  total_earned.toLocaleString(),
                  " total points earned"
                ] })
              ] }),
              level.next && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[11px] text-white/60 mb-1.5", children: [
                  /* @__PURE__ */ jsx("span", { children: "Progress to next level" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    level.progress,
                    "% · ",
                    (level.next - total_earned).toLocaleString(),
                    " pts needed"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-2 bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-full bg-white rounded-full transition-all duration-700",
                    style: { width: `${level.progress}%` }
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] mb-4", style: { color: "var(--color-body-text)" }, children: "How to Earn Points" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
            { label: "Every Purchase", value: "1 pt / Rs 10", icon: "🛍️" },
            { label: "Write a Review", value: "25 points", icon: "⭐" },
            { label: "Refer a Friend", value: "100 points", icon: "👥" },
            { label: "Birthday Bonus", value: "50 points", icon: "🎂" },
            { label: "First Purchase", value: "50 points", icon: "🎉" },
            { label: "Social Share", value: "10 points", icon: "📱" }
          ].map((e) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-xl p-3 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl", children: e.icon }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-[12.5px]", style: { color: "var(--color-body-text)" }, children: e.label }),
              /* @__PURE__ */ jsx("p", { className: "text-[11.5px] font-semibold", style: { color: "var(--color-primary)" }, children: e.value })
            ] })
          ] }, e.label)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] mb-4", style: { color: "var(--color-body-text)" }, children: "Membership Levels" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: LEVELS.map((l) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `rounded-xl p-4 border-2 transition-all ${level.name === l.name ? "shadow-md" : "border-gray-100"}`,
              style: level.name === l.name ? { borderColor: l.color, background: l.color + "08" } : {},
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(IconStar, { size: 14, style: { color: l.color }, fill: l.color }),
                  /* @__PURE__ */ jsx("p", { className: "font-black text-[13px]", style: { color: l.color }, children: l.name })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-[10.5px] mb-2", children: [
                  l.min.toLocaleString(),
                  l.max ? `–${l.max.toLocaleString()}` : "+",
                  " pts"
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: l.perks.map((p) => /* @__PURE__ */ jsxs("li", { className: "text-[10.5px] text-gray-600 flex items-start gap-1", children: [
                  /* @__PURE__ */ jsx("span", { style: { color: l.color }, className: "mt-0.5", children: "✓" }),
                  " ",
                  p
                ] }, p)) }),
                level.name === l.name && /* @__PURE__ */ jsx("div", { className: "mt-2 pt-2 border-t", style: { borderColor: l.color + "30" }, children: /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold", style: { color: l.color }, children: "Your current level" }) })
              ]
            },
            l.name
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[16px] mb-4", style: { color: "var(--color-body-text)" }, children: "Points History" }),
          transactions.data.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
            /* @__PURE__ */ jsx(IconGift, { size: 36, className: "text-gray-200 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[13.5px]", children: "No transactions yet. Start shopping to earn points!" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-50", children: transactions.data.map((t) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `w-9 h-9 rounded-xl flex items-center justify-center
                                                        ${t.type === "earned" ? "bg-green-50" : "bg-red-50"}`, children: t.type === "earned" ? /* @__PURE__ */ jsx(IconArrowUp, { size: 16, className: "text-green-500" }) : /* @__PURE__ */ jsx(IconArrowDown, { size: 16, className: "text-red-500" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-[13px]", style: { color: "var(--color-body-text)" }, children: t.description }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[11.5px]", children: t.created_at })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `font-black text-[15px] ${t.type === "earned" ? "text-green-600" : "text-red-500"}`, children: [
              t.type === "earned" ? "+" : "",
              t.points,
              " pts"
            ] })
          ] }, t.id)) })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Loyalty as default
};
