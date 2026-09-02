import { jsxs, jsx } from "react/jsx-runtime";
import { u as usePage, a as useForm, H as Head_default, L as Link_default, r as router3 } from "../ssr.js";
import { useState } from "react";
import { IconArrowLeft, IconUpload, IconCheck } from "@tabler/icons-react";
import { A as AdminLayout } from "./AdminLayout-DNtREoCY.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
const inputCls = "w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] transition-colors bg-white";
function Field({ label, hint, error, children }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[13px] font-semibold text-gray-700 mb-1", children: label }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mb-1.5", children: hint }),
    children,
    error && /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-red-500 mt-1", children: [
      "⚠ ",
      error
    ] })
  ] });
}
function VariantBuilder({ productId }) {
  var _a, _b;
  const [attrs, setAttrs] = useState([{ name: "", is_required: false, display_type: "button", values: [{ value: "", color_hex: "" }] }]);
  const [saving, setSaving] = useState(false);
  const { props: pp } = usePage();
  const ap = `/${pp.adminPath ?? "ml-admin"}`;
  const [trackStock, setTrackStock] = useState(((_a = pp.product) == null ? void 0 : _a.track_variant_stock) ?? true);
  useState(() => {
    var _a2;
    const existing = (_a2 = pp.product) == null ? void 0 : _a2.variant_attributes;
    if (existing == null ? void 0 : existing.length) {
      setAttrs(existing.map((a) => {
        var _a3;
        return {
          name: a.name,
          is_required: a.is_required ?? false,
          display_type: a.display_type ?? "button",
          values: ((_a3 = a.values) == null ? void 0 : _a3.map((v) => ({ value: v.value, color_hex: v.color_hex ?? "" }))) ?? [{ value: "", color_hex: "" }]
        };
      }));
    }
  });
  const upd = (fn) => setAttrs(fn);
  function addAttr() {
    upd((a) => [...a, { name: "", is_required: false, display_type: "button", values: [{ value: "", color_hex: "" }] }]);
  }
  function remAttr(i) {
    upd((a) => a.filter((_, idx) => idx !== i));
  }
  function setName(i, name) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, name } : x));
  }
  function setRequired(i, v) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, is_required: v } : x));
  }
  function setDisplay(i, v) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, display_type: v } : x));
  }
  function addVal(i) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, values: [...x.values, { value: "", color_hex: "" }] } : x));
  }
  function setVal(i, j, val) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, values: x.values.map((v, jdx) => jdx === j ? { ...v, value: val } : v) } : x));
  }
  function setColor(i, j, hex) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, values: x.values.map((v, jdx) => jdx === j ? { ...v, color_hex: hex } : v) } : x));
  }
  function remVal(i, j) {
    upd((a) => a.map((x, idx) => idx === i ? { ...x, values: x.values.filter((_, jdx) => jdx !== j) } : x));
  }
  function save() {
    if (!productId) return;
    setSaving(true);
    router3.post(`${ap}/products/${productId}/variants`, { attributes: attrs, track_variant_stock: trackStock }, { onFinish: () => setSaving(false) });
  }
  const inp = "h-9 px-3 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[var(--color-primary)] bg-white";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    attrs.map((attr, i) => /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3 flex-wrap", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: attr.name,
            onChange: (e) => setName(i, e.target.value),
            placeholder: "Option name (e.g. Size, Color, Material)",
            className: inp + " flex-1 min-w-[140px]"
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: attr.display_type,
            onChange: (e) => setDisplay(i, e.target.value),
            className: inp + " w-32",
            children: [
              /* @__PURE__ */ jsx("option", { value: "button", children: "Buttons" }),
              /* @__PURE__ */ jsx("option", { value: "color", children: "Color Swatches" }),
              /* @__PURE__ */ jsx("option", { value: "dropdown", children: "Dropdown" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded-lg px-3 h-9 text-[12.5px] font-semibold text-gray-700 select-none", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: attr.is_required, onChange: (e) => setRequired(i, e.target.checked), className: "w-4 h-4 accent-[var(--color-primary)]" }),
          /* @__PURE__ */ jsx("span", { children: "Required" }),
          attr.is_required && /* @__PURE__ */ jsx("span", { className: "text-red-500 font-black", children: "*" })
        ] }),
        attrs.length > 1 && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => remAttr(i), className: "w-9 h-9 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 bg-white cursor-pointer flex items-center justify-center font-bold text-lg border-solid", children: "×" })
      ] }),
      attr.is_required && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-500 font-semibold mb-2", children: "⚠️ Customers MUST select this option before adding to cart" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        attr.values.map((val, j) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1.5", children: [
          attr.display_type === "color" && /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              value: val.color_hex || "#000000",
              onChange: (e) => setColor(i, j, e.target.value),
              className: "w-7 h-7 rounded-full border-none cursor-pointer p-0.5",
              title: "Pick color"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: val.value,
              onChange: (e) => setVal(i, j, e.target.value),
              placeholder: attr.display_type === "color" ? "Red" : attr.name === "Size" ? "M" : "Value",
              className: "h-7 w-20 px-2 border border-gray-200 rounded text-[12.5px] outline-none focus:border-[var(--color-primary)] bg-white"
            }
          ),
          attr.values.length > 1 && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => remVal(i, j), className: "text-gray-400 hover:text-red-500 border-none bg-transparent cursor-pointer text-base leading-none", children: "×" })
        ] }, j)),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => addVal(i),
            className: "h-9 px-3 border border-dashed border-gray-300 rounded-lg text-[12px] text-gray-500 hover:border-[var(--color-primary)] cursor-pointer bg-white",
            children: "+ Add"
          }
        )
      ] }),
      attr.values.some((v) => v.value) && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-gray-200", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wide", children: "Preview on product page:" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: attr.values.filter((v) => v.value).map((v, j) => attr.display_type === "color" ? /* @__PURE__ */ jsx("div", { title: v.value, style: { width: 32, height: 32, borderRadius: "50%", background: v.color_hex || "#ccc", border: "2px solid #e5e7eb", cursor: "default" } }, j) : /* @__PURE__ */ jsx("span", { style: { padding: "5px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 12.5, fontWeight: 600, background: "white", color: "#374151" }, children: v.value }, j)) })
      ] })
    ] }, i)),
    /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-2.5 p-3.5 bg-gray-50 rounded-xl cursor-pointer mb-1", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: trackStock,
          onChange: (e) => setTrackStock(e.target.checked),
          className: "w-4 h-4 mt-0.5 accent-[var(--color-primary)]"
        }
      ),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: "block text-[13px] font-semibold text-gray-800", children: "Track stock separately for each combination" }),
        /* @__PURE__ */ jsx("span", { className: "block text-[11.5px] text-gray-500 mt-0.5", children: trackStock ? "On — each color/size has its own stock number, set individually below after saving." : "Off — Color/Size are shown to customers as options only. Stock is tracked once on the product itself (the Stock field above), the same for every combination." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: addAttr,
          className: "h-9 px-4 border-2 border-dashed border-gray-300 rounded-xl text-[12.5px] font-semibold text-gray-600 hover:border-[var(--color-primary)] cursor-pointer bg-white",
          children: "+ Add Attribute (Size / Color / Material…)"
        }
      ),
      productId && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: save,
          disabled: saving,
          className: "h-9 px-6 rounded-xl text-[13px] font-bold border-none cursor-pointer disabled:opacity-60",
          style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
          children: saving ? "Saving…" : "✓ Save Variants"
        }
      )
    ] }),
    !productId && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-amber-600 mt-2", children: "💡 Save the product first, then add variants here." }),
    productId && trackStock && /* @__PURE__ */ jsx(VariantStockTable, { productId, variants: ((_b = pp.product) == null ? void 0 : _b.variants) ?? [], ap })
  ] });
}
function VariantStockTable({ productId, variants, ap }) {
  const [rows, setRows] = useState({});
  const [saving, setSaving] = useState(false);
  useState(() => {
    const init = {};
    for (const v of variants) {
      init[v.id] = { stock: String(v.stock ?? 0), price: v.price != null ? String(v.price) : "", compare_price: v.compare_price != null ? String(v.compare_price) : "", sku: v.sku ?? "" };
    }
    setRows(init);
  });
  if (!variants.length) return null;
  function label(v) {
    return (v.variant_values ?? v.variantValues ?? []).map((vv) => vv.value).join(" / ") || `Variant #${v.id}`;
  }
  function set(id, field, val) {
    setRows((r) => ({ ...r, [id]: { ...r[id], [field]: val } }));
  }
  function save() {
    setSaving(true);
    const payload = variants.map((v) => {
      var _a, _b, _c, _d;
      return {
        id: v.id,
        stock: Number(((_a = rows[v.id]) == null ? void 0 : _a.stock) || 0),
        price: ((_b = rows[v.id]) == null ? void 0 : _b.price) ? Number(rows[v.id].price) : null,
        compare_price: ((_c = rows[v.id]) == null ? void 0 : _c.compare_price) ? Number(rows[v.id].compare_price) : null,
        sku: ((_d = rows[v.id]) == null ? void 0 : _d.sku) || null
      };
    });
    router3.post(`${ap}/products/${productId}/variant-stock`, { variants: payload }, { onFinish: () => setSaving(false) });
  }
  const inp = "h-9 px-2.5 border border-gray-200 rounded-lg text-[12.5px] outline-none focus:border-[var(--color-primary)] bg-white w-full";
  return /* @__PURE__ */ jsxs("div", { className: "mt-5 pt-5 border-t border-gray-200", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-gray-800 mb-1", children: "Stock & Price per Combination" }),
    /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-gray-400 mb-3", children: "Each row is one real, sellable combination (e.g. Red + Large). Leave price blank to use the product's base price." }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-[12.5px]", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-gray-200", children: ["Combination", "Stock", "Price", "Compare Price", "SKU"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left px-2 py-2 text-[10.5px] font-black text-gray-400 uppercase tracking-wide", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-50", children: variants.map((v) => {
        var _a, _b, _c, _d;
        return /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2 font-semibold text-gray-700", children: label(v) }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2 w-24", children: /* @__PURE__ */ jsx("input", { type: "number", min: 0, className: inp, value: ((_a = rows[v.id]) == null ? void 0 : _a.stock) ?? "", onChange: (e) => set(v.id, "stock", e.target.value) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2 w-28", children: /* @__PURE__ */ jsx("input", { type: "number", min: 0, className: inp, placeholder: "base price", value: ((_b = rows[v.id]) == null ? void 0 : _b.price) ?? "", onChange: (e) => set(v.id, "price", e.target.value) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2 w-28", children: /* @__PURE__ */ jsx("input", { type: "number", min: 0, className: inp, placeholder: "optional", value: ((_c = rows[v.id]) == null ? void 0 : _c.compare_price) ?? "", onChange: (e) => set(v.id, "compare_price", e.target.value) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-2 w-32", children: /* @__PURE__ */ jsx("input", { className: inp, placeholder: "optional", value: ((_d = rows[v.id]) == null ? void 0 : _d.sku) ?? "", onChange: (e) => set(v.id, "sku", e.target.value) }) })
        ] }, v.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: save,
        disabled: saving,
        className: "mt-3 h-9 px-6 rounded-xl text-[13px] font-bold border-none cursor-pointer disabled:opacity-60",
        style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
        children: saving ? "Saving…" : "✓ Save Stock & Price"
      }
    )
  ] });
}
function ProductEdit({ product, categories, isCreate = false }) {
  const { props: pageProps } = usePage();
  const ap = `/${pageProps.adminPath ?? "ml-admin"}`;
  const { data, setData, post, processing, errors } = useForm({
    _method: isCreate ? "POST" : "PUT",
    name: (product == null ? void 0 : product.name) ?? "",
    slug: (product == null ? void 0 : product.slug) ?? "",
    description: (product == null ? void 0 : product.description) ?? "",
    price: (product == null ? void 0 : product.price) ?? "",
    compare_price: (product == null ? void 0 : product.compare_price) ?? "",
    stock: (product == null ? void 0 : product.stock) ?? 0,
    category_id: (product == null ? void 0 : product.category_id) ?? "",
    is_featured: (product == null ? void 0 : product.is_featured) ?? false,
    is_new: (product == null ? void 0 : product.is_new) ?? false,
    is_active: (product == null ? void 0 : product.is_active) ?? true,
    sort_order: (product == null ? void 0 : product.sort_order) ?? 0,
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function pickImages(files) {
    if (!files) return;
    const arr = Array.from(files);
    setData("images", arr);
    setImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  }
  function submit(e) {
    e.preventDefault();
    post(isCreate ? `${ap}/products` : `${ap}/products/${product.id}`, { forceFormData: true });
  }
  return /* @__PURE__ */ jsxs(AdminLayout, { title: isCreate ? "Add Product" : "Edit Product", children: [
    /* @__PURE__ */ jsx(Head_default, { title: isCreate ? "Add Product" : `Edit: ${product == null ? void 0 : product.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxs(Link_default, { href: `${ap}/products`, className: "flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[var(--color-primary)] no-underline transition-colors", children: [
        /* @__PURE__ */ jsx(IconArrowLeft, { size: 16 }),
        " Back to Products"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "/" }),
      /* @__PURE__ */ jsx("span", { className: "text-[13px] font-semibold text-gray-800", children: isCreate ? "New Product" : product == null ? void 0 : product.name })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] pb-3 border-b border-gray-100", children: "Product Information" }),
          /* @__PURE__ */ jsx(Field, { label: "Product Name *", error: errors.name, children: /* @__PURE__ */ jsx(
            "input",
            {
              value: data.name,
              required: true,
              className: inputCls,
              placeholder: "e.g. Classic Oxford Shirt",
              onChange: (e) => {
                setData("name", e.target.value);
                if (isCreate) setData("slug", slugify(e.target.value));
              }
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "URL Slug", hint: "Auto-generated — change only if needed", error: errors.slug, children: /* @__PURE__ */ jsx(
            "input",
            {
              value: data.slug,
              className: `${inputCls} font-mono text-[12.5px]`,
              placeholder: "classic-oxford-shirt",
              onChange: (e) => setData("slug", e.target.value)
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { label: "Description", hint: "One spec per line: Brand: X, Color: Y, Size: S/M/L", children: /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.description,
              rows: 6,
              className: "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13.5px] outline-none focus:border-[var(--color-primary)] resize-none transition-colors",
              placeholder: "Brand: Your Brand\nMaterial: 100% Cotton\nColor: Navy Blue\nSizes: S, M, L, XL\nWarranty: 1 Year",
              onChange: (e) => setData("description", e.target.value)
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] pb-3 border-b border-gray-100", children: "Pricing & Inventory" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { label: "Selling Price (Rs) *", hint: "Price customers pay", error: errors.price, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                required: true,
                value: data.price,
                className: inputCls,
                placeholder: "2499",
                onChange: (e) => setData("price", e.target.value)
              }
            ) }),
            /* @__PURE__ */ jsxs(Field, { label: "Original Price (Rs)", hint: "Shows strikethrough — leave blank if no sale", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  value: data.compare_price,
                  className: inputCls,
                  placeholder: "3499",
                  onChange: (e) => setData("compare_price", e.target.value)
                }
              ),
              Number(data.compare_price) > Number(data.price) && Number(data.price) > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[11.5px] text-green-600 mt-1 font-semibold", children: [
                "✓ ",
                Math.round((1 - Number(data.price) / Number(data.compare_price)) * 100),
                "% discount badge will show"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Field, { label: "Stock Quantity *", hint: "Units available", error: errors.stock, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "0",
                required: true,
                value: data.stock,
                className: `${inputCls} max-w-[180px]`,
                placeholder: "50",
                onChange: (e) => setData("stock", +e.target.value)
              }
            ),
            Number(data.stock) === 0 && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-red-500 mt-1", children: "⚠ Shows as Out of Stock" }),
            Number(data.stock) > 0 && Number(data.stock) <= 5 && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-amber-600 mt-1", children: "⚠ Low stock" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] pb-3 border-b border-gray-100 mb-4", children: "Product Images" }),
          (product == null ? void 0 : product.images) && product.images.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[12.5px] text-gray-500 mb-2.5", children: "Current images:" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-2.5", children: product.images.map((img, i) => /* @__PURE__ */ jsxs("div", { className: "relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50", children: [
              /* @__PURE__ */ jsx("img", { src: img.thumb, alt: "", className: "w-full h-full object-cover" }),
              i === 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-1 left-1 text-[9px] font-black text-white px-1.5 py-0.5 rounded-full", style: { background: "var(--color-primary)" }, children: "Main" })
            ] }, img.id)) })
          ] }),
          imagePreviews.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-[12.5px] text-green-600 font-semibold mb-2.5", children: [
              "✓ ",
              imagePreviews.length,
              " new image(s) ready to upload"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-2.5", children: imagePreviews.map((src, i) => /* @__PURE__ */ jsx("div", { className: "aspect-square rounded-xl overflow-hidden border-2 border-green-300 bg-gray-50", children: /* @__PURE__ */ jsx("img", { src, alt: "", className: "w-full h-full object-cover" }) }, i)) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[var(--color-primary)] rounded-xl p-8 cursor-pointer transition-colors group", children: [
            /* @__PURE__ */ jsx("input", { type: "file", multiple: true, accept: "image/*", className: "hidden", onChange: (e) => pickImages(e.target.files) }),
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-[var(--color-primary)]/10 flex items-center justify-center mb-3 transition-colors", children: /* @__PURE__ */ jsx(IconUpload, { size: 24, className: "text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" }) }),
            /* @__PURE__ */ jsx("div", { className: "text-[14px] font-semibold text-gray-700 mb-1", children: "Click to upload product images" }),
            /* @__PURE__ */ jsx("div", { className: "text-[12.5px] text-gray-400 mb-1", children: "PNG, JPG, WebP — up to 5MB each — multiple allowed" }),
            /* @__PURE__ */ jsx("div", { className: "text-[11.5px] text-blue-500 font-semibold", children: "📐 Best size: 800×1067px (portrait 3:4) — white or plain background" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-1", children: "Product Variants" }),
          /* @__PURE__ */ jsx("p", { className: "text-[12px] text-gray-400 mb-4", children: "Add Size, Color or other options. Leave empty for simple products." }),
          /* @__PURE__ */ jsx(VariantBuilder, { productId: product == null ? void 0 : product.id })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-3", children: "Category *" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: data.category_id,
              required: true,
              className: `${inputCls} ${!data.category_id ? "border-amber-300" : ""}`,
              onChange: (e) => setData("category_id", +e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select a category…" }),
                categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          ),
          !data.category_id && /* @__PURE__ */ jsx("p", { className: "text-[11.5px] text-amber-600 mt-1.5", children: "Required" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-manrope font-bold text-[15px] mb-3", children: "Visibility" }),
          [
            { field: "is_active", label: "Published", hint: "Visible to customers" },
            { field: "is_featured", label: "Featured", hint: "Show on homepage featured section" },
            { field: "is_new", label: "New Arrival", hint: "Mark as new arrival (shows in New Arrivals page)" }
          ].map((t) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3 border-b border-gray-50 last:border-0", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13.5px] font-semibold text-gray-800", children: t.label }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-gray-400", children: t.hint })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setData(t.field, !data[t.field]),
                className: `relative w-12 h-6 rounded-full border-none cursor-pointer transition-all flex-shrink-0 ${data[t.field] ? "bg-[var(--color-primary)]" : "bg-gray-200"}`,
                children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data[t.field] ? "left-[26px]" : "left-0.5"}` })
              }
            )
          ] }, t.field))
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full py-3.5 font-black text-[15px] rounded-xl border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2.5 transition-all hover:opacity-90",
            style: { background: "var(--color-primary)", color: "var(--color-primary-text)" },
            children: [
              /* @__PURE__ */ jsx(IconCheck, { size: 20 }),
              processing ? "Saving…" : isCreate ? "Create Product" : "Save Changes"
            ]
          }
        ),
        !isCreate && /* @__PURE__ */ jsx(Link_default, { href: `${ap}/products`, className: "block text-center text-[13px] font-semibold text-gray-400 hover:text-gray-600 no-underline", children: "Cancel" }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-700 space-y-1", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("strong", { children: "💡 Tips:" }) }),
          /* @__PURE__ */ jsx("div", { children: "• Set Original Price higher than Selling Price to show a discount badge" }),
          /* @__PURE__ */ jsx("div", { children: "• First uploaded image becomes the main product photo" }),
          /* @__PURE__ */ jsx("div", { children: "• Description: one spec per line (Brand: X, Color: Y)" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProductEdit as default
};
