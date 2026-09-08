"use client";
import { useEffect, useState } from "react";
import fillerBg from "../../assets/filler-bg0.webp";
import { cn } from "../../utils";
import { Blink } from "./blink.mjs";
import { ImageDistortion } from "./image-distortion.mjs";
import { Typography } from "./typography/index.mjs";
import { Small } from "./typography/small.mjs";
const ASPECT_CONFIG = {
  landscape: { defaultLayout: "split", height: 1080, width: 1920 },
  portrait: { defaultLayout: "split", height: 1350, width: 1080 },
  square: { defaultLayout: "split", height: 1080, width: 1080 },
  story: { defaultLayout: "stacked", height: 1920, width: 1080 },
  wide: { defaultLayout: "split", height: 900, width: 1600 }
};
const DEFAULT_SRC = fillerBg.src ?? fillerBg;
function useUtcClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(/* @__PURE__ */ new Date());
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  return now ? now.toISOString().slice(11, 19) : "--:--:--";
}
function CornerMark({ className }) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      "aria-hidden": true,
      className: cn(
        "pointer-events-none absolute block size-4 opacity-50",
        className
      )
    },
    /* @__PURE__ */ React.createElement("span", { className: "absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" }),
    /* @__PURE__ */ React.createElement("span", { className: "absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" })
  );
}
function ChannelDot() {
  return /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "bg-midground size-1.5 animate-pulse rounded-full" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-70" }, "REC"));
}
function ScanlineOverlay() {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-hidden": true,
      className: "pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay",
      style: {
        backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 3px)"
      }
    }
  );
}
export function Poster({
  aspect = "square",
  autoPlay = "slash",
  body,
  border = true,
  channel,
  children,
  className,
  cornerMarks = true,
  eyebrow,
  headline = ["An Agent", "That Grows", "With You."],
  layout,
  scale = 1,
  seal = "MIT \xB7 2026",
  signature,
  src = DEFAULT_SRC,
  tags,
  tint,
  tintStrength,
  variant = "vibe",
  ...rest
}) {
  const config = ASPECT_CONFIG[aspect];
  const resolvedLayout = layout ?? config.defaultLayout;
  const outerProps = {
    // `text-midground` (not `text-foreground`) is the readable on-canvas
    // color across every lens. `--foreground` is really the lens's inversion
    // layer color: on dark lenses it has `fgOpacity: 0` and resolves to
    // fully-transparent via `color-mix`, which would make text invisible.
    // `--midground` always has opacity 1 and picks up each lens's accent.
    className: cn(
      "text-midground relative overflow-hidden font-sans",
      border && "border border-current/25",
      className
    ),
    style: {
      aspectRatio: `${config.width} / ${config.height}`,
      background: "var(--background)",
      containerType: "inline-size",
      fontSize: `${16 / config.width * 100}cqi`,
      maxHeight: "calc(100dvh - 8rem)",
      maxWidth: "100%",
      width: `${config.width * scale}px`
    },
    ...rest
  };
  if (variant === "vibe") {
    return /* @__PURE__ */ React.createElement("div", { ...outerProps }, /* @__PURE__ */ React.createElement(
      VibeContent,
      {
        autoPlay,
        channel,
        cornerMarks,
        signature,
        src,
        tint,
        tintStrength
      }
    ));
  }
  const headlineLines = Array.isArray(headline) ? headline : [headline];
  return /* @__PURE__ */ React.createElement("div", { ...outerProps, className: cn("flex flex-col", outerProps.className) }, /* @__PURE__ */ React.createElement(DispatchHeader, { channel }), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "relative min-h-0 min-w-0 flex-1",
        resolvedLayout === "split" ? "grid grid-cols-[3fr_2fr]" : "grid grid-rows-[3fr_2fr]"
      )
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: cn(
          "relative overflow-hidden border-current/20",
          resolvedLayout === "split" ? "border-r" : "border-b"
        ),
        style: { backgroundColor: "var(--background)" }
      },
      /* @__PURE__ */ React.createElement(
        ImageDistortion,
        {
          autoPlay,
          src,
          tint,
          tintStrength
        }
      ),
      cornerMarks && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CornerMark, { className: "top-3 left-3" }), /* @__PURE__ */ React.createElement(CornerMark, { className: "top-3 right-3" }), /* @__PURE__ */ React.createElement(CornerMark, { className: "bottom-3 left-3" }), /* @__PURE__ */ React.createElement(CornerMark, { className: "right-3 bottom-3" })),
      /* @__PURE__ */ React.createElement(ScanlineOverlay, null),
      /* @__PURE__ */ React.createElement(Small, { className: "absolute bottom-4 left-4 z-1 opacity-80" }, "Clara Agent")
    ),
    /* @__PURE__ */ React.createElement("aside", { className: "relative flex min-w-0 flex-col justify-between gap-8 p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-5" }, eyebrow && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "bg-midground/80 h-px flex-1" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-80" }, eyebrow)), children ?? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      Typography,
      {
        as: "h1",
        className: "text-[2.75em] leading-[0.95] font-bold tracking-[-0.01em]",
        expanded: true
      },
      headlineLines.map((line, i) => /* @__PURE__ */ React.createElement("span", { className: "block", key: `${line}-${i}` }, line))
    ), body && /* @__PURE__ */ React.createElement("p", { className: "text-[1.0625em] leading-[1.5] tracking-normal normal-case opacity-60" }, body))), tags && tags.length > 0 && /* @__PURE__ */ React.createElement("ul", { className: "flex flex-col gap-2 border-t border-current/15 pt-4" }, tags.map((tag, i) => /* @__PURE__ */ React.createElement(
      "li",
      {
        className: "flex items-baseline justify-between gap-3",
        key: `${tag}-${i}`
      },
      /* @__PURE__ */ React.createElement(Small, { className: "font-courier opacity-40" }, String(i + 1).padStart(3, "0")),
      /* @__PURE__ */ React.createElement(Small, { className: "opacity-80" }, tag),
      /* @__PURE__ */ React.createElement("span", { className: "mx-1 h-px flex-1 translate-y-[-3px] border-b border-dotted border-current/25" }),
      /* @__PURE__ */ React.createElement(Small, { className: "font-courier opacity-40" }, String(i + 1).padStart(2, "0"), "/", String(tags.length).padStart(2, "0"))
    ))))
  ), /* @__PURE__ */ React.createElement("footer", { className: "flex items-center justify-between gap-4 border-t border-current/20 px-6 py-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-70" }, signature, /* @__PURE__ */ React.createElement(Blink, null)), /* @__PURE__ */ React.createElement(Small, { className: "font-courier opacity-40" }, seal)));
}
function DispatchHeader({ channel }) {
  const clock = useUtcClock();
  return /* @__PURE__ */ React.createElement("header", { className: "flex items-center justify-between gap-4 border-b border-current/20 px-6 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "bg-midground size-2 rounded-sm opacity-70" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-70" }, channel)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(ChannelDot, null), /* @__PURE__ */ React.createElement(Small, { className: "font-courier opacity-50" }, clock, " UTC")));
}
function VibeContent({
  autoPlay,
  channel,
  cornerMarks,
  signature,
  src,
  tint,
  tintStrength
}) {
  return /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0" }, /* @__PURE__ */ React.createElement(
    ImageDistortion,
    {
      autoPlay,
      src,
      tint,
      tintStrength
    }
  ), cornerMarks && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CornerMark, { className: "top-5 left-5" }), /* @__PURE__ */ React.createElement(CornerMark, { className: "top-5 right-5" }), /* @__PURE__ */ React.createElement(CornerMark, { className: "bottom-5 left-5" }), /* @__PURE__ */ React.createElement(CornerMark, { className: "right-5 bottom-5" })), /* @__PURE__ */ React.createElement(ScanlineOverlay, null), channel && /* @__PURE__ */ React.createElement(Small, { className: "absolute top-5 left-10 z-1 text-[0.75em] opacity-70" }, channel), /* @__PURE__ */ React.createElement(Small, { className: "absolute right-10 bottom-5 z-1 text-[0.75em] opacity-80" }, signature));
}
