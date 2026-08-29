import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, H as Head_default, r as router3, L as Link_default } from "../ssr.js";
import { useState, useRef } from "react";
import { IconSearch, IconDownload, IconUpload, IconPlus, IconPackage, IconCheck, IconEye, IconEyeOff, IconStar, IconPencil, IconTrash } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-ClODoR4t.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
function StockEditor({ product, ap }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(product.stock));
  function save() {
    const qty = parseInt(val);
    if (isNaN(qty) || qty < 0) {
      setEditing(false);
      return;
    }
    router3.patch(`${ap}/products/${product.id}/stock`, { stock: qty }, { preserveScroll: true, onSuccess: () => setEditing(false) });
  }
  if (editing) return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        value: val,
        onChange: (e) => setVal(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") setEditing(false);
        },
        onBlur: save,
        autoFocus: true,
        className: "w-16 h-7 px-2 border-2 rounded-lg text-[12.5px] outline-none font-mono",
        style: { borderColor: "var(--color-primary)" }
      }
    ),
    /* @__PURE__ */ jsx("button", { onClick: save, className: "h-7 px-2 text-[11px] font-bold text-white rounded-lg border-none cursor-pointer", style: { background: "var(--color-primary)" }, children: "✓" }),
    /* @__PURE__ */ jsx("button", { onClick: () => setEditing(false), className: "h-7 px-2 text-[11px] text-gray-500 border border-gray-200 rounded-lg bg-white cursor-pointer", children: "✕" })
  ] });
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => {
        setVal(String(product.stock));
        setEditing(true);
      },
      title: "Click to edit",
      className: `text-[12.5px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:border-[var(--color-primary)] bg-white
                ${product.stock === 0 ? "bg-red-50 text-red-600 border-red-200" : product.stock <= 5 ? "bg-amber-50 text-amber-700 border-amber-200" : "text-gray-700 border-gray-200"}`,
      children: product.stock
    }
  );
}
function ProductsIndex({ products, categories, filters }) {
  const { props } = usePage();
  const ap = `/${props.adminPath ?? "ml-admin"}`;
  const [search, setSearch] = useState(filters.q ?? "");
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("activate");
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const fileRef = useRef(null);
  const fmt = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;
  const allIds = products.data.map((p) => p.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  function toggleAll() {
    setSelected(allSelected ? [] : allIds);
  }
  function toggleOne(id) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }
  function doBulk() {
    if (selected.length === 0) return;
    if (bulkAction === "delete" && !confirm(`Delete ${selected.length} products? Cannot be undone.`)) return;
    router3.post(`${ap}/products/bulk`, { action: bulkAction, product_ids: selected }, { onSuccess: () => setSelected([]) });
  }
  function doImport(e) {
    e.preventDefault();
    if (!importFile) return;
    const form = new FormData();
    form.append("csv", importFile);
    router3.post(`${ap}/products/import`, form, { forceFormData: true, onSuccess: () => {
      setShowImport(false);
      setImportFile(null);
    } });
  }
  function del(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    router3.delete(`${ap}/products/${id}`);
  }
  function toggleActive(id, val) {
    router3.patch(`${ap}/products/${id}`, { is_active: val }, { preserveScroll: true, preserveState: true });
  }
  function toggleFeatured(id, val) {
    router3.patch(`${ap}/products/${id}`, { is_featured: val }, { preserveScroll: true, preserveState: true });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: "Products", children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Products" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            router3.get(`${ap}/products`, { q: search, category: filters.category });
          },
          className: "flex flex-1 min-w-[200px] max-w-sm bg-white border border-gray-200 rounded-xl overflow-hidden h-10 focus-within:border-[var(--color-primary)] transition-colors",
          children: [
            /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search products…", className: "flex-1 px-4 text-[13px] outline-none border-none" }),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 border-none bg-transparent cursor-pointer", style: { color: "var(--color-primary)" }, children: /* @__PURE__ */ jsx(IconSearch, { size: 17 }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: filters.category ?? "",
          onChange: (e) => router3.get(`${ap}/products`, { q: filters.q, category: e.target.value || void 0 }),
          className: "h-10 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white focus:border-[var(--color-primary)]",
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "All Categories" }),
            categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.slug, children: c.name }, c.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `${ap}/products/export`,
            className: "flex items-center gap-1.5 h-10 px-4 border border-gray-200 rounded-xl text-[12.5px] font-semibold text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] no-underline bg-white transition-colors",
            children: [
              /* @__PURE__ */ jsx(IconDownload, { size: 15 }),
              " Export CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setShowImport(!showImport),
            className: "flex items-center gap-1.5 h-10 px-4 border border-gray-200 rounded-xl text-[12.5px] font-semibold text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-white cursor-pointer transition-colors",
            children: [
              /* @__PURE__ */ jsx(IconUpload, { size: 15 }),
              " Import CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Link_default,
          {
            href: `${ap}/orders/create`,
            className: "flex items-center gap-1.5 h-10 px-4 border-2 rounded-xl text-[12.5px] font-bold no-underline transition-colors",
            style: { borderColor: "var(--color-primary)", color: "var(--color-primary)" },
            children: "+ Manual Order"
          }
        ),
        /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: `${ap}/products/create`,
            className: "flex items-center gap-2 font-black text-[13px] px-5 h-10 rounded-xl no-underline border-none",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconPlus, { size: 17 }),
              " Add Product"
            ]
          }
        )
      ] })
    ] }),
    showImport && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-[14px] text-blue-800 mb-2", children: "Import Products from CSV" }),
      /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-blue-600 mb-3", children: [
        "CSV format: ",
        /* @__PURE__ */ jsx("code", { className: "bg-white px-1 rounded text-[11px]", children: "ID, Name, Slug, Category, Price, Compare Price, Stock, Featured (0/1), Description" }),
        /* @__PURE__ */ jsx("a", { href: `${ap}/products/export`, className: "ml-2 underline", children: "Download current products as template" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: doImport, className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            ref: fileRef,
            accept: ".csv,.txt",
            className: "hidden",
            onChange: (e) => {
              var _a;
              return setImportFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              var _a;
              return (_a = fileRef.current) == null ? void 0 : _a.click();
            },
            className: "h-9 px-4 border border-gray-300 rounded-xl text-[13px] font-semibold bg-white cursor-pointer hover:border-blue-400",
            children: importFile ? importFile.name : "Choose CSV file"
          }
        ),
        importFile && /* @__PURE__ */ jsx("button", { type: "submit", className: "h-9 px-5 rounded-xl text-[13px] font-bold border-none cursor-pointer text-white", style: { background: "var(--color-primary)" }, children: "Import Now" })
      ] })
    ] }),
    selected.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3.5 bg-[var(--color-primary)]15 border border-[var(--color-primary)]30 rounded-xl flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-[13px] font-bold", style: { color: "var(--color-primary)" }, children: [
        selected.length,
        " product",
        selected.length > 1 ? "s" : "",
        " selected"
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: bulkAction,
          onChange: (e) => setBulkAction(e.target.value),
          className: "h-9 px-3 border border-gray-200 rounded-xl text-[13px] outline-none bg-white",
          children: [
            /* @__PURE__ */ jsx("option", { value: "activate", children: "Activate" }),
            /* @__PURE__ */ jsx("option", { value: "deactivate", children: "Deactivate" }),
            /* @__PURE__ */ jsx("option", { value: "delete", children: "Delete" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("button", { onClick: doBulk, className: "h-9 px-5 rounded-xl text-[13px] font-bold border-none cursor-pointer text-white", style: { background: "var(--color-primary)" }, children: [
        "Apply to ",
        selected.length
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setSelected([]), className: "h-9 px-4 rounded-xl text-[13px] font-semibold text-gray-600 border border-gray-200 bg-white cursor-pointer", children: "Clear" })
    ] }),
    products.data.some((p) => p.stock <= 5 && p.is_active) && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-[12.5px] text-amber-800 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(IconPackage, { size: 16, className: "text-amber-600 flex-shrink-0" }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Low stock:" }),
        " ",
        products.data.filter((p) => p.stock <= 5).length,
        " product(s) running low. Click stock number to update."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-5 py-3.5 border-b border-gray-100 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[13px] font-semibold text-gray-700", children: [
          products.total,
          " products"
        ] }),
        products.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 ml-auto", children: [
          products.current_page > 1 && /* @__PURE__ */ jsx("button", { onClick: () => router3.get(`${ap}/products`, { ...filters, page: products.current_page - 1 }), className: "h-8 px-3 text-[12px] border border-gray-200 rounded-lg bg-white cursor-pointer", children: "← Prev" }),
          /* @__PURE__ */ jsxs("span", { className: "h-8 px-3 flex items-center text-[12px] text-gray-500", children: [
            products.current_page,
            "/",
            products.last_page
          ] }),
          products.current_page < products.last_page && /* @__PURE__ */ jsx("button", { onClick: () => router3.get(`${ap}/products`, { ...filters, page: products.current_page + 1 }), className: "h-8 px-3 text-[12px] border border-gray-200 rounded-lg bg-white cursor-pointer", children: "Next →" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[820px]", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-50 border-b border-gray-100", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3.5 w-10", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleAll,
              className: `w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all border-none ${allSelected ? "text-white" : "border-gray-300 bg-white"}`,
              style: allSelected ? { background: "var(--color-primary)" } : {},
              children: allSelected && /* @__PURE__ */ jsx(IconCheck, { size: 12 })
            }
          ) }),
          ["Product", "Category", "Price", "Stock", "Sold", "Status", ""].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left text-[11px] font-black text-gray-400 uppercase tracking-wider px-4 py-3.5", children: h }, h))
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          products.data.map((p) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i;
            return /* @__PURE__ */ jsxs("tr", { className: `border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group ${selected.includes(p.id) ? "bg-blue-50/30" : ""}`, children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleOne(p.id),
                  className: `w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all border-none ${selected.includes(p.id) ? "text-white" : "border-gray-300 bg-white"}`,
                  style: selected.includes(p.id) ? { background: "var(--color-primary)" } : {},
                  children: selected.includes(p.id) && /* @__PURE__ */ jsx(IconCheck, { size: 12 })
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                ((_b = (_a = p.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url) || ((_d = (_c = p.product_images) == null ? void 0 : _c[0]) == null ? void 0 : _d.url) ? /* @__PURE__ */ jsx("img", { src: ((_f = (_e = p.images) == null ? void 0 : _e[0]) == null ? void 0 : _f.url) ?? ((_h = (_g = p.product_images) == null ? void 0 : _g[0]) == null ? void 0 : _h.url) ?? "", className: "w-10 h-10 rounded-[10px] object-cover border border-gray-100 flex-shrink-0 bg-gray-50", alt: "" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-[10px] bg-gray-100 flex-shrink-0" }),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-[13px] text-gray-900 truncate max-w-[180px]", children: p.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400 font-mono truncate max-w-[180px]", children: p.slug })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-[12.5px] text-gray-600", children: ((_i = p.category) == null ? void 0 : _i.name) ?? "—" }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("div", { className: "font-bold text-[13px]", style: { color: "var(--color-dark-bg)" }, children: fmt(p.price) }),
                p.compare_price > p.price && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-gray-400 line-through", children: fmt(p.compare_price) })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(StockEditor, { product: p, ap }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-[12px] text-gray-500", children: p.stock_sold ?? 0 }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => toggleActive(p.id, !p.is_active),
                    title: p.is_active ? "Deactivate" : "Activate",
                    className: `w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${p.is_active ? "bg-green-50 border-green-200 text-green-500" : "bg-gray-100 border-gray-200 text-gray-400"}`,
                    children: p.is_active ? /* @__PURE__ */ jsx(IconEye, { size: 13 }) : /* @__PURE__ */ jsx(IconEyeOff, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => toggleFeatured(p.id, !p.is_featured),
                    title: p.is_featured ? "Unfeature" : "Feature",
                    className: `w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${p.is_featured ? "bg-amber-50 border-amber-200 text-amber-500" : "bg-gray-100 border-gray-200 text-gray-400"}`,
                    children: /* @__PURE__ */ jsx(IconStar, { size: 13 })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 ", children: [
                /* @__PURE__ */ jsx(
                  Link_default,
                  {
                    href: `${ap}/products/${p.id}/edit`,
                    className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 no-underline hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all",
                    children: /* @__PURE__ */ jsx(IconPencil, { size: 14 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => del(p.id, p.name),
                    className: "w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 bg-white cursor-pointer hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-all",
                    children: /* @__PURE__ */ jsx(IconTrash, { size: 14 })
                  }
                )
              ] }) })
            ] }, p.id);
          }),
          products.data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 8, className: "px-5 py-16 text-center", children: [
            /* @__PURE__ */ jsx(IconPackage, { size: 36, className: "text-gray-300 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-[13px]", children: "No products found" })
          ] }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  ProductsIndex as default
};
