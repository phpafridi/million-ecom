import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { L as Link_default, H as Head_default } from "../ssr.js";
import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconBrandWhatsapp, IconChevronLeft, IconChevronRight, IconVolumeOff, IconVolume2, IconArrowRight } from "@tabler/icons-react";
import { S as StorefrontLayout } from "./StorefrontLayout-BxLnnCms.js";
import { P as ProductCard } from "./ProductCard-B4XFm4Gt.js";
import { P as ProductCardSkeleton, C as CategorySkeleton } from "./Skeleton-C7zZnlgf.js";
import "react-dom/server";
import "@inertiajs/core";
import "react-dom";
import "lodash-es";
import "laravel-precognition";
import "@laravel/echo-react";
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
  const H = "clamp(300px, 52vw, 640px)";
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
                  initial: { scale: 1.06 },
                  animate: { scale: 1 },
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
              /* @__PURE__ */ jsx("h1", { style: { fontFamily: "Manrope, sans-serif", fontWeight: 900, color: "#fff", lineHeight: 1.04, letterSpacing: "-0.02em", margin: "0 0 clamp(8px,1.4vw,16px)", fontSize: "clamp(24px, 5.8vw, 68px)" }, children: s.subtitle ?? s.title }),
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
                wa && /* @__PURE__ */ jsxs(
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
        slides.length > 1 && /* @__PURE__ */ jsx(Fragment, { children: [{ side: "left", d: -1, icon: /* @__PURE__ */ jsx(IconChevronLeft, { size: 20 }), n: cur - 1 }, { side: "right", d: 1, icon: /* @__PURE__ */ jsx(IconChevronRight, { size: 20 }), n: cur + 1 }].map(({ side, d, icon, n }) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => go(n, d),
            style: { position: "absolute", [side]: "clamp(8px,2vw,18px)", top: "50%", transform: "translateY(-50%)", zIndex: 20, width: "clamp(34px,4vw,48px)", height: "clamp(34px,4vw,48px)", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" },
            onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.22)",
            onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.10)",
            children: icon
          },
          side
        )) }),
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
  loading
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
  const pad = "clamp(16px,5vw,48px)";
  const canLeft = index > 0;
  const canRight = index < max;
  const totalDots = Math.ceil(items.length / visible);
  const activeDot = Math.round(index / visible);
  return /* @__PURE__ */ jsxs("section", { style: { padding: "32px 0", width: "100%", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: `0 ${pad}`, marginBottom: 22 }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
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
const TABS = [
  { key: "featured", label: "Featured" },
  { key: "sale", label: "On Sale" },
  { key: "top", label: "Top Rated" }
];
function SectionHeader({ eyebrow, title, viewAll }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsx("div", { className: "w-1 h-6 sm:h-7 bg-[var(--color-primary,#00c8ff)] rounded-sm flex-shrink-0", style: { boxShadow: "0 0 8px rgba(0,200,255,0.4)" } }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] sm:text-[11px] font-bold text-[var(--color-primary,#00c8ff)] uppercase tracking-[.12em]", children: eyebrow }),
        /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-[18px] sm:text-[21px] text-gray-900 tracking-tight leading-snug", children: title })
      ] })
    ] }),
    viewAll && /* @__PURE__ */ jsxs(Link_default, { href: viewAll, className: "text-[12px] sm:text-[12.5px] font-bold text-[var(--color-primary,#00c8ff)] flex items-center gap-1 no-underline flex-shrink-0", children: [
      "View all ",
      /* @__PURE__ */ jsx(IconArrowRight, { size: 14 })
    ] })
  ] });
}
function CatDots({ total }) {
  const [active, setActive] = useState(0);
  const pages = Math.ceil(total / 2);
  useEffect(() => {
    const track = document.getElementById("ml-cat-track");
    if (!track) return;
    const iv = setInterval(() => {
      if (track.dataset.touching === "1") return;
      setActive((p) => {
        const next = (p + 1) % pages;
        const w = track.scrollWidth / total;
        track.scrollTo({ left: next * 2 * w, behavior: "smooth" });
        return next;
      });
    }, 3e3);
    const onScroll = () => {
      const w = track.scrollWidth / total;
      setActive(Math.min(Math.round(track.scrollLeft / (w * 2)), pages - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(iv);
      track.removeEventListener("scroll", onScroll);
    };
  }, [total, pages]);
  return /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }, children: Array(pages).fill(0).map((_, i) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => {
        const track = document.getElementById("ml-cat-track");
        if (!track) return;
        const w = track.scrollWidth / total;
        track.scrollTo({ left: i * 2 * w, behavior: "smooth" });
        setActive(i);
      },
      style: { width: i === active ? 22 : 7, height: 7, borderRadius: 100, background: i === active ? "var(--color-primary)" : "#D1D5DB", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }
    },
    i
  )) });
}
function Home({ heroSlides, featuredProducts, onSaleProducts, topRatedProducts, newProducts, categories, topCategories, categoryProducts, banners, settings, auth }) {
  const [tab, setTab] = useState("featured");
  const [loaded, setLoaded] = useState(false);
  const whatsapp = (settings == null ? void 0 : settings.whatsapp_number) ?? "";
  const dividerText = (settings == null ? void 0 : settings.home_divider_text) ?? "Fresh Drops Meet Fan Favorites";
  const TRUST = [1, 2, 3, 4, 5].map((n) => ({
    icon: (settings == null ? void 0 : settings[`trust_${n}_icon`]) || ["🚚", "🛡️", "↩️", "🎧", "💬"][n - 1],
    title: (settings == null ? void 0 : settings[`trust_${n}_title`]) || ["Free Delivery", "100% Genuine", "Easy Returns", "24/7 Support", "WhatsApp Us"][n - 1],
    sub: (settings == null ? void 0 : settings[`trust_${n}_sub`]) || ["On qualifying orders", "Verified products only", "7-day hassle-free", "We are here to help", "Quick response"][n - 1]
  }));
  const TICKER = (settings == null ? void 0 : settings.ticker_items) ? settings.ticker_items.split("|").map((s) => s.trim()).filter(Boolean) : ["Free shipping available", "7-day easy returns", "Verified sellers", "Secure payments", "24/7 support"];
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);
  const b = (pos) => banners[pos];
  const productSets = {
    featured: featuredProducts,
    sale: onSaleProducts,
    top: topRatedProducts,
    new: newProducts
  };
  return /* @__PURE__ */ jsxs(StorefrontLayout, { auth, settings, children: [
    /* @__PURE__ */ jsx(Head_default, { title: "Home" }),
    /* @__PURE__ */ jsx(HeroSlider, { slides: heroSlides }),
    /* @__PURE__ */ jsxs("div", { style: { background: (settings == null ? void 0 : settings.trust_bar_bg) || "var(--color-dark-bg,#0a0a0a)", borderBottom: "1px solid rgba(255,255,255,0.06)" }, children: [
      /* @__PURE__ */ jsx("div", { className: "flex lg:hidden", children: TRUST.slice(0, 2).map((t, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex flex-1 items-center gap-2.5 px-4 py-3",
          style: { borderRight: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none" },
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 text-[15px]",
                style: { background: ((settings == null ? void 0 : settings.trust_icon_color) || "var(--color-primary)") + "20", border: "1px solid " + ((settings == null ? void 0 : settings.trust_icon_color) || "var(--color-primary)") + "35" },
                children: t.icon
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold leading-tight text-white truncate", children: t.title }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] mt-0.5 truncate", style: { color: "rgba(255,255,255,0.45)" }, children: t.sub })
            ] })
          ]
        },
        i
      )) }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:grid lg:grid-cols-4", children: TRUST.slice(0, 4).map((t, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center gap-3 px-5 py-4",
          style: { borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" },
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 text-base",
                style: { background: ((settings == null ? void 0 : settings.trust_icon_color) || "var(--color-primary)") + "18", border: "1px solid " + ((settings == null ? void 0 : settings.trust_icon_color) || "var(--color-primary)") + "30" },
                children: t.icon
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[12px] font-bold leading-tight truncate", style: { color: (settings == null ? void 0 : settings.trust_title_color) || "#fff" }, children: t.title }),
              /* @__PURE__ */ jsx("div", { className: "text-[10.5px] mt-0.5 truncate", style: { color: (settings == null ? void 0 : settings.trust_sub_color) || "rgba(255,255,255,0.45)" }, children: t.sub })
            ] })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-100 flex items-center overflow-hidden", style: { height: 36, background: (settings == null ? void 0 : settings.ticker_bg) || "#fff" }, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex-shrink-0 flex items-center gap-1.5 px-3 h-full",
          style: { background: (settings == null ? void 0 : settings.ticker_live_bg) || "var(--color-primary)", color: (settings == null ? void 0 : settings.ticker_live_text) || "#0a0a0a", borderRight: "1px solid rgba(0,0,0,0.1)", minWidth: 62, justifyContent: "center" },
          children: [
            /* @__PURE__ */ jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0, animation: "mlLiveDot 1.4s ease-in-out infinite" } }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: 10, fontWeight: 900, letterSpacing: "0.1em" }, children: "LIVE" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex-1 min-w-0 overflow-hidden",
          style: { WebkitMaskImage: "linear-gradient(to right,transparent,black 40px,black calc(100% - 30px),transparent)", maskImage: "linear-gradient(to right,transparent,black 40px,black calc(100% - 30px),transparent)" },
          children: /* @__PURE__ */ jsx("div", { style: { display: "flex", width: "max-content", animation: "mlTickerScroll 30s linear infinite", willChange: "transform" }, children: [...TICKER, ...TICKER].map((item, i) => /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "0 22px", whiteSpace: "nowrap", fontSize: 11.5, fontWeight: 500, color: "#555" }, children: [
            /* @__PURE__ */ jsx("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--color-primary)", flexShrink: 0 } }),
            item
          ] }, i)) })
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `@keyframes mlTickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes mlLiveDot{0%,100%{opacity:1}50%{opacity:0.2}}` })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-5 sm:py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-6 lg:px-10", children: /* @__PURE__ */ jsx(SectionHeader, { eyebrow: "Shop by", title: "All Categories", viewAll: "/shop" }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            id: "ml-cat-track",
            style: { display: "flex", gap: 12, padding: "0 16px 4px", overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", scrollBehavior: "smooth" },
            onTouchStart: () => {
              const el = document.getElementById("ml-cat-track");
              if (el) el.dataset.touching = "1";
            },
            onTouchEnd: () => {
              const el = document.getElementById("ml-cat-track");
              if (el) setTimeout(() => {
                el.dataset.touching = "0";
              }, 800);
            },
            children: !loaded ? Array(8).fill(0).map((_, i) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex-shrink-0 animate-pulse",
                style: { width: "calc(50% - 6px)", scrollSnapAlign: "start" },
                children: /* @__PURE__ */ jsx("div", { className: "bg-gray-200 rounded-[18px] w-full", style: { aspectRatio: "1/1" } })
              },
              i
            )) : categories.slice(0, 8).map((cat) => /* @__PURE__ */ jsx(
              Link_default,
              {
                href: `/shop?category=${cat.slug}`,
                className: "no-underline flex-shrink-0 block",
                style: { width: "calc(50% - 6px)", scrollSnapAlign: "start" },
                children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[18px] w-full", style: { aspectRatio: "1/1" }, children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: cat.mobile_image ?? cat.image ?? "/images/placeholder.jpg",
                      alt: cat.name,
                      className: "w-full h-full object-cover block",
                      style: { objectPosition: "center 20%" },
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.05) 55%,transparent 100%)" } }),
                  /* @__PURE__ */ jsx("span", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px", color: "white", fontSize: 13, fontWeight: 700, lineHeight: 1.2 }, children: cat.name })
                ] })
              },
              cat.id
            ))
          }
        ),
        /* @__PURE__ */ jsx(CatDots, { total: Math.min(categories.length, 8) }),
        /* @__PURE__ */ jsx("style", { children: `#ml-cat-track::-webkit-scrollbar{display:none}` })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:grid lg:grid-cols-6 gap-4 px-10", children: !loaded ? Array(6).fill(0).map((_, i) => /* @__PURE__ */ jsx(CategorySkeleton, {}, i)) : categories.slice(0, 8).map((cat, i) => /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: i * 0.04 }, children: /* @__PURE__ */ jsxs(
        Link_default,
        {
          href: `/shop?category=${cat.slug}`,
          className: "bg-white rounded-[16px] border border-gray-200 overflow-hidden text-center no-underline block transition-all hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]",
          children: [
            /* @__PURE__ */ jsx("img", { src: cat.image ?? "/images/placeholder.jpg", alt: cat.name, className: "w-full aspect-square object-cover block", style: { objectPosition: "center 20%" }, loading: "lazy" }),
            /* @__PURE__ */ jsx("span", { className: "block text-[13px] font-bold text-gray-900 py-3 px-2 truncate", children: cat.name })
          ]
        }
      ) }, cat.id)) })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.section,
      {
        className: "hidden md:block px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6",
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        children: [
          b("full_hero") && /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: b("full_hero").link ?? "/shop",
              className: "relative block rounded-[18px] overflow-hidden no-underline group mb-3",
              style: { height: "clamp(220px, 32vw, 380px)" },
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: b("full_hero").image ?? "/images/placeholder.jpg",
                    alt: b("full_hero").title,
                    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: "linear-gradient(180deg, rgba(7,11,20,0.15) 0%, rgba(7,11,20,0.55) 100%)" } }),
                /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center text-center px-4", children: [
                  b("full_hero").subtitle && /* @__PURE__ */ jsx("span", { className: "text-[12px] font-bold text-white/70 uppercase tracking-[.2em] mb-2", children: b("full_hero").subtitle }),
                  /* @__PURE__ */ jsx("h2", { className: "font-manrope font-black text-white leading-[1.05] tracking-tight mb-1", style: { fontSize: "clamp(22px, 4.5vw, 40px)" }, children: b("full_hero").title }),
                  b("full_hero").cta_text && /* @__PURE__ */ jsx("span", { className: "mt-4 inline-flex items-center bg-white text-[var(--color-dark-bg,#0a0e1a)] font-black rounded-full", style: { fontSize: 13, padding: "12px 28px" }, children: b("full_hero").cta_text })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 12, gridTemplateColumns: "340px 1fr", gridTemplateRows: "220px 228px" }, children: [
            (() => {
              const promo = b("promo") ?? b("featured") ?? (Object.keys(banners).length > 0 ? banners[Object.keys(banners)[0]] : null);
              if (!promo) return /* @__PURE__ */ jsx("div", { style: { gridColumn: 1, gridRow: "1 / 3", borderRadius: 18, overflow: "hidden", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", padding: 24 }, children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: 32, marginBottom: 8 }, children: "🖼️" }),
                'Add a banner with position "promo" in',
                /* @__PURE__ */ jsx("br", {}),
                "Admin → Banners"
              ] }) });
              return /* @__PURE__ */ jsxs(
                Link_default,
                {
                  href: promo.link ?? "/shop",
                  style: { gridColumn: 1, gridRow: "1 / 3", position: "relative", borderRadius: 18, overflow: "hidden", display: "block", textDecoration: "none", background: "var(--color-dark-bg,#0a0e1a)" },
                  children: [
                    promo.video ? /* @__PURE__ */ jsx("video", { autoPlay: true, muted: true, loop: true, playsInline: true, style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }, children: /* @__PURE__ */ jsx("source", { src: promo.video, type: "video/mp4" }) }) : promo.image ? /* @__PURE__ */ jsx("img", { src: promo.image, alt: promo.title ?? "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }) : null,
                    /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2), transparent)" } }),
                    /* @__PURE__ */ jsxs("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, zIndex: 5 }, children: [
                      promo.subtitle && /* @__PURE__ */ jsx("div", { style: { fontSize: 9.5, color: "var(--color-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }, children: promo.subtitle }),
                      /* @__PURE__ */ jsx("div", { style: { fontFamily: "Manrope,sans-serif", fontWeight: 900, fontSize: 19, color: "#fff", lineHeight: 1.2, marginBottom: promo.cta_text ? 12 : 0 }, children: promo.title }),
                      promo.cta_text && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", gap: 7, background: "var(--color-primary)", color: "var(--color-primary-text,#0a0a0a)", fontSize: 12, fontWeight: 800, padding: "10px 16px", borderRadius: 100 }, children: promo.cta_text })
                    ] })
                  ]
                }
              );
            })(),
            /* @__PURE__ */ jsx("div", { style: { gridColumn: 2, gridRow: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }, children: ["small_top_1", "small_top_2"].map((pos) => b(pos) && /* @__PURE__ */ jsxs(
              Link_default,
              {
                href: b(pos).link ?? "/shop",
                style: { position: "relative", borderRadius: 15, overflow: "hidden", display: "block", textDecoration: "none", height: "100%", background: "#0a0e1a" },
                className: "group cursor-pointer",
                children: [
                  b(pos).video ? /* @__PURE__ */ jsx(
                    "video",
                    {
                      autoPlay: true,
                      muted: true,
                      loop: true,
                      playsInline: true,
                      style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" },
                      className: "group-hover:scale-[1.04]",
                      children: /* @__PURE__ */ jsx("source", { src: b(pos).video, type: "video/mp4" })
                    }
                  ) : /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: b(pos).image ?? "/images/placeholder.jpg",
                      alt: b(pos).title,
                      style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" },
                      className: "group-hover:scale-[1.04]"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(7,11,20,0.82))" } }),
                  /* @__PURE__ */ jsxs("div", { style: { position: "absolute", bottom: 14, left: 14, right: 14, zIndex: 10 }, children: [
                    b(pos).subtitle && /* @__PURE__ */ jsx("div", { style: { fontSize: 9.5, color: "var(--color-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }, children: b(pos).subtitle }),
                    /* @__PURE__ */ jsx("h3", { style: { fontFamily: "Manrope,sans-serif", fontWeight: 900, fontSize: 15, color: "#fff", lineHeight: 1.2, marginBottom: 8 }, children: b(pos).title }),
                    /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", background: "#fff", color: "var(--color-dark-bg, #0a0e1a)", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 100 }, children: b(pos).cta_text })
                  ] })
                ]
              },
              pos
            )) }),
            /* @__PURE__ */ jsx("div", { style: { gridColumn: 2, gridRow: 2, position: "relative", borderRadius: 15, overflow: "hidden", cursor: "pointer", background: "#0a0e1a" }, className: "group", children: b("wide_bottom") ? /* @__PURE__ */ jsxs(Fragment, { children: [
              b("wide_bottom").video ? /* @__PURE__ */ jsx(
                "video",
                {
                  autoPlay: true,
                  muted: true,
                  loop: true,
                  playsInline: true,
                  style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" },
                  className: "group-hover:scale-[1.03]",
                  children: /* @__PURE__ */ jsx("source", { src: b("wide_bottom").video, type: "video/mp4" })
                }
              ) : /* @__PURE__ */ jsx(
                "img",
                {
                  src: b("wide_bottom").image ?? "/images/placeholder.jpg",
                  alt: b("wide_bottom").title,
                  style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" },
                  className: "group-hover:scale-[1.03]"
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(7,11,20,0.88), rgba(7,11,20,0.4), transparent)" } }),
              /* @__PURE__ */ jsxs("div", { style: { position: "absolute", top: "50%", transform: "translateY(-50%)", left: 20, zIndex: 10, maxWidth: 300 }, children: [
                b("wide_bottom").subtitle && /* @__PURE__ */ jsx("div", { style: { fontSize: 9.5, color: "var(--color-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }, children: b("wide_bottom").subtitle }),
                /* @__PURE__ */ jsx("h3", { style: { fontFamily: "Manrope,sans-serif", fontWeight: 900, fontSize: 20, color: "#fff", lineHeight: 1.15, marginBottom: 12 }, children: b("wide_bottom").title }),
                /* @__PURE__ */ jsx(Link_default, { href: b("wide_bottom").link ?? "/shop", style: { display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primary)", color: "var(--color-dark-bg, #0a0e1a)", fontSize: 12, fontWeight: 800, padding: "8px 16px", borderRadius: 100, textDecoration: "none" }, children: b("wide_bottom").cta_text })
              ] })
            ] }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gray-200 animate-pulse" }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.section,
      {
        className: "md:hidden px-4 pb-4 space-y-3",
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        children: ["full_hero", "promo", "small_top_1"].map((pos) => b(pos) && /* @__PURE__ */ jsx(
          Link_default,
          {
            href: b(pos).link ?? "/shop",
            className: "block rounded-[16px] overflow-hidden no-underline relative",
            style: { aspectRatio: "16/9", background: "#f1f1f1" },
            children: b(pos).video ? /* @__PURE__ */ jsx("video", { autoPlay: true, muted: true, loop: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover", children: /* @__PURE__ */ jsx("source", { src: b(pos).video, type: "video/mp4" }) }) : /* @__PURE__ */ jsx("img", { src: b(pos).mobile_image ?? b(pos).image ?? "", alt: b(pos).title ?? "", className: "absolute inset-0 w-full h-full object-cover" })
          },
          pos
        ))
      }
    ),
    /* @__PURE__ */ jsx(
      ProductScroller,
      {
        eyebrow: "Just Landed",
        title: "New Arrivals",
        viewAllHref: "/shop?sort=newest",
        products: newProducts,
        whatsapp,
        loading: !loaded
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "px-4 sm:px-6 lg:px-10 my-8 sm:my-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-5 max-w-[1400px] mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-px", style: { background: "linear-gradient(to right, transparent, var(--color-primary, #C9A84C) 60%, var(--color-primary, #C9A84C))" } }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full blur-md opacity-40", style: { background: "var(--color-primary, #C9A84C)" } }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-lg",
            style: { background: "linear-gradient(135deg, var(--color-primary, #C9A84C), var(--color-primary-dark, #B8973B))" },
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-[15px] sm:text-[17px]", style: { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }, children: "✨" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "font-manrope font-black text-[11px] sm:text-[13px] uppercase tracking-[0.12em] whitespace-nowrap",
                  style: { color: "var(--color-primary-text, #0a0a0a)" },
                  children: dividerText
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-[15px] sm:text-[17px]", style: { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }, children: "✨" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-px", style: { background: "linear-gradient(to left, transparent, var(--color-primary, #C9A84C) 60%, var(--color-primary, #C9A84C))" } })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "px-4 sm:px-6 lg:px-10 pb-1", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-end justify-between gap-3 mb-2", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 rounded-[10px] p-1 gap-0.5", children: TABS.map((t) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setTab(t.key),
        className: `px-2.5 sm:px-3.5 py-1.5 rounded-[8px] text-[11px] sm:text-[12px] font-semibold transition-all border-none cursor-pointer
                                    ${tab === t.key ? "bg-white text-[var(--color-primary,#00c8ff)] shadow-sm" : "text-gray-500 bg-transparent"}`,
        children: t.label
      },
      t.key
    )) }) }) }),
    /* @__PURE__ */ jsx(
      ProductScroller,
      {
        eyebrow: "Most Wanted",
        title: "Featured Products",
        viewAllHref: "/shop",
        products: productSets[tab] ?? [],
        whatsapp,
        loading: !loaded
      }
    ),
    (topCategories ?? categories).map((cat, i) => /* @__PURE__ */ jsxs("div", { children: [
      cat.banner_image && /* @__PURE__ */ jsx(
        motion.section,
        {
          className: "px-4 sm:px-6 lg:px-10 pb-4 sm:pb-5",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          children: /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: `/shop?category=${cat.slug}`,
              className: "relative block rounded-[16px] sm:rounded-[18px] overflow-hidden no-underline group",
              style: { height: "clamp(160px, 22vw, 260px)" },
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: cat.banner_image,
                    alt: cat.name,
                    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] hidden sm:block",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: cat.mobile_banner_image ?? cat.banner_image,
                    alt: cat.name,
                    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:hidden",
                    style: { objectPosition: "center 30%" },
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: "linear-gradient(90deg, rgba(7,11,20,0.78) 0%, rgba(7,11,20,0.3) 55%, transparent)" } }),
                /* @__PURE__ */ jsxs("div", { className: "absolute top-1/2 -translate-y-1/2 left-5 sm:left-10 z-10", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] sm:text-[11px] font-bold uppercase tracking-[.16em] mb-1.5 block", style: { color: "var(--color-primary)" }, children: cat.name }),
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: "font-manrope font-black text-white leading-[1.1] tracking-tight",
                      style: { fontSize: "clamp(20px, 3vw, 32px)" },
                      children: cat.description || `Shop ${cat.name}`
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-white/80 border border-white/30 rounded-full px-3 py-1", children: "View Collection →" })
                ] })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        ProductScroller,
        {
          eyebrow: "Shop",
          title: cat.name,
          viewAllHref: `/shop?category=${cat.slug}`,
          products: categoryProducts[cat.slug] ?? [],
          whatsapp,
          loading: !loaded
        }
      )
    ] }, cat.id)),
    ["promo_1", "promo_2", "promo_3"].some((p) => b(p)) && /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-3 px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        children: ["promo_1", "promo_2", "promo_3"].map((pos) => b(pos) && /* @__PURE__ */ jsxs(Link_default, { href: b(pos).link ?? "/shop", className: "relative rounded-[16px] overflow-hidden group block no-underline", style: { height: 190 }, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: b(pos).image ?? "/images/placeholder.jpg",
              alt: b(pos).title,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] absolute inset-0"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0", style: { background: "linear-gradient(120deg, rgba(7,11,20,0.88) 25%, rgba(7,11,20,0.4) 65%, transparent)" } }),
          /* @__PURE__ */ jsxs("div", { className: "absolute left-4 sm:left-5 bottom-4 sm:bottom-5 z-10", children: [
            b(pos).subtitle && /* @__PURE__ */ jsx("div", { className: "text-[9.5px] text-[var(--color-primary,#00c8ff)] font-bold uppercase tracking-[.1em] mb-1.5", children: b(pos).subtitle }),
            /* @__PURE__ */ jsx("h3", { className: "font-manrope font-black text-[16px] sm:text-[18px] text-white leading-[1.2] mb-2.5", children: b(pos).title }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 bg-[var(--color-primary,#00c8ff)] text-[var(--color-dark-bg,#0a0e1a)] text-[11px] sm:text-[11.5px] font-black px-3 sm:px-3.5 py-1.5 rounded-full", children: [
              b(pos).cta_text,
              " ",
              /* @__PURE__ */ jsx(IconArrowRight, { size: 12 })
            ] })
          ] })
        ] }, pos))
      }
    ),
    (settings == null ? void 0 : settings.brands_show) !== "0" && /* @__PURE__ */ jsxs(
      motion.section,
      {
        className: "px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6",
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        children: [
          /* @__PURE__ */ jsx(
            SectionHeader,
            {
              eyebrow: (settings == null ? void 0 : settings.brands_subtitle) ?? "Official Partners",
              title: (settings == null ? void 0 : settings.brands_title) ?? "Top Brands"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 sm:grid-cols-6 bg-white rounded-[14px] border border-gray-200 overflow-hidden", children: ((settings == null ? void 0 : settings.brands_items) ?? "Apple|Samsung|Sony|Dell|LG|ASUS").split("|").filter(Boolean).map((br) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-14 sm:h-[68px] border-r border-gray-100 last:border-r-0 font-manrope font-black text-[14px] sm:text-[17px] text-gray-300 hover:text-[var(--color-primary,#00c8ff)] hover:bg-[var(--color-primary-soft,#f0fbff)] transition-all cursor-pointer", children: br.trim() }, br)) })
        ]
      }
    )
  ] });
}
export {
  Home as default
};
