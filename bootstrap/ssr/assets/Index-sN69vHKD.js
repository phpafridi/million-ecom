import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { H as Head_default, r as router3 } from "../ssr.js";
import { A as AdminLayout } from "./AdminLayout-MgAg6rU1.js";
import { C as ConfirmDeleteModal } from "./ConfirmDeleteModal-upZ6GLRW.js";
import { useState } from "react";
import { IconRefresh, IconPlus, IconDatabase, IconDownload, IconTrash } from "@tabler/icons-react";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
function BackupIndex({ backups, disk_free, db_size }) {
  const [creating, setCreating] = useState(false);
  const [notes, setNotes] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  function create() {
    setCreating(true);
    router3.post(window.location.pathname, { notes }, {
      onFinish: () => setCreating(false),
      preserveScroll: true
    });
  }
  function deleteBackup(id, filename) {
    setPendingDelete({ id, filename });
  }
  function confirmDelete() {
    if (!pendingDelete) return;
    router3.delete(`${window.location.pathname}/${pendingDelete.id}`, { preserveScroll: true, onFinish: () => setPendingDelete(null) });
  }
  const statusColor = (s) => s === "completed" ? "#059669" : s === "failed" ? "#DC2626" : "#D97706";
  const statusBg = (s) => s === "completed" ? "#F0FDF4" : s === "failed" ? "#FEF2F2" : "#FFFBEB";
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Database Backup", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Database Backup" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-5 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[22px] font-black text-gray-800", children: backups.length }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-500", children: "Total Backups" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-5 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[22px] font-black", style: { color: "var(--color-primary,#C9A84C)" }, children: db_size }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-500", children: "Database Size" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-5 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[22px] font-black text-green-600", children: disk_free }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-500", children: "Disk Free" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 p-5 mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800 mb-3", children: "Create New Backup" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[var(--color-primary,#C9A84C)]",
            placeholder: "Optional note (e.g. Before product import)",
            value: notes,
            onChange: (e) => setNotes(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: create,
            disabled: creating,
            className: "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] border-none cursor-pointer disabled:opacity-60 transition-all",
            style: { background: "var(--color-primary,#C9A84C)", color: "var(--color-primary-text,#0a0a0a)" },
            children: creating ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(IconRefresh, { size: 15, className: "animate-spin" }),
              " Creating…"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(IconPlus, { size: 15 }),
              " Create Backup"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-gray-400 mt-2", children: [
        "Backup is saved to ",
        /* @__PURE__ */ jsx("code", { children: "storage/app/backups/" }),
        " on your server. Download immediately after creation and store offsite."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-black text-[15px] text-gray-800", children: "Backup History" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[12px] text-gray-400", children: [
          backups.length,
          " backup",
          backups.length !== 1 ? "s" : ""
        ] })
      ] }),
      backups.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
        /* @__PURE__ */ jsx(IconDatabase, { size: 40, className: "mx-auto mb-3 text-gray-300" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-[14px]", children: "No backups yet. Create your first backup above." })
      ] }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-[13px]", children: [
        /* @__PURE__ */ jsx("thead", { style: { background: "#0a0a0a" }, children: /* @__PURE__ */ jsx("tr", { children: ["Filename", "Size", "Status", "Created By", "Notes", "Date", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider", style: { color: "#C9A84C" }, children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: backups.map((b) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-[11px] text-gray-700", children: b.filename }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: b.size }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-2 py-0.5 rounded-full text-[10px] font-bold",
              style: { background: statusBg(b.status), color: statusColor(b.status) },
              children: b.status
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-600", children: b.created_by }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-gray-400 max-w-[120px] truncate", children: b.notes ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap", children: b.created_at }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            b.status === "completed" && /* @__PURE__ */ jsxs(
              "a",
              {
                href: b.download_url,
                className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold no-underline",
                style: { background: "#F0FDF4", color: "#059669" },
                children: [
                  /* @__PURE__ */ jsx(IconDownload, { size: 12 }),
                  " Download"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => deleteBackup(b.id, b.filename),
                className: "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer",
                style: { background: "#FEF2F2", color: "#DC2626" },
                children: [
                  /* @__PURE__ */ jsx(IconTrash, { size: 12 }),
                  " Delete"
                ]
              }
            )
          ] }) })
        ] }, b.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700", children: [
      /* @__PURE__ */ jsx("strong", { children: "⚠️ Important:" }),
      " Backups are stored on your server. For safety, always download and store copies on Google Drive, Dropbox, or an external drive. Server backups can be lost if the server crashes. Schedule weekly backups minimum, daily before any major changes."
    ] }),
    /* @__PURE__ */ jsx(
      ConfirmDeleteModal,
      {
        open: !!pendingDelete,
        title: "Delete this backup? It cannot be recovered.",
        itemName: pendingDelete == null ? void 0 : pendingDelete.filename,
        requireTypedConfirmation: pendingDelete == null ? void 0 : pendingDelete.filename,
        onConfirm: confirmDelete,
        onCancel: () => setPendingDelete(null)
      }
    )
  ] });
}
export {
  BackupIndex as default
};
