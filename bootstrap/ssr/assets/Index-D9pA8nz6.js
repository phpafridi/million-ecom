import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-DEi-FbW0.js";
import { useState, useRef, useEffect } from "react";
import { IconMessageCircle, IconSend, IconPlus, IconTrash, IconRobot } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function ChatAdmin({ sessions, faqs, stats }) {
  const ap = "/ml-admin";
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [lastId, setLastId] = useState(0);
  const [waiting, setWaiting] = useState(stats.waiting);
  const [tab, setTab] = useState("chats");
  const [faqForm, setFaqForm] = useState(false);
  const [faq, setFaq] = useState({ question: "", answer: "", category: "general", keywords: "" });
  const bottomRef = useRef(null);
  const pollRef = useRef();
  const csrf = () => {
    var _a;
    return ((_a = document.querySelector("meta[name=csrf-token]")) == null ? void 0 : _a.content) || "";
  };
  useEffect(() => {
    const hb = setInterval(async () => {
      try {
        const r = await fetch(`${ap}/chat/heartbeat`, { method: "POST", headers: { "X-CSRF-TOKEN": csrf() } });
        const d = await r.json();
        setWaiting(d.waiting);
      } catch {
      }
    }, 15e3);
    fetch(`${ap}/chat/heartbeat`, { method: "POST", headers: { "X-CSRF-TOKEN": csrf() } });
    return () => clearInterval(hb);
  }, []);
  useEffect(() => {
    if (!active) return;
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      var _a;
      try {
        const r = await fetch(`${ap}/chat/sessions/${active.id}/poll?since=${lastId}`);
        const d = await r.json();
        if ((_a = d.messages) == null ? void 0 : _a.length) {
          setMsgs((m) => [...m, ...d.messages]);
          setLastId(d.messages[d.messages.length - 1].id);
        }
        setWaiting(d.unread_waiting ?? waiting);
      } catch {
      }
    }, 2500);
    return () => clearInterval(pollRef.current);
  }, [active, lastId]);
  useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  async function join(s) {
    var _a;
    await fetch(`${ap}/chat/sessions/${s.id}/join`, { method: "POST", headers: { "X-CSRF-TOKEN": csrf() } });
    const r = await fetch(`${ap}/chat/sessions/${s.id}/messages`);
    const d = await r.json();
    setMsgs(d.messages || []);
    setLastId(((_a = d.messages) == null ? void 0 : _a.length) ? d.messages[d.messages.length - 1].id : 0);
    setActive({ ...s, status: "active" });
    router3.reload({ only: ["sessions"] });
  }
  async function sendReply() {
    if (!input.trim() || !active) return;
    const msg = input.trim();
    setInput("");
    setMsgs((m) => [...m, { id: Date.now(), sender_type: "agent", message: msg, message_type: "text", created_at: (/* @__PURE__ */ new Date()).toISOString() }]);
    await fetch(`${ap}/chat/sessions/${active.id}/reply`, { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf() }, body: JSON.stringify({ message: msg }) });
  }
  async function closeChat() {
    if (!active) return;
    await fetch(`${ap}/chat/sessions/${active.id}/close`, { method: "POST", headers: { "X-CSRF-TOKEN": csrf() } });
    setActive(null);
    setMsgs([]);
    router3.reload({ only: ["sessions"] });
  }
  function addFaq(e) {
    e.preventDefault();
    router3.post(`${ap}/chat/faqs`, faq, { onSuccess: () => {
      setFaq({ question: "", answer: "", category: "general", keywords: "" });
      setFaqForm(false);
    } });
  }
  const bgColor = { visitor: "#F3F4F6", agent: "var(--color-dark-bg,#0a0a0a)", bot: "#EFF6FF", system: "#F9FAFB" };
  const txtColor = { visitor: "#111", agent: "white", bot: "#1E40AF", system: "#6B7280" };
  const inp = "w-full h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)]";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Live Chat", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Live Chat" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 mb-5", children: [{ l: "Waiting", v: waiting, c: "#F59E0B", i: "⏳" }, { l: "My Active", v: stats.my_active, c: "#10B981", i: "💬" }, { l: "Today", v: stats.today, c: "#3B82F6", i: "📊" }, { l: "Avg Rating", v: stats.avg_rating + "★", c: "#F59E0B", i: "⭐" }].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xl mb-1", children: s.i }),
      /* @__PURE__ */ jsx("p", { className: "font-black text-[22px]", style: { color: s.c }, children: s.v }),
      /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: s.l })
    ] }, s.l)) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-4", children: [["chats", "💬 Live Chats"], ["faq", "🤖 Bot FAQs"]].map(([k, l]) => /* @__PURE__ */ jsx("button", { onClick: () => setTab(k), className: "px-5 py-2 rounded-xl font-bold text-[13px] border-none cursor-pointer", style: { background: tab === k ? "var(--color-dark-bg)" : "#F3F4F6", color: tab === k ? "white" : "#6B7280" }, children: l }, k)) }),
    tab === "chats" ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", style: { height: "calc(100vh - 300px)" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-y-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 font-black text-[14px] text-gray-800", children: [
          "Conversations ",
          waiting > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full", children: [
            waiting,
            " waiting"
          ] })
        ] }),
        sessions.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-gray-400", children: [
          /* @__PURE__ */ jsx(IconMessageCircle, { size: 36, className: "mx-auto mb-3 opacity-20" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-[13px]", children: "No active chats" })
        ] }),
        sessions.map((s) => /* @__PURE__ */ jsxs("div", { onClick: () => s.status === "waiting" ? join(s) : setActive(s), className: `p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${(active == null ? void 0 : active.id) === s.id ? "bg-blue-50" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-[13px] text-gray-800", children: s.visitor_name || "Visitor" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
              s.unread_count > 0 && /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center", children: s.unread_count }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black px-2 py-0.5 rounded-full ${s.status === "waiting" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`, children: s.status === "waiting" ? "Waiting" : "Active" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 truncate", children: s.last_message || "No messages" }),
          s.status === "waiting" && /* @__PURE__ */ jsx("button", { className: "mt-2 text-[11px] font-black px-3 py-1 rounded-lg text-white border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Join Chat →" })
        ] }, s.id))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden", children: !active ? /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx(IconMessageCircle, { size: 48, className: "mx-auto mb-3 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "font-bold", children: "Select a conversation" })
      ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-100", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-bold text-[14px] text-gray-800", children: active.visitor_name || "Visitor" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400", children: active.visitor_email })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: closeChat, className: "h-9 px-4 rounded-xl text-[12px] font-bold border border-red-200 text-red-500 bg-white cursor-pointer", children: "End Chat" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
          msgs.map((m, i) => /* @__PURE__ */ jsx("div", { children: m.sender_type === "system" ? /* @__PURE__ */ jsx("p", { className: "text-center text-[11px] text-gray-400 bg-gray-50 rounded-lg py-1.5 px-3", children: m.message }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: m.sender_type === "visitor" ? "row" : "row-reverse", gap: 8, alignItems: "flex-end" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "70%", background: bgColor[m.sender_type] || "#F3F4F6", color: txtColor[m.sender_type] || "#111", borderRadius: 12, padding: "8px 12px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }, children: [
            m.sender_type === "bot" && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black opacity-60 block mb-0.5", children: "🤖 Bot" }),
            m.message
          ] }) }) }, m.id || i)),
          /* @__PURE__ */ jsx("div", { ref: bottomRef })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-gray-100 flex gap-2", children: [
          /* @__PURE__ */ jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendReply()), placeholder: "Type reply...", className: inp + " flex-1" }),
          /* @__PURE__ */ jsx("button", { onClick: sendReply, disabled: !input.trim(), className: "w-11 h-10 rounded-xl border-none flex items-center justify-center cursor-pointer disabled:opacity-40", style: { background: "var(--color-dark-bg)" }, children: /* @__PURE__ */ jsx(IconSend, { size: 17, color: "white" }) })
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800", children: "Bot FAQ Answers" }),
          /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mt-0.5", children: "Bot searches these when customers ask questions" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setFaqForm(true), className: "flex items-center gap-2 h-9 px-4 rounded-xl font-bold text-[13px] border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: [
          /* @__PURE__ */ jsx(IconPlus, { size: 15 }),
          " Add FAQ"
        ] })
      ] }),
      faqForm && /* @__PURE__ */ jsx("div", { className: "p-5 border-b border-gray-100 bg-gray-50", children: /* @__PURE__ */ jsxs("form", { onSubmit: addFaq, className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1", children: "Question *" }),
            /* @__PURE__ */ jsx("input", { className: inp, value: faq.question, onChange: (e) => setFaq((f) => ({ ...f, question: e.target.value })), required: true, placeholder: "What is your return policy?" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1", children: "Category" }),
            /* @__PURE__ */ jsx("select", { className: inp + " bg-white", value: faq.category, onChange: (e) => setFaq((f) => ({ ...f, category: e.target.value })), children: ["general", "orders", "shipping", "returns", "payment", "products"].map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1", children: "Answer *" }),
          /* @__PURE__ */ jsx("textarea", { className: "w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[var(--color-primary)] resize-none", rows: 3, value: faq.answer, onChange: (e) => setFaq((f) => ({ ...f, answer: e.target.value })), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1", children: "Keywords (comma separated)" }),
          /* @__PURE__ */ jsx("input", { className: inp, value: faq.keywords, onChange: (e) => setFaq((f) => ({ ...f, keywords: e.target.value })), placeholder: "return, refund, exchange" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "h-9 px-5 rounded-xl font-bold text-[13px] border-none cursor-pointer", style: { background: "var(--color-primary)", color: "var(--color-primary-text)" }, children: "Save FAQ" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFaqForm(false), className: "h-9 px-4 rounded-xl font-bold border border-gray-200 text-gray-600 bg-white cursor-pointer", children: "Cancel" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "divide-y divide-gray-50", children: [
        faqs.map((f) => /* @__PURE__ */ jsxs("div", { className: "p-5 hover:bg-gray-50 flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500", children: f.category }) }),
            /* @__PURE__ */ jsxs("p", { className: "font-bold text-[13.5px] text-gray-800 mb-1", children: [
              "Q: ",
              f.question
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-gray-500", children: [
              f.answer.slice(0, 120),
              f.answer.length > 120 ? "..." : ""
            ] }),
            f.keywords && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400 mt-1", children: [
              "Keywords: ",
              typeof f.keywords === "string" ? f.keywords : JSON.stringify(f.keywords)
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            if (confirm("Delete this FAQ?")) router3.delete(`${ap}/chat/faqs/${f.id}`, { preserveScroll: true });
          }, className: "w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 cursor-pointer bg-white flex-shrink-0", children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) })
        ] }, f.id)),
        faqs.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center text-gray-400", children: [
          /* @__PURE__ */ jsx(IconRobot, { size: 40, className: "mx-auto mb-3 opacity-20" }),
          /* @__PURE__ */ jsx("p", { className: "font-bold", children: "No FAQs yet — add some so the bot can answer questions" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ChatAdmin as default
};
