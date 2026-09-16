import { jsx, jsxs } from "react/jsx-runtime";
import { L as Link_default, H as Head_default } from "../ssr.js";
import { S as StorefrontLayout } from "./StorefrontLayout-BzEeKzY0.js";
import { useState, useRef, useCallback, useEffect } from "react";
import { IconBrandWhatsapp, IconVolumeOff, IconVolume2, IconArrowRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { P as ProductCard } from "./ProductCard-Dl9N4E2E.js";
import { P as ProductCardSkeleton } from "./Skeleton-Di_tqBU2.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@inertiajs/core/server";
import "./cn-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const INTERVAL = 5500;
function HeroSlider({ slides, settings }) {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const timerRef = useRef();
  const tsX = useRef(null);
  const tsY = useRef(null);
  const tsLocked = useRef(false);
  const wa = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const go = useCallback((n, d = 1) => {
    clearInterval(timerRef.current);
    setDir(d);
    setCur((n + slides.length) % slides.length);
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % slides.length), INTERVAL);
  }, [slides.length]);
  useEffect(() => {
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % slides.length), INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted, cur]);
  function onTouchStart(e) {
    tsX.current = e.touches[0].clientX;
    tsY.current = e.touches[0].clientY;
    tsLocked.current = false;
  }
  function onTouchMove(e) {
    if (tsX.current === null || tsY.current === null) return;
    const dx = e.touches[0].clientX - tsX.current;
    const dy = e.touches[0].clientY - tsY.current;
    if (!tsLocked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8))
      tsLocked.current = Math.abs(dy) > Math.abs(dx);
    if (!tsLocked.current) e.preventDefault();
  }
  function onTouchEnd(e) {
    if (tsX.current === null || tsLocked.current) {
      tsX.current = null;
      tsY.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - tsX.current;
    tsX.current = null;
    tsY.current = null;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? (cur + 1) % slides.length : (cur - 1 + slides.length) % slides.length);
  }
  if (!slides.length) return /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 400, background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }, children: "No slides — add from Admin → Hero Slides" });
  const s = slides[cur];
  const imgUrl = s.image ?? s.image_path ?? "";
  const vidUrl = s.video_url ?? "";
  const variants = {
    enter: (d) => ({ x: d > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-6%" : "6%", opacity: 0 })
  };
  const H = "clamp(260px, 31.2vw, 421px)";
  return /* @__PURE__ */ jsxs(
    "section",
    {
      style: { position: "relative", width: "100%", height: H, overflow: "hidden", background: "#080808", display: "block", touchAction: "pan-y" },
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      children: [
        /* @__PURE__ */ jsx(AnimatePresence, { custom: dir, initial: false, children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            custom: dir,
            variants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] },
            style: { position: "absolute", inset: 0, width: "100%", height: "100%" },
            children: [
              vidUrl ? /* @__PURE__ */ jsx(
                "video",
                {
                  ref: videoRef,
                  src: vidUrl,
                  autoPlay: true,
                  muted,
                  loop: true,
                  playsInline: true,
                  style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
                }
              ) : imgUrl ? /* @__PURE__ */ jsx(
                motion.img,
                {
                  src: imgUrl,
                  alt: s.subtitle ?? s.title,
                  style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" },
                  initial: { scale: 1 },
                  animate: { scale: 1.08 },
                  transition: { duration: INTERVAL / 1e3, ease: "linear" }
                }
              ) : /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0e1a, #1a1f35)" } }),
              /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.62) 42%, rgba(5,5,5,0.22) 72%, transparent 100%)" } }),
              /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 55%)" } })
            ]
          },
          `bg-${cur}`
        ) }),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 26 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -14 },
            transition: { duration: 0.5, delay: 0.18, ease: "easeOut" },
            style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: "clamp(18px,7vw,96px)", paddingRight: "clamp(18px,7vw,96px)", zIndex: 10 },
            children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "min(580px, 80vw)" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: "clamp(10px,1.8vw,20px)" }, children: [
                /* @__PURE__ */ jsx("div", { style: { width: "clamp(22px,3vw,40px)", height: 2, background: "var(--color-primary)", boxShadow: "0 0 10px var(--color-primary)" } }),
                /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.62)", fontWeight: 800, fontSize: "clamp(8.5px,0.95vw,11px)", letterSpacing: "0.22em", textTransform: "uppercase" }, children: s.title })
              ] }),
              /* @__PURE__ */ jsx("h1", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, color: "#fff", lineHeight: 1.02, letterSpacing: "-0.025em", margin: "0 0 clamp(8px,1.4vw,16px)", fontSize: "clamp(26px, 6.2vw, 76px)" }, children: s.subtitle ?? s.title }),
              s.description && /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.55)", fontSize: "clamp(12.5px,1.35vw,16px)", lineHeight: 1.72, margin: "0 0 clamp(14px,2.2vw,26px)", maxWidth: 420 }, children: s.description.split("\n")[0] }),
              (s.discount_pct ?? 0) > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "clamp(12px,1.8vw,22px)", padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.12)" }, children: [
                /* @__PURE__ */ jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)", display: "inline-block" } }),
                /* @__PURE__ */ jsxs("span", { style: { color: "#fff", fontWeight: 800, fontSize: "clamp(10px,1.1vw,12.5px)" }, children: [
                  "Up to ",
                  s.discount_pct,
                  "% OFF"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }, children: [
                /* @__PURE__ */ jsx(
                  Link_default,
                  {
                    href: s.cta_url ?? "/shop",
                    style: { display: "inline-flex", alignItems: "center", background: "var(--color-primary)", color: "var(--color-primary-text, #0a0e1a)", fontWeight: 800, fontSize: "clamp(11.5px,1.2vw,14px)", letterSpacing: "0.04em", borderRadius: 100, padding: "clamp(11px,1.3vw,15px) clamp(20px,2.6vw,36px)", textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" },
                    children: s.cta_text ?? "Shop Now"
                  }
                ),
                wa && (settings == null ? void 0 : settings.whatsapp_float_enabled) !== "1" && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `https://wa.me/${wa}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { display: "inline-flex", alignItems: "center", gap: 7, color: "#fff", fontWeight: 700, fontSize: "clamp(11px,1.1vw,13px)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "clamp(10px,1.2vw,14px) clamp(16px,2vw,26px)", textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" },
                    children: [
                      /* @__PURE__ */ jsx(IconBrandWhatsapp, { size: 15 }),
                      " WhatsApp"
                    ]
                  }
                )
              ] })
            ] })
          },
          `c-${cur}`
        ) }),
        vidUrl && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMuted((m) => !m),
            style: { position: "absolute", bottom: "clamp(46px,5vw,58px)", right: "clamp(12px,2vw,20px)", zIndex: 20, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
            children: muted ? /* @__PURE__ */ jsx(IconVolumeOff, { size: 14 }) : /* @__PURE__ */ jsx(IconVolume2, { size: 14 })
          }
        ),
        slides.length > 1 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: "clamp(14px,2vw,20px)", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, alignItems: "center", zIndex: 20 }, children: slides.map((_, i) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => go(i, i > cur ? 1 : -1),
            style: { width: i === cur ? 28 : 8, height: 8, borderRadius: 100, background: i === cur ? "var(--color-primary)" : "rgba(255,255,255,0.32)", border: "none", cursor: "pointer", transition: "all 0.4s", padding: 0, boxShadow: i === cur ? "0 0 8px var(--color-primary)" : "none" }
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("div", { style: { position: "absolute", bottom: "clamp(14px,2vw,20px)", right: "clamp(16px,2.5vw,26px)", color: "rgba(255,255,255,0.32)", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.15em", zIndex: 20 }, children: [
          String(cur + 1).padStart(2, "0"),
          " / ",
          String(slides.length).padStart(2, "0")
        ] })
      ]
    }
  );
}
function getVisible() {
  if (typeof window === "undefined") return 5;
  if (window.innerWidth < 480) return 2;
  if (window.innerWidth < 768) return 3;
  if (window.innerWidth < 1024) return 4;
  return 5;
}
function ProductScroller({
  title,
  eyebrow,
  viewAllHref,
  products,
  whatsapp,
  loading,
  hideTitle,
  noPad
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(getVisible);
  const [cardW, setCardW] = useState(0);
  const GAP = 12;
  const tx0 = useRef(null);
  const ty0 = useRef(null);
  const locked = useRef(false);
  const items = loading ? Array(10).fill(null) : products.slice(0, 20);
  const max = Math.max(0, items.length - visible);
  function measure() {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    if (!firstCard) return;
    setCardW(firstCard.offsetWidth + GAP);
  }
  useEffect(() => {
    measure();
    const obs = new ResizeObserver(measure);
    if (trackRef.current) obs.observe(trackRef.current);
    return () => obs.disconnect();
  }, [items.length, visible]);
  useEffect(() => {
    const fn = () => {
      setVisible(getVisible());
      setIndex(0);
    };
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  const slideTo = useCallback((i, animate = true) => {
    const clamped = Math.max(0, Math.min(max, i));
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate ? "transform 0.36s cubic-bezier(0.25,0.46,0.45,0.94)" : "none";
    track.style.transform = `translateX(${-clamped * cardW}px)`;
    setIndex(clamped);
  }, [cardW, max]);
  useEffect(() => {
    slideTo(Math.min(index, max), false);
  }, [cardW, max]);
  function onTouchStart(e) {
    tx0.current = e.touches[0].clientX;
    ty0.current = e.touches[0].clientY;
    locked.current = false;
    if (trackRef.current) trackRef.current.style.transition = "none";
  }
  function onTouchMove(e) {
    if (tx0.current === null || ty0.current === null) return;
    const dx = e.touches[0].clientX - tx0.current;
    const dy = e.touches[0].clientY - ty0.current;
    if (!locked.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      locked.current = Math.abs(dy) > Math.abs(dx);
    }
    if (locked.current) return;
    e.preventDefault();
    const track = trackRef.current;
    if (!track || cardW === 0) return;
    track.style.transform = `translateX(${-index * cardW + dx}px)`;
  }
  function onTouchEnd(e) {
    if (tx0.current === null || locked.current) {
      tx0.current = null;
      ty0.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - tx0.current;
    tx0.current = null;
    ty0.current = null;
    const threshold = Math.min(60, cardW * 0.3);
    if (dx < -threshold) slideTo(index + 1);
    else if (dx > threshold) slideTo(index - 1);
    else slideTo(index);
  }
  if (!loading && products.length === 0) return null;
  const pad = noPad ? "0px" : "clamp(16px,5vw,48px)";
  const canLeft = index > 0;
  const canRight = index < max;
  const totalDots = Math.ceil(items.length / visible);
  const activeDot = Math.round(index / visible);
  return /* @__PURE__ */ jsxs("section", { style: { padding: "32px 0", width: "100%", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: hideTitle ? "flex-end" : "space-between", padding: `0 ${pad}`, marginBottom: 22 }, children: [
      !hideTitle && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { fontSize: 11, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }, children: eyebrow }),
        /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(20px,3vw,26px)", fontWeight: 900, color: "#111", margin: 0, fontFamily: "Manrope,sans-serif", lineHeight: 1.1 }, children: title })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
        viewAllHref && /* @__PURE__ */ jsxs(
          Link_default,
          {
            href: viewAllHref,
            style: { display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#111", textDecoration: "none", whiteSpace: "nowrap" },
            children: [
              "View all ",
              /* @__PURE__ */ jsx(IconArrowRight, { size: 15 })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6 }, children: [[-1, canLeft], [1, canRight]].map(([d, can]) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => slideTo(index + d),
            style: {
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1.5px solid ${can ? "#111" : "#E5E7EB"}`,
              background: can ? "#111" : "white",
              color: can ? "white" : "#D1D5DB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: can ? "pointer" : "default",
              transition: "all 0.2s",
              flexShrink: 0
            },
            children: d === -1 ? /* @__PURE__ */ jsx(IconChevronLeft, { size: 16 }) : /* @__PURE__ */ jsx(IconChevronRight, { size: 16 })
          },
          d
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: { padding: `0 ${pad}`, overflow: "hidden", touchAction: "pan-y" },
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: trackRef,
            style: {
              display: "flex",
              gap: GAP,
              willChange: "transform"
              // width is auto — each child has fixed width
            },
            children: items.map((p, i) => {
              const effectiveVisible = Math.min(visible, Math.max(items.length, 1));
              return /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    // Each card occupies exactly 1/visible of the wrapper
                    // We use calc so it's responsive
                    flexShrink: 0,
                    width: `calc((100% - ${(effectiveVisible - 1) * GAP}px) / ${effectiveVisible})`
                  },
                  children: loading || !p ? /* @__PURE__ */ jsx(ProductCardSkeleton, {}) : /* @__PURE__ */ jsx(ProductCard, { product: p, whatsapp })
                },
                (p == null ? void 0 : p.id) ?? i
              );
            })
          }
        )
      }
    ),
    totalDots > 1 && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }, children: Array(totalDots).fill(0).map((_, i) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => slideTo(i * visible),
        style: {
          width: i === activeDot ? 24 : 8,
          height: 8,
          borderRadius: 100,
          background: i === activeDot ? "var(--color-primary)" : "#D1D5DB",
          border: "none",
          cursor: "pointer",
          transition: "all 0.3s",
          padding: 0
        }
      },
      i
    )) })
  ] });
}
function Home({ heroSlides, topCategories, newProducts, onSaleProducts, settings, auth }) {
  const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const showCategories = (settings == null ? void 0 : settings.home_show_categories) !== "0";
  const categoriesTitle = (settings == null ? void 0 : settings.home_categories_title) || "Shop by Category";
  const showAccessories = (settings == null ? void 0 : settings.home_show_accessories) !== "0";
  const accessoriesTitle = (settings == null ? void 0 : settings.home_accessories_title) || "Accessories";
  const showNewIn = (settings == null ? void 0 : settings.home_show_new_in) !== "0";
  const newInTitle = (settings == null ? void 0 : settings.home_new_in_title) || "New In";
  const showSale = (settings == null ? void 0 : settings.home_show_sale) !== "0";
  const saleTitle = (settings == null ? void 0 : settings.home_sale_title) || "Sale";
  function findAllAccessoryItems() {
    var _a, _b, _c;
    const configuredSlug = (_a = settings == null ? void 0 : settings.home_accessories_category) == null ? void 0 : _a.trim();
    if (configuredSlug) {
      for (const top of topCategories) {
        const match = (_b = top.children) == null ? void 0 : _b.find((c) => c.slug === configuredSlug);
        if (match == null ? void 0 : match.children) return match.children;
      }
    }
    const combined = [];
    for (const top of topCategories) {
      const match = (_c = top.children) == null ? void 0 : _c.find((c) => c.name.toLowerCase().includes("accessories"));
      if (match == null ? void 0 : match.children) combined.push(...match.children);
    }
    return combined;
  }
  const accessoryItems = showAccessories ? findAllAccessoryItems() : [];
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Home" }),
    /* @__PURE__ */ jsx(HeroSlider, { slides: heroSlides, settings }),
    showCategories && topCategories.length > 0 && /* @__PURE__ */ jsxs("section", { className: "py-10 sm:py-14 px-4 sm:px-6 lg:px-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-center font-manrope font-black text-[22px] sm:text-[28px] tracking-tight text-gray-900 mb-6 sm:mb-8", children: categoriesTitle }),
      /* @__PURE__ */ jsx("div", { className: `grid gap-2 sm:gap-3 max-w-4xl mx-auto ${topCategories.length === 1 ? "grid-cols-1 max-w-md" : topCategories.length === 2 ? "grid-cols-2 max-w-2xl" : "grid-cols-2 lg:grid-cols-3"}`, children: topCategories.slice(0, 8).map((cat) => /* @__PURE__ */ jsxs(Link_default, { href: `/shop?category=${cat.slug}`, className: "block no-underline group", children: [
        /* @__PURE__ */ jsx("div", { className: "relative overflow-hidden", style: { aspectRatio: "3/4" }, children: /* @__PURE__ */ jsx(
          "img",
          {
            src: cat.image ?? cat.mobile_image ?? "/images/placeholder.jpg",
            alt: cat.name,
            className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "text-center pt-3", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-[13px] sm:text-[14px] uppercase tracking-wide text-gray-900", children: cat.name }) })
      ] }, cat.id)) })
    ] }),
    showAccessories && accessoryItems && accessoryItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center px-4 sm:px-6 lg:px-10 py-8 border-t border-gray-100 bg-gray-50", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:w-[180px] lg:flex-shrink-0 mb-4 lg:mb-0 lg:pr-6", children: /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-[20px] lg:text-[24px] uppercase", children: accessoriesTitle }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0 flex gap-6 sm:gap-8 overflow-x-auto pb-1", style: { scrollbarWidth: "none" }, children: accessoryItems.map((item) => /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `/shop?category=${item.slug}`,
          className: "flex flex-col items-center gap-2.5 no-underline flex-shrink-0 group",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg", children: /* @__PURE__ */ jsx("img", { src: item.image ?? item.mobile_image ?? "/images/placeholder.jpg", alt: item.name, className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wide text-gray-700 whitespace-nowrap", children: item.name })
          ]
        },
        item.id
      )) })
    ] }),
    showNewIn && newProducts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-stretch px-4 sm:px-6 lg:px-10 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:w-[180px] lg:flex-shrink-0 mb-4 lg:mb-0 lg:pr-6 lg:flex lg:flex-col lg:justify-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-extrabold uppercase tracking-wider mb-1", style: { color: "var(--color-primary)" }, children: "Just Landed" }),
        /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-[22px] lg:text-[28px] underline decoration-2 underline-offset-4", children: newInTitle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx(ProductScroller, { eyebrow: "Just Landed", title: newInTitle, viewAllHref: "/shop?sort=newest", products: newProducts, whatsapp, hideTitle: true, noPad: true }) })
    ] }),
    showSale && onSaleProducts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-stretch px-4 sm:px-6 lg:px-10 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:w-[180px] lg:flex-shrink-0 mb-4 lg:mb-0 lg:pr-6 lg:flex lg:flex-col lg:justify-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-extrabold uppercase tracking-wider mb-1", style: { color: "var(--color-primary)" }, children: "Limited Time" }),
        /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-[22px] lg:text-[28px] underline decoration-2 underline-offset-4", children: saleTitle })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx(ProductScroller, { eyebrow: "Limited Time", title: saleTitle, viewAllHref: "/shop?sort=discount", products: onSaleProducts, whatsapp, hideTitle: true, noPad: true }) })
    ] })
  ] });
}
export {
  Home as default
};
