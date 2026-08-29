import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { useState } from "react";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-ClODoR4t.js";
import "react-dom/server";
import "@inertiajs/core";
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
function ImageUploadField({ label, current, onFile }) {
  const [preview, setPreview] = useState(current ?? null);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-2", children: label }),
    preview && /* @__PURE__ */ jsx("div", { className: "mb-2 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsx("img", { src: preview, className: "max-h-full max-w-full object-contain", alt: "" }) }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-[var(--color-primary,#00c8ff)] rounded-xl px-4 py-3 cursor-pointer transition-colors", children: [
      /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
        var _a;
        const f = (_a = e.target.files) == null ? void 0 : _a[0];
        if (f) {
          setPreview(URL.createObjectURL(f));
          onFile(f);
        }
      } }),
      /* @__PURE__ */ jsx(IconUpload, { size: 16, className: "text-[var(--color-primary,#00c8ff)]" }),
      /* @__PURE__ */ jsx("span", { className: "text-[13px] text-gray-500", children: "Click to upload image" })
    ] })
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
    admin_email: settings.admin_email ?? "",
    mail_host: settings.mail_host ?? "",
    mail_port: settings.mail_port ?? "587",
    mail_username: settings.mail_username ?? "",
    mail_password: settings.mail_password ?? "",
    mail_encryption: settings.mail_encryption ?? "tls",
    mail_from_address: settings.mail_from_address ?? "",
    mail_from_name: settings.mail_from_name ?? "",
    email_notify_customer: settings.email_notify_customer ?? "1",
    email_notify_admin: settings.email_notify_admin ?? "1",
    email_notify_on: settings.email_notify_on ?? "processing,shipped,delivered,cancelled",
    whatsapp_enabled: settings.whatsapp_enabled ?? "0",
    whatsapp_api_key: settings.whatsapp_api_key ?? "",
    whatsapp_phone_id: settings.whatsapp_phone_id ?? "",
    whatsapp_admin_phone: settings.whatsapp_admin_phone ?? "",
    whatsapp_notify_customer: settings.whatsapp_notify_customer ?? "1",
    whatsapp_notify_admin: settings.whatsapp_notify_admin ?? "1",
    whatsapp_notify_on: settings.whatsapp_notify_on ?? "processing,shipped,delivered,cancelled",
    whatsapp_order_template: settings.whatsapp_order_template ?? "",
    whatsapp_ship_template: settings.whatsapp_ship_template ?? "",
    whatsapp_deliver_template: settings.whatsapp_deliver_template ?? "",
    whatsapp_cancel_template: settings.whatsapp_cancel_template ?? "",
    sms_enabled: settings.sms_enabled ?? "0",
    sms_provider: settings.sms_provider ?? "",
    sms_api_key: settings.sms_api_key ?? "",
    sms_api_secret: settings.sms_api_secret ?? "",
    sms_api_url: settings.sms_api_url ?? "",
    sms_sender_id: settings.sms_sender_id ?? "",
    sms_notify_on: settings.sms_notify_on ?? "",
    address: settings.address ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
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
    ticker_items: settings.ticker_items ?? "",
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    twitter_url: settings.twitter_url ?? "",
    youtube_url: settings.youtube_url ?? "",
    messenger_url: settings.messenger_url ?? "",
    meta_title: settings.meta_title ?? "",
    meta_description: settings.meta_description ?? "",
    product_contact_method: settings.product_contact_method ?? "whatsapp",
    show_whatsapp_button: settings.show_whatsapp_button ?? "1",
    show_phone_button: settings.show_phone_button ?? "1",
    trust_1_icon: settings.trust_1_icon ?? "🚚",
    trust_1_title: settings.trust_1_title ?? "Free Delivery",
    trust_1_sub: settings.trust_1_sub ?? "On qualifying orders",
    trust_2_icon: settings.trust_2_icon ?? "🛡️",
    trust_2_title: settings.trust_2_title ?? "100% Genuine",
    trust_2_sub: settings.trust_2_sub ?? "Verified products only",
    trust_3_icon: settings.trust_3_icon ?? "↩️",
    trust_3_title: settings.trust_3_title ?? "Easy Returns",
    trust_3_sub: settings.trust_3_sub ?? "7-day hassle-free",
    trust_4_icon: settings.trust_4_icon ?? "🎧",
    trust_4_title: settings.trust_4_title ?? "24/7 Support",
    trust_4_sub: settings.trust_4_sub ?? "We are here to help",
    trust_5_icon: settings.trust_5_icon ?? "💬",
    trust_5_title: settings.trust_5_title ?? "WhatsApp Us",
    trust_5_sub: settings.trust_5_sub ?? "Quick response",
    trust_bar_bg: settings.trust_bar_bg ?? "#0a0e1a",
    trust_icon_color: settings.trust_icon_color ?? "#00c8ff",
    trust_title_color: settings.trust_title_color ?? "#ffffff",
    trust_sub_color: settings.trust_sub_color ?? "#6b8aaa",
    ticker_bg: settings.ticker_bg ?? "#ffffff",
    ticker_live_bg: settings.ticker_live_bg ?? "#00c8ff",
    ticker_live_text: settings.ticker_live_text ?? "#0a0e1a",
    ticker_text_color: settings.ticker_text_color ?? "#6b7280",
    brands_show: settings.brands_show ?? "1",
    brands_title: settings.brands_title ?? "Top Brands",
    brands_subtitle: settings.brands_subtitle ?? "Official Partners",
    brands_items: settings.brands_items ?? "Apple|Samsung|Sony|Dell|LG|ASUS",
    logo: null
  });
  function save(e) {
    e.preventDefault();
    post(`${ap}/settings`, { forceFormData: true });
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
        /* @__PURE__ */ jsxs(Section, { title: "SEO", icon: "🔍", children: [
          /* @__PURE__ */ jsx(Field, { label: "Meta Title", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.meta_title, onChange: (e) => setData("meta_title", e.target.value), placeholder: "Our Store — Best Online Shop" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Meta Description", children: /* @__PURE__ */ jsx("textarea", { className: textareaCls, rows: 3, value: data.meta_description, onChange: (e) => setData("meta_description", e.target.value), placeholder: "Your online store description for Google search results." }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Trust Bar & Ticker", icon: "🛡️", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500", children: "5 badges shown under the header. Set icon (emoji), title and sub-text for each badge." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[48px_1fr_1.4fr] gap-2 items-center p-3 bg-gray-50 rounded-xl", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data[`trust_${n}_icon`] ?? "",
                onChange: (e) => setData(`trust_${n}_icon`, e.target.value),
                className: "h-10 text-center text-xl border-2 border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary,#00c8ff)] bg-white",
                placeholder: "🚚"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data[`trust_${n}_title`] ?? "",
                onChange: (e) => setData(`trust_${n}_title`, e.target.value),
                className: inputCls,
                placeholder: "Title e.g. Free Delivery"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data[`trust_${n}_sub`] ?? "",
                onChange: (e) => setData(`trust_${n}_sub`, e.target.value),
                className: inputCls,
                placeholder: "e.g. Orders over Rs 5,000"
              }
            )
          ] }, n)) }),
          /* @__PURE__ */ jsx(Field, { label: "Scrolling Ticker Text", hint: "Separate each item with a | pipe character", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.ticker_items, onChange: (e) => setData("ticker_items", e.target.value), placeholder: "Free shipping Rs 5000+|7-day returns|Verified products|24/7 support" }) }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-100", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-700 mb-3", children: "Trust Bar Colors" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              ["trust_bar_bg", "Bar Background"],
              ["trust_icon_color", "Icon Accent Color"],
              ["trust_title_color", "Title Text Color"],
              ["trust_sub_color", "Sub Text Color"]
            ].map(([key, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11.5px] font-semibold text-gray-500 mb-1.5", children: label }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data[key] || "#000000",
                    onChange: (e) => setData(key, e.target.value),
                    className: "w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: data[key] || "",
                    onChange: (e) => setData(key, e.target.value),
                    className: "flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]",
                    placeholder: "#000000"
                  }
                )
              ] })
            ] }, key)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-gray-100", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-700 mb-3", children: "Ticker Bar Colors" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: [
              ["ticker_bg", "Ticker Background"],
              ["ticker_live_bg", '"LIVE" Badge Color'],
              ["ticker_live_text", '"LIVE" Text Color'],
              ["ticker_text_color", "Ticker Text Color"]
            ].map(([key, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11.5px] font-semibold text-gray-500 mb-1.5", children: label }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data[key] || "#000000",
                    onChange: (e) => setData(key, e.target.value),
                    className: "w-9 h-9 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5 bg-white flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: data[key] || "",
                    onChange: (e) => setData(key, e.target.value),
                    className: "flex-1 h-9 px-2 border border-gray-200 rounded-lg text-[11.5px] font-mono outline-none focus:border-[var(--color-primary)]",
                    placeholder: "#000000"
                  }
                )
              ] })
            ] }, key)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Brands Bar", icon: "🏷️", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 pb-4 border-b border-gray-100", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13.5px] font-semibold text-gray-800", children: "Show Brands Section" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-400", children: "Display on homepage" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData("brands_show", data.brands_show === "1" ? "0" : "1"),
                className: `relative w-12 h-6 rounded-full border-none cursor-pointer transition-all ${data.brands_show === "1" ? "bg-[var(--color-primary)]" : "bg-gray-200"}`,
                children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.brands_show === "1" ? "left-[26px]" : "left-0.5"}` })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Section Title", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.brands_title, onChange: (e) => setData("brands_title", e.target.value), placeholder: "Top Brands" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Eyebrow Text", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.brands_subtitle, onChange: (e) => setData("brands_subtitle", e.target.value), placeholder: "Official Partners" }) })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "Brand Names", hint: "Separate with | pipe character. e.g. Apple|Samsung|Sony|Dell", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.brands_items, onChange: (e) => setData("brands_items", e.target.value), placeholder: "Apple|Samsung|Sony|Dell|LG|ASUS" }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-3 bg-gray-50 border border-gray-100 rounded-xl text-[12px] text-gray-500", children: [
            "Preview: ",
            (data.brands_items || "").split("|").filter(Boolean).map((b) => b.trim()).join(" · ")
          ] })
        ] }),
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
        /* @__PURE__ */ jsxs(Section, { title: "Email / SMTP Settings", icon: "📧", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 mb-1", children: "Configure SMTP here — overrides .env. Leave blank to use .env settings. Mailtrap: sandbox.smtp.mailtrap.io / port 2525 / TLS. Gmail: enable 2FA → Google Account → App Passwords." }),
          /* @__PURE__ */ jsx(Field, { label: "SMTP Host", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.mail_host, onChange: (e) => setData("mail_host", e.target.value), placeholder: "sandbox.smtp.mailtrap.io" }) }),
          /* @__PURE__ */ jsx(Field, { label: "SMTP Port", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "number", value: data.mail_port, onChange: (e) => setData("mail_port", e.target.value), placeholder: "587" }) }),
          /* @__PURE__ */ jsx(Field, { label: "SMTP Username", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.mail_username, onChange: (e) => setData("mail_username", e.target.value), placeholder: "you@gmail.com" }) }),
          /* @__PURE__ */ jsx(Field, { label: "SMTP Password", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "password", value: data.mail_password, onChange: (e) => setData("mail_password", e.target.value), placeholder: "••••••••" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Encryption", children: /* @__PURE__ */ jsxs("select", { className: inputCls, value: data.mail_encryption, onChange: (e) => setData("mail_encryption", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "tls", children: "TLS (recommended)" }),
            /* @__PURE__ */ jsx("option", { value: "ssl", children: "SSL" }),
            /* @__PURE__ */ jsx("option", { value: "", children: "None" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "From Email", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "email", value: data.mail_from_address, onChange: (e) => setData("mail_from_address", e.target.value), placeholder: "noreply@millionaire.pk" }) }),
          /* @__PURE__ */ jsx(Field, { label: "From Name", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.mail_from_name, onChange: (e) => setData("mail_from_name", e.target.value), placeholder: "MILLIONAIRE" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Admin Email", hint: "Receives new order alerts", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "email", value: data.admin_email, onChange: (e) => setData("admin_email", e.target.value), placeholder: "admin@millionaire.pk" }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "Email Notification Rules", icon: "✉️", children: [
          /* @__PURE__ */ jsx(Field, { label: "Notify Customer", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.email_notify_customer === "1", onChange: (e) => setData("email_notify_customer", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "Send email to customer on status change" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Notify Admin", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.email_notify_admin === "1", onChange: (e) => setData("email_notify_admin", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "Send new order alert to admin" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Send Email On", hint: "Comma separated statuses", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.email_notify_on, onChange: (e) => setData("email_notify_on", e.target.value), placeholder: "processing,shipped,delivered,cancelled" }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "WhatsApp Business API", icon: "💬", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 p-3 bg-green-50 border border-green-100 rounded-xl text-[12px] text-green-700 mb-1", children: "Get API Key & Phone ID from developers.facebook.com → WhatsApp → API Setup. Free: 1,000 msgs/month." }),
          /* @__PURE__ */ jsx(Field, { label: "Enable WhatsApp", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.whatsapp_enabled === "1", onChange: (e) => setData("whatsapp_enabled", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: data.whatsapp_enabled === "1" ? "✅ Enabled" : "❌ Disabled" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Send WA On", hint: "Comma separated statuses", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.whatsapp_notify_on, onChange: (e) => setData("whatsapp_notify_on", e.target.value), placeholder: "processing,shipped,delivered,cancelled" }) }),
          /* @__PURE__ */ jsx(Field, { label: "API Key (Access Token)", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "password", value: data.whatsapp_api_key, onChange: (e) => setData("whatsapp_api_key", e.target.value), placeholder: "EAAxxxxxxxxxxxxxxx" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Phone Number ID", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.whatsapp_phone_id, onChange: (e) => setData("whatsapp_phone_id", e.target.value), placeholder: "1234567890123456" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Admin WhatsApp Number", hint: "With country code, no + (e.g. 923001234567)", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.whatsapp_admin_phone, onChange: (e) => setData("whatsapp_admin_phone", e.target.value), placeholder: "923001234567" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Notify Customer", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.whatsapp_notify_customer === "1", onChange: (e) => setData("whatsapp_notify_customer", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "WA message to customer on status change" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1", children: "Message Templates — use: name, order_number, total, tracking_url in curly braces" }),
          /* @__PURE__ */ jsx(Field, { label: "Order Placed Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_order_template, onChange: (e) => setData("whatsapp_order_template", e.target.value), placeholder: "Hi {name}! Order {order_number} confirmed. Total: {total}. Track: {tracking_url}" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Shipped Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_ship_template, onChange: (e) => setData("whatsapp_ship_template", e.target.value), placeholder: "Hi {name}! Order {order_number} shipped! Track: {tracking_url}" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Delivered Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_deliver_template, onChange: (e) => setData("whatsapp_deliver_template", e.target.value), placeholder: "Hi {name}! Order {order_number} delivered. Thank you!" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Cancelled Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_cancel_template, onChange: (e) => setData("whatsapp_cancel_template", e.target.value), placeholder: "Hi {name}, order {order_number} was cancelled." }) })
        ] }),
        /* @__PURE__ */ jsxs(Section, { title: "SMS API (Optional — Future Use)", icon: "📱", children: [
          /* @__PURE__ */ jsx("div", { className: "col-span-2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-500 mb-1", children: "Supports Twilio, eOcean Pakistan, Zong, Ufone or custom API. Leave blank to disable SMS." }),
          /* @__PURE__ */ jsx(Field, { label: "Enable SMS", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.sms_enabled === "1", onChange: (e) => setData("sms_enabled", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: data.sms_enabled === "1" ? "✅ Enabled" : "❌ Disabled" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Provider", children: /* @__PURE__ */ jsxs("select", { className: inputCls, value: data.sms_provider, onChange: (e) => setData("sms_provider", e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "— Select Provider —" }),
            /* @__PURE__ */ jsx("option", { value: "twilio", children: "Twilio (International)" }),
            /* @__PURE__ */ jsx("option", { value: "eocean", children: "eOcean Pakistan" }),
            /* @__PURE__ */ jsx("option", { value: "zong", children: "Zong (CMPAK)" }),
            /* @__PURE__ */ jsx("option", { value: "ufone", children: "Ufone (PTML)" }),
            /* @__PURE__ */ jsx("option", { value: "custom", children: "Custom API URL" })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "API Key", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "password", value: data.sms_api_key, onChange: (e) => setData("sms_api_key", e.target.value), placeholder: "API Key / Account SID" }) }),
          /* @__PURE__ */ jsx(Field, { label: "API Secret", hint: "Twilio Auth Token", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "password", value: data.sms_api_secret, onChange: (e) => setData("sms_api_secret", e.target.value), placeholder: "Auth Token" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Sender ID", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.sms_sender_id, onChange: (e) => setData("sms_sender_id", e.target.value), placeholder: "MILLIONAIRE" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Send SMS On", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.sms_notify_on, onChange: (e) => setData("sms_notify_on", e.target.value), placeholder: "shipped,delivered" }) })
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
        /* @__PURE__ */ jsxs(Section, { title: "Store Logo", icon: "🖼️", children: [
          /* @__PURE__ */ jsx(ImageUploadField, { label: "Logo (landscape, up to 400×120px — transparent PNG, padding auto-trimmed)", current: settings.logo_url, onFile: (f) => setData("logo", f) }),
          /* @__PURE__ */ jsx("div", { className: "col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700", children: "The logo box has no background — it sits directly on your header color. Use a transparent PNG so it looks correct on any header color you choose in Theme settings." }),
          settings.logo_url && /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-gray-500 mb-2", children: "Header preview (on your current navbar color)" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-16 h-16 rounded-xl flex items-center justify-center p-2 border border-gray-200",
                style: { background: "var(--color-navbar-bg,#ffffff)" },
                children: /* @__PURE__ */ jsx("img", { src: settings.logo_url, alt: "logo preview", className: "w-full h-full object-contain" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[14px] text-gray-800 mb-4", children: "📐 Image Size Reference" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 text-[12.5px]", children: [
            { label: "Logo", size: "400×120px", hint: "Landscape icon+wordmark, transparent — padding auto-trimmed" },
            { label: "Hero Slide", size: "1920×1080px", hint: "Full-width slider, subject centered" },
            { label: "Full Banner", size: "1920×520px", hint: "Homepage wide banner, subject centered" },
            { label: "Category Image", size: "900×1080px", hint: "Nearly square, subject centered (square on desktop, 3:4 on mobile)" },
            { label: "Category Banner", size: "1920×380px", hint: "Category page header" },
            { label: "Product Image", size: "800×1067px", hint: "Portrait 3:4, white background" }
          ].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(IconCheck, { size: 13, className: "flex-shrink-0 mt-0.5", style: { color: "var(--color-primary)" } }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-gray-700", children: [
                s.label,
                ":"
              ] }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: s.size }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: s.hint })
            ] })
          ] }, s.label)) }),
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mt-4 pt-3 border-t border-gray-100", children: "Upload images for Hero Slides, Banners, Categories and Products in their own admin sections." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5 sm:p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-5 flex items-center gap-2", children: "🎨 Theme Colors & Style" }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl overflow-hidden border border-gray-200 mb-5", style: { fontSize: 0 }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2", style: { background: data.topbar_bg || "#0a0a0a" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600 }, children: "+92 300 0000000" }),
              /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.5)", fontSize: 11 }, children: "Free delivery on orders over Rs 5,000" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100", children: [
              /* @__PURE__ */ jsx("div", { className: "font-black text-[14px]", style: { color: data.theme_dark_bg || "#0a0a0a" }, children: "MILLIONAIRE" }),
              /* @__PURE__ */ jsx("div", { className: "flex-1" }),
              /* @__PURE__ */ jsx("div", { className: "h-7 px-4 rounded-full text-white text-[11px] font-bold flex items-center", style: { background: data.theme_primary || "#C9A84C" }, children: "Shop Now" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "px-4 py-4", style: { background: data.theme_body_bg || "#FAFAFA" }, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-xl overflow-hidden flex-shrink-0", style: { width: 80, background: "#f0f0f0" }, children: [
                /* @__PURE__ */ jsx("div", { style: { aspectRatio: "3/4", background: `linear-gradient(135deg, ${data.theme_primary || "#C9A84C"}22, ${data.theme_dark_bg || "#0a0a0a"}11)` } }),
                /* @__PURE__ */ jsxs("div", { className: "p-2", style: { background: "white" }, children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[9px] font-bold", style: { color: data.theme_primary || "#C9A84C" }, children: "CLOTHES" }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-black", style: { color: data.theme_dark_bg || "#0a0a0a" }, children: "Rs 4,500" }),
                  /* @__PURE__ */ jsx("div", { className: "mt-1 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold", style: { background: data.theme_dark_bg || "#0a0a0a" }, children: "Add to Cart" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-[11px] font-black mb-2", style: { color: data.theme_dark_bg || "#0a0a0a" }, children: "Live Preview" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold px-2 py-1 rounded-full text-white", style: { background: data.theme_primary || "#C9A84C" }, children: "Primary" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold px-2 py-1 rounded-full text-white", style: { background: data.theme_accent || "#C9A84C" }, children: "Accent" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold px-2 py-1 rounded-full text-white", style: { background: data.theme_dark_bg || "#0a0a0a" }, children: "Dark" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 text-[9px] font-bold", style: { color: "#6B7280" }, children: [
                  "Border radius: ",
                  data.theme_border_radius || 8,
                  "px"
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Top Bar Background" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data.topbar_bg || "#0a0a0a",
                    onChange: (e) => setData("topbar_bg", e.target.value),
                    className: "h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]",
                    value: data.topbar_bg || "#0a0a0a",
                    onChange: (e) => setData("topbar_bg", e.target.value),
                    placeholder: "#0a0a0a"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "The black announcement bar at very top" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Primary Color (Gold)" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data.theme_primary || "#C9A84C",
                    onChange: (e) => {
                      setData("theme_primary", e.target.value);
                    },
                    className: "h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]",
                    value: data.theme_primary || "#C9A84C",
                    onChange: (e) => setData("theme_primary", e.target.value),
                    placeholder: "#C9A84C"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Buttons, links, accents, nav highlights" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Accent Color (Sale badges)" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data.theme_accent || "#C9A84C",
                    onChange: (e) => setData("theme_accent", e.target.value),
                    className: "h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]",
                    value: data.theme_accent || "#C9A84C",
                    onChange: (e) => setData("theme_accent", e.target.value),
                    placeholder: "#e91e63"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Discount badges, sale labels, wishlist" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Dark Background" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data.theme_dark_bg || "#0a0a0a",
                    onChange: (e) => setData("theme_dark_bg", e.target.value),
                    className: "h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]",
                    value: data.theme_dark_bg || "#0a0a0a",
                    onChange: (e) => setData("theme_dark_bg", e.target.value),
                    placeholder: "#0a0a0a"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Hero slider, Add to Cart button, headings" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: "Page Background" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "color",
                    value: data.theme_body_bg || "#FAFAFA",
                    onChange: (e) => setData("theme_body_bg", e.target.value),
                    className: "h-10 w-14 rounded-xl border border-gray-200 cursor-pointer p-1 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "flex-1 h-10 px-3 border border-gray-200 rounded-xl text-[13px] font-mono outline-none focus:border-[var(--color-primary)]",
                    value: data.theme_body_bg || "#FAFAFA",
                    onChange: (e) => setData("theme_body_bg", e.target.value),
                    placeholder: "#FAFAFA"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 mt-1", children: "Main page/body background color" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-2", children: [
                "Border Radius — ",
                data.theme_border_radius || 8,
                "px"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "range",
                  min: "0",
                  max: "24",
                  value: data.theme_border_radius || "8",
                  onChange: (e) => setData("theme_border_radius", e.target.value),
                  className: "w-full h-2 rounded-full accent-[var(--color-primary)] cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] text-gray-400 mt-1", children: [
                /* @__PURE__ */ jsx("span", { children: "Sharp (0)" }),
                /* @__PURE__ */ jsx("span", { children: "Rounded (12)" }),
                /* @__PURE__ */ jsx("span", { children: "Pill (24)" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-3", children: [0, 4, 8, 12, 16, 24].map((r) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setData("theme_border_radius", String(r)),
                  className: "flex-1 h-8 text-[11px] font-bold cursor-pointer border transition-all",
                  style: {
                    borderRadius: r,
                    background: Number(data.theme_border_radius) === r ? "var(--color-primary)" : "white",
                    color: Number(data.theme_border_radius) === r ? "var(--color-primary-text)" : "#6B7280",
                    borderColor: Number(data.theme_border_radius) === r ? "var(--color-primary)" : "#E5E7EB"
                  },
                  children: r
                },
                r
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3", children: "Quick Presets" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
                { name: "Millionaire Gold", primary: "#C9A84C", dark: "#0a0a0a", body: "#FAFAFA", accent: "#C9A84C" },
                { name: "Royal Black", primary: "#ffffff", dark: "#000000", body: "#0a0a0a", accent: "#C9A84C" },
                { name: "Deep Blue", primary: "#3B82F6", dark: "#0f172a", body: "#F8FAFC", accent: "#EF4444" },
                { name: "Forest Green", primary: "#16A34A", dark: "#052e16", body: "#F0FDF4", accent: "#DC2626" }
              ].map((preset) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setData("theme_primary", preset.primary);
                    setData("theme_accent", preset.accent);
                    setData("theme_dark_bg", preset.dark);
                    setData("theme_body_bg", preset.body);
                    setData("topbar_bg", preset.dark);
                  },
                  className: "p-3 rounded-xl border-2 border-gray-100 hover:border-gray-300 cursor-pointer text-left transition-all bg-white",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 mb-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full", style: { background: preset.dark } }),
                      /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full", style: { background: preset.primary } }),
                      /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full", style: { background: preset.body, border: "1px solid #e5e7eb" } })
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-gray-600", children: preset.name })
                  ]
                },
                preset.name
              )) })
            ] })
          ] })
        ] }),
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
