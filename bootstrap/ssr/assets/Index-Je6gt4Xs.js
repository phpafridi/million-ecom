import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default } from "../ssr.js";
import { IconCheck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import "react-dom/server";
import "@inertiajs/core";
import "react";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary,#00c8ff)] transition-colors bg-white";
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
function EmailSwatch({ label, hint, value, placeholder, onChange }) {
  const display = value || placeholder;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { className: "text-[12px] font-semibold text-gray-600 mb-1", children: label }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-gray-400 mb-1.5", children: hint }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 cursor-pointer shadow-sm", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "color",
          value: display,
          onChange: (e) => onChange(e.target.value),
          className: "absolute inset-0 w-[200%] h-[200%] -top-2 -left-2 cursor-pointer border-none bg-transparent"
        }
      ) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder,
          className: "flex-1 h-9 px-3 border border-gray-200 rounded-lg text-[12px] font-mono outline-none focus:border-[var(--color-primary)] transition-colors"
        }
      ),
      value && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onChange(""), className: "text-[11px] text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer px-1", children: "Clear" })
    ] })
  ] });
}
function Notifications({ settings }) {
  const { props: _p } = usePage();
  const ap = `/${_p.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing } = useForm({
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
    email_footer_text: settings.email_footer_text ?? "",
    email_show_logo: settings.email_show_logo ?? "1",
    email_header_title: settings.email_header_title ?? "",
    email_primary_color: settings.email_primary_color ?? "",
    email_accent_color: settings.email_accent_color ?? "",
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
    sms_sender_id: settings.sms_sender_id ?? "",
    sms_notify_on: settings.sms_notify_on ?? ""
  });
  function save(e) {
    e.preventDefault();
    post(`${ap}/settings`);
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Notifications", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Notifications — Admin" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "space-y-5 max-w-3xl", children: [
      /* @__PURE__ */ jsxs(Section, { title: "Email / SMTP Settings", icon: "📧", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 mb-1", children: "Configure SMTP here — overrides .env. Leave blank to use .env settings. Mailtrap: sandbox.smtp.mailtrap.io / port 2525 / TLS. Gmail: enable 2FA → Google Account → App Passwords." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
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
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "Email Notification Rules", icon: "✉️", children: [
        /* @__PURE__ */ jsx(Field, { label: "Notify Customer", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.email_notify_customer === "1", onChange: (e) => setData("email_notify_customer", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
          /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "Send order confirmation email when placed, and on status changes below" })
        ] }) }),
        /* @__PURE__ */ jsx(Field, { label: "Notify Admin", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.email_notify_admin === "1", onChange: (e) => setData("email_notify_admin", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
          /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "Send new order alert to admin" })
        ] }) }),
        /* @__PURE__ */ jsx(Field, { label: "Send Email On", hint: "Comma separated statuses", children: /* @__PURE__ */ jsx("input", { className: inputCls, type: "text", value: data.email_notify_on, onChange: (e) => setData("email_notify_on", e.target.value), placeholder: "processing,shipped,delivered,cancelled" }) })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "Email Design", icon: "🎨", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 -mt-1", children: "Colors default to your Theme's colors and can be overridden here specifically for emails — useful if you want emails to look slightly different from the storefront (e.g. a plainer look for better inbox deliverability)." }),
        /* @__PURE__ */ jsx(Field, { label: "Show Logo in Emails", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: data.email_show_logo !== "0", onChange: (e) => setData("email_show_logo", e.target.checked ? "1" : "0"), className: "w-4 h-4", style: { accentColor: "var(--color-primary)" } }),
          /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "Show your uploaded logo at the top of emails. If off, shows your store name as text instead." })
        ] }) }),
        /* @__PURE__ */ jsx(Field, { label: "Email Header Title", hint: "Shown next to/instead of the logo. Leave blank to use your Store Name.", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.email_header_title, onChange: (e) => setData("email_header_title", e.target.value), placeholder: settings.site_name || "Your Store Name" }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(EmailSwatch, { label: "Header Background", hint: "Defaults to Theme's dark color", value: data.email_primary_color, onChange: (v) => setData("email_primary_color", v), placeholder: settings.theme_dark_bg || "#0a0a0a" }),
          /* @__PURE__ */ jsx(EmailSwatch, { label: "Accent Color", hint: "Defaults to Theme's primary color", value: data.email_accent_color, onChange: (v) => setData("email_accent_color", v), placeholder: settings.theme_primary || "#C9A84C" })
        ] }),
        /* @__PURE__ */ jsx(Field, { label: "Email Footer Message", hint: "Shown at the bottom of every order email, under the copyright line. Leave blank for none.", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: data.email_footer_text, onChange: (e) => setData("email_footer_text", e.target.value), placeholder: "e.g. Follow us @millionaire.pk for new drops" }) })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "WhatsApp Business API", icon: "💬", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-50 border border-green-100 rounded-xl text-[12px] text-green-700 mb-1", children: "Get API Key & Phone ID from developers.facebook.com → WhatsApp → API Setup. Free: 1,000 msgs/month." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
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
            /* @__PURE__ */ jsx("span", { className: "text-[13px]", children: "WA message to customer when order is placed, and on status changes below" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1", children: "Message Templates — use: name, order_number, total, tracking_url in curly braces" }),
        /* @__PURE__ */ jsx(Field, { label: "Order Placed Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_order_template, onChange: (e) => setData("whatsapp_order_template", e.target.value), placeholder: "Hi {name}! Order {order_number} confirmed. Total: {total}. Track: {tracking_url}" }) }),
        /* @__PURE__ */ jsx(Field, { label: "Shipped Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_ship_template, onChange: (e) => setData("whatsapp_ship_template", e.target.value), placeholder: "Hi {name}! Order {order_number} shipped! Track: {tracking_url}" }) }),
        /* @__PURE__ */ jsx(Field, { label: "Delivered Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_deliver_template, onChange: (e) => setData("whatsapp_deliver_template", e.target.value), placeholder: "Hi {name}! Order {order_number} delivered. Thank you!" }) }),
        /* @__PURE__ */ jsx(Field, { label: "Cancelled Template", children: /* @__PURE__ */ jsx("textarea", { className: inputCls, rows: 2, value: data.whatsapp_cancel_template, onChange: (e) => setData("whatsapp_cancel_template", e.target.value), placeholder: "Hi {name}, order {order_number} was cancelled." }) })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "SMS API (Optional)", icon: "📱", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-500 mb-1", children: "Supports Twilio, eOcean Pakistan, Zong, Ufone or custom API. Leave blank to disable SMS." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
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
        ] })
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
            processing ? "Saving…" : "Save Notification Settings"
          ]
        }
      )
    ] })
  ] });
}
export {
  Notifications as default
};
