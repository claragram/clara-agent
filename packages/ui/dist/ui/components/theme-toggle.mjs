"use client";
import { useStore } from "@nanostores/react";
import { cn } from "../../utils";
import { $lightMode, toggleLens } from "./overlays/index.mjs";
export function ThemeToggle({ className, style }) {
  const light = useStore($lightMode);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      "aria-label": light ? "Switch to dark mode" : "Switch to light mode",
      className: cn(
        "relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border border-current/25 bg-current/8 transition-colors",
        "hover:bg-current/15",
        className
      ),
      onClick: toggleLens,
      style,
      type: "button"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "absolute left-1 size-3.5 opacity-40",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement("circle", { cx: 12, cy: 12, r: 5 }),
      /* @__PURE__ */ React.createElement("path", { d: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })
    ),
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "absolute right-1 size-3.5 opacity-40",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
    ),
    /* @__PURE__ */ React.createElement(
      "span",
      {
        "aria-hidden": true,
        className: cn(
          "bg-midground absolute size-4 rounded-full",
          "transition-transform duration-200 ease-out"
        ),
        style: { transform: `translateX(${light ? 2 : 22}px)` }
      }
    )
  );
}
