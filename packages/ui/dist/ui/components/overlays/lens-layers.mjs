"use client";
import { useEffect } from "react";
import { useSmoothControls } from "../../../hooks/use-smooth-controls";
import { colorMix } from "../../../utils/color";
import fillerBg from "../../../assets/filler-bg0.webp";
import { BLEND_MODES } from "./blend-modes.mjs";
import { $lightMode, LENS_0, LENS_5I, toggleLens } from "./lens.mjs";
const LAYER = "pointer-events-none fixed inset-0";
export function Lens({ dark, initial }) {
  const base = initial?.Lens ?? (dark ? LENS_0.Lens : LENS_5I.Lens);
  const lens = useSmoothControls(
    "Lens",
    {
      bgBlend: { options: BLEND_MODES, value: base.bgBlend },
      bgColor: { value: base.bgColor },
      bgOpacity: { max: 1, min: 0, step: 0.01, value: base.bgOpacity },
      fgBlend: { options: BLEND_MODES, value: "difference" },
      fgColor: { value: base.fgColor },
      fgOpacity: { max: 1, min: 0, step: 0.01, value: base.fgOpacity },
      fillerBlend: { options: BLEND_MODES, value: "difference" },
      fillerOpacity: { max: 1, min: 0, step: 0.01, value: base.fillerOpacity },
      mgColor: { value: base.mgColor },
      mgOpacity: { max: 1, min: 0, step: 0.01, value: base.mgOpacity }
    },
    { collapsed: false }
  );
  useEffect(() => {
    $lightMode.set(!dark);
  }, [dark]);
  useEffect(() => {
    const s = document.documentElement.style;
    for (const [name, color, alpha] of [
      ["foreground", lens.fgColor, lens.fgOpacity],
      ["midground", lens.mgColor, lens.mgOpacity],
      ["background", lens.bgColor, lens.bgOpacity]
    ]) {
      s.setProperty(`--${name}`, colorMix(color, alpha));
      s.setProperty(`--${name}-base`, color);
      s.setProperty(`--${name}-alpha`, `${alpha}`);
    }
  }, [lens]);
  useEffect(() => {
    const handle = (e) => e.key === "x" && toggleLens();
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: LAYER,
      style: {
        backgroundColor: colorMix(lens.fgColor, lens.fgOpacity),
        mixBlendMode: lens.fgBlend,
        zIndex: 100
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: LAYER,
      style: {
        mixBlendMode: lens.fillerBlend,
        opacity: lens.fillerOpacity,
        zIndex: 2
      }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        alt: "",
        className: "h-[150dvh] w-auto min-w-dvw object-cover object-top-left invert",
        fetchPriority: "low",
        height: 1024,
        src: fillerBg.src,
        width: 1024
      }
    )
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: LAYER,
      style: {
        backgroundColor: colorMix(lens.bgColor, lens.bgOpacity),
        mixBlendMode: lens.bgBlend,
        zIndex: 1
      }
    }
  ));
}
