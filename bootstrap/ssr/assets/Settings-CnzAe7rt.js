import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { IconCheck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-5pjq4ehf.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-colors bg-white";
const textareaCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] resize-none transition-colors";
function Field({ label, hint, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: label }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mb-1.5", children: hint }),
    children
  ] });
}
function Section({ title, icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
    /* @__PURE__ */ jsxs("h3", { className: "font-manrope font-bold text-[16px] text-gray-900 pb-4 border-b border-gray-100 mb-5 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { children: icon }),
      " ",
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
  ] });
}
function Settings({ settings }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
    site_name: settings.site_name ?? "Tijar",
    site_tagline: settings.site_tagline ?? "Your Online Store",
    phone: settings.phone ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
    // Was only configurable from a separate, now-removed page and
    // never actually saved (missing from the backend whitelist) —
    // consolidated here since this is the one field from that page
    // that's genuinely read elsewhere (the product page's "Ask on
    // WhatsApp" message).
    whatsapp_product_msg: settings.whatsapp_product_msg ?? "Hi! I am interested in: {product_name} (Rs {price}). Can you provide more details?",
    shipping_fee: settings.shipping_fee ?? "0",
    delivery_threshold: settings.delivery_threshold ?? "0",
    low_stock_threshold: settings.low_stock_threshold ?? "5",
    new_arrival_days: settings.new_arrival_days ?? "30",
    loyalty_enabled: settings.loyalty_enabled ?? "1",
    loyalty_points_rate: settings.loyalty_points_rate ?? "10",
    loyalty_redeem_enabled: settings.loyalty_redeem_enabled ?? "1",
    loyalty_min_redeem: settings.loyalty_min_redeem ?? "100",
    login_max_attempts: settings.login_max_attempts ?? "5",
    login_lockout_minutes: settings.login_lockout_minutes ?? "15",
    admin_max_attempts: settings.admin_max_attempts ?? "3",
    admin_lockout_minutes: settings.admin_lockout_minutes ?? "30",
    admin_path: settings.admin_path ?? "ml-admin",
    topbar_message: settings.topbar_message ?? "",
    sale_enabled: settings.sale_enabled ?? "0",
    sale_label: settings.sale_label ?? "FLASH SALE",
    sale_badge: settings.sale_badge ?? "UP TO 60% OFF",
    sale_ends_at: settings.sale_ends_at ?? "",
    sale_bg: settings.sale_bg ?? "#991B1B",
    sale_text_color: settings.sale_text_color ?? "#ffffff",
    sale_discount: settings.sale_discount ?? "",
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    twitter_url: settings.twitter_url ?? "",
    youtube_url: settings.youtube_url ?? "",
    messenger_url: settings.messenger_url ?? "",
    // meta_title/meta_description removed — now exclusively managed on
    // the dedicated SEO page. Leaving these in this form's data object
    // would submit empty values on every Settings save and silently
    // overwrite whatever was set via the SEO page, since both forms
    // post to the same backend endpoint.
    product_contact_method: settings.product_contact_method ?? "whatsapp",
    show_whatsapp_button: settings.show_whatsapp_button ?? "1",
    show_phone_button: settings.show_phone_button ?? "1"
  });
  function save(e) {
    e.preventDefault();
    post(`${ap}/settings`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Settings", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Settings — Admin" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs(Section, { title: "Store Information", icon: "🏪", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Store Name", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.site_name, onChange: (e) => setData("site_name", e.target.value), placeholder: "Our Store" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Tagline", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.site_tagline, onChange: (e) => setData("site_tagline", e.target.value), placeholder: "Your Online Store" }) })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Announcement Bar Message", hint: "Shown at the very top of the store", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.topbar_message, onChange: (e) => setData("topbar_message", e.target.value), placeholder: "Free delivery on orders over Rs 5,000!" }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Shipping & Delivery", icon: "🚚", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Shipping Fee (Rs)", hint: "Charged per order", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "0", value: data.shipping_fee, onChange: (e) => setData("shipping_fee", e.target.value), placeholder: "200" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Free Delivery Above (Rs)", hint: "0 = always charge shipping", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "0", value: data.delivery_threshold, onChange: (e) => setData("delivery_threshold", e.target.value), placeholder: "5000" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Low Stock Alert", hint: "Warn admin when product stock falls to or below this number", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "0", value: data.low_stock_threshold, onChange: (e) => setData("low_stock_threshold", e.target.value), placeholder: "5" }) }),
            /* @__PURE__ */ jsx(Field, { label: "New Arrivals Window (days)", hint: "Products added within N days show in New Arrivals", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "1", value: data.new_arrival_days, onChange: (e) => setData("new_arrival_days", e.target.value), placeholder: "30" }) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 pt-3 pb-1 border-t border-gray-100", children: /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider", children: "🪙 Loyalty Points" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Enable Loyalty Program", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.loyalty_enabled === "1", onChange: (e) => setData("loyalty_enabled", e.target.checked ? "1" : "0"), className: "w-4 h-4 cursor-pointer", style: { accentColor: "var(--color-primary)" } }),
              /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold", children: data.loyalty_enabled === "1" ? "✅ Enabled" : "❌ Disabled" })
            ] }) }),
            /* @__PURE__ */ jsx(Field, { label: "Points Earning Rate", hint: "1 point per Rs X spent. 100 pts = Rs 10 discount", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500 whitespace-nowrap", children: "1 pt per Rs" }),
              /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "1", value: data.loyalty_points_rate, onChange: (e) => setData("loyalty_points_rate", e.target.value), placeholder: "10" }),
              /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500 whitespace-nowrap", children: "spent" })
            ] }) }),
            /* @__PURE__ */ jsx(Field, { label: "Allow Points Redemption at Checkout", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.loyalty_redeem_enabled === "1", onChange: (e) => setData("loyalty_redeem_enabled", e.target.checked ? "1" : "0"), className: "w-4 h-4 cursor-pointer", style: { accentColor: "var(--color-primary)" } }),
              /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold", children: data.loyalty_redeem_enabled === "1" ? "✅ Allowed" : "❌ Disabled" })
            ] }) }),
            /* @__PURE__ */ jsx(Field, { label: "Minimum Points to Redeem", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "1", value: data.loyalty_min_redeem, onChange: (e) => setData("loyalty_min_redeem", e.target.value), placeholder: "100" }) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 pt-3 pb-1 border-t border-gray-100", children: /* @__PURE__ */ jsx("p", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider", children: "🔒 Security" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Customer Max Login Attempts", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "3", max: "20", value: data.login_max_attempts, onChange: (e) => setData("login_max_attempts", e.target.value), placeholder: "5" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Customer Lockout (minutes)", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "5", value: data.login_lockout_minutes, onChange: (e) => setData("login_lockout_minutes", e.target.value), placeholder: "15" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Admin Max Login Attempts", hint: "Recommended: 3", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "1", max: "10", value: data.admin_max_attempts, onChange: (e) => setData("admin_max_attempts", e.target.value), placeholder: "3" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Admin Lockout (minutes)", hint: "Recommended: 30", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "5", value: data.admin_lockout_minutes, onChange: (e) => setData("admin_lockout_minutes", e.target.value), placeholder: "30" }) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 mt-2 mb-1", children: /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black text-gray-400 uppercase tracking-wider", children: "🔒 Security — Login Attempts" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Customer Max Login Attempts", hint: "Lock account after this many failed attempts (per 15 min window)", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "3", max: "20", value: data.login_max_attempts, onChange: (e) => setData("login_max_attempts", e.target.value), placeholder: "5" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Customer Lockout (minutes)", hint: "How long to lock after max attempts", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "5", max: "1440", value: data.login_lockout_minutes, onChange: (e) => setData("login_lockout_minutes", e.target.value), placeholder: "15" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Admin Max Login Attempts", hint: "Stricter limit for admin login (recommended: 3)", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "1", max: "10", value: data.admin_max_attempts, onChange: (e) => setData("admin_max_attempts", e.target.value), placeholder: "3" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Admin Lockout (minutes)", hint: "How long to lock admin after max attempts (recommended: 30)", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "5", max: "1440", value: data.admin_lockout_minutes, onChange: (e) => setData("admin_lockout_minutes", e.target.value), placeholder: "30" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12.5px] text-blue-700", children: [
            "💡 ",
            /* @__PURE__ */ jsx("strong", { children: "Example:" }),
            " Fee = Rs 200, Free above = Rs 5,000 → orders under Rs 5,000 pay Rs 200, orders over get free delivery. Set both to 0 for always free."
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Contact Information", icon: "📞", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Phone Number", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.phone, onChange: (e) => setData("phone", e.target.value), placeholder: "+92 300 0000000" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Support Email", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "email", value: data.email, onChange: (e) => setData("email", e.target.value), placeholder: "support@yourstore.com" }) })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "WhatsApp Number", hint: "Include country code — no spaces or dashes", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.whatsapp_number, onChange: (e) => setData("whatsapp_number", e.target.value), placeholder: "923001234567" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Product Inquiry Message", hint: "Pre-filled message when a customer asks about a specific product on WhatsApp. Use {product_name} and {price} as placeholders.", children: /* @__PURE__ */ jsx("textarea", { className: textareaCls, rows: 2, value: data.whatsapp_product_msg, onChange: (e) => setData("whatsapp_product_msg", e.target.value), placeholder: "Hi! I am interested in: {product_name} (Rs {price}). Can you provide more details?" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Store Address", children: /* @__PURE__ */ jsx("textarea", { className: textareaCls, rows: 2, value: data.address, onChange: (e) => setData("address", e.target.value), placeholder: "Shop 12, Main Market, Karachi" }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Admin Panel URL", icon: "🔐", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-800", children: [
            "⚠️ ",
            /* @__PURE__ */ jsx("strong", { children: "After saving, your admin URL will change." }),
            " You will be logged out and redirected to the new URL."
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Admin Path", hint: `Current: ${typeof window !== "undefined" ? window.location.origin : ""}/${data.admin_path}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "h-11 px-3 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-[13px] text-gray-500 flex items-center flex-shrink-0 whitespace-nowrap", children: "yourdomain.com/" }),
            /* @__PURE__ */ jsx("input", { className: inputCls + " rounded-l-none", value: data.admin_path, onChange: (e) => setData("admin_path", e.target.value.replace(/[^a-z0-9-]/g, "").toLowerCase()), placeholder: "tijar-admin" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Section, { title: "Social Media", icon: "🌐", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "Facebook URL", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.facebook_url, onChange: (e) => setData("facebook_url", e.target.value), placeholder: "https://facebook.com/..." }) }),
          /* @__PURE__ */ jsx(Field, { label: "Instagram URL", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.instagram_url, onChange: (e) => setData("instagram_url", e.target.value), placeholder: "https://instagram.com/..." }) }),
          /* @__PURE__ */ jsx(Field, { label: "Twitter/X URL", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.twitter_url, onChange: (e) => setData("twitter_url", e.target.value), placeholder: "https://x.com/..." }) }),
          /* @__PURE__ */ jsx(Field, { label: "YouTube URL", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.youtube_url, onChange: (e) => setData("youtube_url", e.target.value), placeholder: "https://youtube.com/..." }) })
        ] }) }),
        /* @__PURE__ */ jsxs(Section, { title: "Product Contact Button", icon: "💬", children: [
          /* @__PURE__ */ jsx(Field, { label: "Primary Contact Method", hint: "Button shown on product pages", children: /* @__PURE__ */ jsxs("select", { className: inputCls, value: data.product_contact_method, onChange: (e) => setData("product_contact_method", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "whatsapp", children: "WhatsApp" }),
            /* @__PURE__ */ jsx("option", { value: "phone", children: "Phone Call" }),
            /* @__PURE__ */ jsx("option", { value: "email", children: "Email" }),
            /* @__PURE__ */ jsx("option", { value: "messenger", children: "Facebook Messenger" }),
            /* @__PURE__ */ jsx("option", { value: "none", children: "None (only Add to Cart)" })
          ] }) }),
          data.product_contact_method === "messenger" && /* @__PURE__ */ jsx(Field, { label: "Messenger URL", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.messenger_url, onChange: (e) => setData("messenger_url", e.target.value), placeholder: "https://m.me/yourpage" }) })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full h-14 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-3 transition-all hover:opacity-90",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 20 }),
              processing ? "Saving…" : "Save All Settings"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs(Section, { title: "Flash Sale / Countdown Timer", icon: "⚡", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[12px] text-amber-700 mb-1", children: "Show a countdown timer in the storefront header. Set end time and enable to activate." }),
          /* @__PURE__ */ jsx(Field, { label: "Enable Flash Sale Bar", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.sale_enabled === "1", onChange: (e) => setData("sale_enabled", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: data.sale_enabled === "1" ? "✅ Active" : "❌ Hidden" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Sale Label", hint: "e.g. AZADI SALE, EID SPECIAL", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.sale_label, onChange: (e) => setData("sale_label", e.target.value), placeholder: "FLASH SALE" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Badge Text", hint: "e.g. UP TO 60% OFF", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.sale_badge, onChange: (e) => setData("sale_badge", e.target.value), placeholder: "UP TO 60% OFF" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Sale Ends At", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "datetime-local", value: data.sale_ends_at, onChange: (e) => setData("sale_ends_at", e.target.value) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Sale Discount %", hint: "e.g. 60 means all products show 60% OFF and prices are reduced by 60%", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", min: "0", max: "99", value: data.sale_discount, onChange: (e) => setData("sale_discount", e.target.value), placeholder: "e.g. 60" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Bar Color", children: /* @__PURE__ */ jsx("input", { type: "color", value: data.sale_bg, onChange: (e) => setData("sale_bg", e.target.value), className: "w-10 h-10 rounded-lg cursor-pointer border border-gray-200" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Text Color", children: /* @__PURE__ */ jsx("input", { type: "color", value: data.sale_text_color, onChange: (e) => setData("sale_text_color", e.target.value), className: "w-10 h-10 rounded-lg cursor-pointer border border-gray-200" }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "sticky top-20", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:opacity-90",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 18 }),
              processing ? "Saving…" : "Save Settings"
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  Settings as default
};
