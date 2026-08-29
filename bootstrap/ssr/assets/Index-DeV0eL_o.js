import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, a as useForm } from "../ssr.js";
import { useState } from "react";
import { IconPlus, IconChevronDown, IconChevronRight, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-ClODoR4t.js";
import { D as DualImageUpload } from "./ImageUpload-zHhWKIfi.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const CAT_IMAGE_DESKTOP = { w: 900, h: 1080, label: "Category Image (Desktop)", hint: "Nearly square — shown as a square card on desktop grid" };
const CAT_IMAGE_MOBILE = { w: 600, h: 600, label: "Category Image (Mobile)", hint: "Square — shown as a 3:4 portrait card on mobile scroll" };
const CAT_BANNER_DESKTOP = { w: 1920, h: 380, label: "Category Banner (Desktop)", hint: "Wide landscape — shown between product sections on desktop" };
const CAT_BANNER_MOBILE = { w: 900, h: 540, label: "Category Banner (Mobile)", hint: "Landscape 5:3 — shown on mobile. Falls back to desktop banner if not set" };
function CatForm({ cat, allCategories, onClose }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing, errors } = useForm({
    _method: cat ? "PUT" : "POST",
    name: (cat == null ? void 0 : cat.name) ?? "",
    slug: (cat == null ? void 0 : cat.slug) ?? "",
    description: (cat == null ? void 0 : cat.description) ?? "",
    parent_id: (cat == null ? void 0 : cat.parent_id) ?? "",
    sort_order: (cat == null ? void 0 : cat.sort_order) ?? 0,
    nav_order: (cat == null ? void 0 : cat.nav_order) ?? 0,
    is_active: (cat == null ? void 0 : cat.is_active) ?? true,
    show_in_nav: (cat == null ? void 0 : cat.show_in_nav) ?? true,
    color: (cat == null ? void 0 : cat.color) ?? "",
    icon: (cat == null ? void 0 : cat.icon) ?? "",
    image: null,
    mobile_image: null,
    banner_image: null,
    mobile_banner_image: null
  });
  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function submit(e) {
    e.preventDefault();
    const url = cat ? `${ap}/categories/${cat.id}` : `${ap}/categories`;
    post(url, { onSuccess: onClose, forceFormData: true });
  }
  const topLevel = allCategories.filter((c) => !c.parent_id && c.id !== (cat == null ? void 0 : cat.id));
  const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white";
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[17px]", children: cat ? `Edit: ${cat.name}` : "Add New Category" }),
        /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mt-0.5", children: "Fill in the details below" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "border-none bg-transparent cursor-pointer text-gray-400 hover:text-gray-700", children: /* @__PURE__ */ jsx(IconX, { size: 22 }) })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Category Name *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.name,
              required: true,
              placeholder: "e.g. Men, Women, Electronics…",
              onChange: (e) => {
                setData("name", e.target.value);
                if (!cat) setData("slug", slugify(e.target.value));
              },
              className: inputCls
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "URL Slug *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.slug,
              required: true,
              placeholder: "men, women, electronics",
              onChange: (e) => setData("slug", e.target.value),
              className: `${inputCls} font-mono text-[12.5px]`
            }
          ),
          errors.slug && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-red-500 mt-1", children: errors.slug })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border-2 border-blue-200 bg-blue-50", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-bold text-blue-800 mb-1", children: "Parent Category" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-blue-600 mb-3", children: [
          "Keep as ",
          /* @__PURE__ */ jsx("strong", { children: "Top Level" }),
          " for main menu items (Men, Women…). Pick a parent to make this a ",
          /* @__PURE__ */ jsx("strong", { children: "dropdown sub-item" }),
          ' (e.g. "Shirts" under "Men").'
        ] }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: data.parent_id,
            onChange: (e) => setData("parent_id", e.target.value || ""),
            className: "w-full h-11 px-4 border-2 border-blue-300 rounded-xl text-[13.5px] outline-none focus:border-blue-500 bg-white font-semibold",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "⬛ Top Level — appears in main navigation" }),
              topLevel.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
                '↳ Under "',
                c.name,
                '" (sub-category)'
              ] }, c.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: [
          "Description ",
          /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-normal", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            rows: 2,
            placeholder: "Short description shown on the category banner",
            className: "w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none transition-colors"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Icon Emoji" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: data.icon,
              onChange: (e) => setData("icon", e.target.value),
              placeholder: "👗  👔  📱  🏠  🧒",
              className: inputCls + " text-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Badge Color" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                value: data.color || "#00c8ff",
                onChange: (e) => setData("color", e.target.value),
                className: "w-11 h-11 rounded-xl border-2 border-gray-200 cursor-pointer p-1 bg-white"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: data.color,
                onChange: (e) => setData("color", e.target.value),
                placeholder: "#00c8ff",
                className: `${inputCls} font-mono`
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: "Position in Menu" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mb-2", children: "1 = first, 2 = second, 3 = third…" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: data.nav_order,
              min: "1",
              onChange: (e) => {
                setData("nav_order", +e.target.value);
                setData("sort_order", +e.target.value);
              },
              className: inputCls,
              placeholder: "1"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 pt-6", children: [
          { key: "is_active", label: "Active", hint: "Visible in shop" },
          { key: "show_in_nav", label: "Show in Menu", hint: "Appears in navigation" }
        ].map((t) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setData(t.key, !data[t.key]),
              className: `relative w-11 h-6 rounded-full border-none cursor-pointer transition-all flex-shrink-0 ${data[t.key] ? "bg-[var(--color-primary)]" : "bg-gray-300"}`,
              children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data[t.key] ? "left-5" : "left-0.5"}` })
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold text-gray-800", children: t.label }),
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400", children: t.hint })
          ] })
        ] }, t.key)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          DualImageUpload,
          {
            label: "Category Card Image",
            desktopSpec: CAT_IMAGE_DESKTOP,
            mobileSpec: CAT_IMAGE_MOBILE,
            currentDesktop: cat == null ? void 0 : cat.image,
            currentMobile: cat == null ? void 0 : cat.mobile_image,
            onDesktopFile: (f) => setData("image", f),
            onMobileFile: (f) => setData("mobile_image", f)
          }
        ),
        /* @__PURE__ */ jsx(
          DualImageUpload,
          {
            label: "Category Banner",
            desktopSpec: CAT_BANNER_DESKTOP,
            mobileSpec: CAT_BANNER_MOBILE,
            currentDesktop: cat == null ? void 0 : cat.banner_image,
            currentMobile: cat == null ? void 0 : cat.mobile_banner_image,
            onDesktopFile: (f) => setData("banner_image", f),
            onMobileFile: (f) => setData("mobile_banner_image", f)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "flex-1 h-12 font-black text-[14px] rounded-xl border-none cursor-pointer disabled:opacity-60 transition-all hover:opacity-90",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: processing ? "Saving…" : cat ? "✓ Update Category" : "+ Create Category"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold text-[13px] rounded-xl bg-white cursor-pointer hover:border-gray-300 transition-colors",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function CatRow({ cat, depth, allCategories, onEdit, onDelete }) {
  var _a;
  const [open, setOpen] = useState(true);
  const hasChildren = (((_a = cat.children) == null ? void 0 : _a.length) ?? 0) > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("tr", { className: `border-b border-gray-50 hover:bg-gray-50/50 transition-colors group ${depth > 0 ? "bg-blue-50/20" : ""}`, children: [
      /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", style: { paddingLeft: depth * 28 }, children: [
        hasChildren ? /* @__PURE__ */ jsx("button", { onClick: () => setOpen(!open), className: "w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] border-none bg-transparent cursor-pointer", children: open ? /* @__PURE__ */ jsx(IconChevronDown, { size: 13 }) : /* @__PURE__ */ jsx(IconChevronRight, { size: 13 }) }) : depth > 0 ? /* @__PURE__ */ jsx("span", { className: "w-5 text-gray-300 text-[11px]", children: "└" }) : /* @__PURE__ */ jsx("span", { className: "w-5" }),
        cat.image ? /* @__PURE__ */ jsx("img", { src: cat.image, className: "w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-100", alt: "" }) : /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 border border-gray-100",
            style: { background: (cat.color ?? "var(--color-primary)") + "22" },
            children: cat.icon || cat.name[0]
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13.5px] text-gray-900", children: cat.name }),
          /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400 font-mono", children: cat.slug })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: depth === 0 ? /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200", children: "Main Menu" }) : /* @__PURE__ */ jsx("span", { className: "text-[11px] text-gray-400 pl-1", children: "└ Dropdown item" }) }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-3 text-[12.5px] text-gray-500", children: cat.products_count ?? 0 }),
      /* @__PURE__ */ jsxs("td", { className: "px-5 py-3 text-[12.5px] text-gray-500", children: [
        "#",
        cat.nav_order || cat.sort_order
      ] }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: `text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${cat.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`, children: cat.is_active ? "Active" : "Hidden" }),
        cat.show_in_nav && /* @__PURE__ */ jsx("span", { className: "text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200", children: "In Menu" })
      ] }) }),
      /* @__PURE__ */ jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 ", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => onEdit(cat), className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all", title: "Edit", children: /* @__PURE__ */ jsx(IconPencil, { size: 14 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(cat), className: "w-8 h-8 rounded-lg border border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 bg-white cursor-pointer transition-all", title: "Delete", children: /* @__PURE__ */ jsx(IconTrash, { size: 14 }) })
      ] }) })
    ] }),
    open && hasChildren && cat.children.map((child) => /* @__PURE__ */ jsx(CatRow, { cat: child, depth: depth + 1, allCategories, onEdit, onDelete }, child.id))
  ] });
}
function CategoriesIndex({ categories, allCategories }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const [editing, setEditing] = useState(null);
  function del(cat) {
    var _a;
    if (!confirm(`Delete "${cat.name}"?${(((_a = cat.children) == null ? void 0 : _a.length) ?? 0) > 0 ? "\n\nSub-items will be moved to top level." : ""}`)) return;
    router3.delete(`${ap}/categories/${cat.id}`, { preserveScroll: true });
  }
  const total = (cats) => cats.reduce((n, c) => n + 1 + total(c.children ?? []), 0);
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Categories & Menu", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Categories — Admin" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-xl text-[13px] text-blue-800", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold mb-1", children: "📋 Main Menu Items" }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px]", children: "Top Level categories appear in the navigation bar at the top of your store." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-purple-50 border border-purple-200 rounded-xl text-[13px] text-purple-800", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold mb-1", children: "↳ Dropdown Sub-items" }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px]", children: "Sub-categories appear as dropdowns when hovering a main menu item." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-green-50 border border-green-200 rounded-xl text-[13px] text-green-800", children: [
        /* @__PURE__ */ jsx("div", { className: "font-bold mb-1", children: "🖼️ Category Banner" }),
        /* @__PURE__ */ jsx("div", { className: "text-[12px]", children: "Upload a banner image to each category — it shows between product sections on the homepage." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-gray-500", children: [
        total(categories),
        " categories"
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setEditing("new"),
          className: "flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl border-none cursor-pointer",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
          children: [
            /* @__PURE__ */ jsx(IconPlus, { size: 17 }),
            " Add Category"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[700px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-gray-50 border-b border-gray-100", children: ["Category Name", "Menu Level", "Products", "Position", "Status", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-5 py-3.5", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: categories.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-5 py-16 text-center text-gray-400 text-[13px]", children: 'No categories yet. Click "Add Category" to create your first.' }) }) : categories.map((cat) => /* @__PURE__ */ jsx(CatRow, { cat, depth: 0, allCategories, onEdit: setEditing, onDelete: del }, cat.id)) })
    ] }) }) }),
    editing && /* @__PURE__ */ jsx(CatForm, { cat: editing === "new" ? void 0 : editing, allCategories, onClose: () => setEditing(null) })
  ] });
}
export {
  CategoriesIndex as default
};
