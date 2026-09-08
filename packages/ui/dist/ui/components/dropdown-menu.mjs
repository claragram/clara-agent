"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../utils";
const font = "font-mondwest text-[.9375rem] leading-[1.4] tracking-[0.1875rem]";
export function DropdownMenu({
  className,
  direction = "down",
  onChange,
  options,
  value
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const anchor = `--dropdown-${id.replace(/:/g, "")}`;
  const panelStyle = {
    position: "fixed",
    positionAnchor: anchor,
    positionTryFallbacks: direction === "left" || direction === "right" ? "flip-inline, flip-block" : "flip-block, flip-inline",
    ...direction === "up" && {
      left: "calc(anchor(left) - 0.5rem)",
      top: "calc(anchor(top) + 1rem)",
      transform: "translateY(-100%)"
    },
    ...direction === "right" && {
      left: "calc(anchor(right))",
      top: "calc(anchor(top) - 0.5rem)"
    },
    ...direction === "left" && {
      left: "calc(anchor(left) - 1px)",
      top: "calc(anchor(top) - 0.5rem)",
      transform: "translateX(-100%)"
    },
    ...direction === "down" && {
      left: "calc(anchor(left) - 0.5rem)",
      top: "calc(anchor(top) - 0.5rem)"
    }
  };
  useEffect(() => {
    if (!open) {
      return;
    }
    const ac = new AbortController();
    document.addEventListener(
      "mousedown",
      (e) => {
        if (!ref.current?.contains(e.target)) {
          setOpen(false);
        }
      },
      { signal: ac.signal }
    );
    return () => ac.abort();
  }, [open]);
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      className: cn("relative inline-block align-top", className),
      ref
    },
    /* @__PURE__ */ React.createElement(
      "span",
      {
        className: cn(font, "inline-block cursor-pointer hover:underline"),
        onClick: () => setOpen(!open),
        style: { anchorName: anchor }
      },
      options.find((o) => o.value === value)?.label ?? value,
      " ",
      open ? "\u2191" : "\u2193"
    ),
    open && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "bg-background-base z-50 flex flex-col",
        style: panelStyle
      },
      options.map((o) => /* @__PURE__ */ React.createElement(
        "span",
        {
          className: cn(
            font,
            "block cursor-pointer p-2 whitespace-nowrap",
            o.value === value ? "underline" : "hover:bg-midground/10"
          ),
          key: o.value,
          onClick: () => {
            onChange(o.value);
            setOpen(false);
          }
        },
        o.label
      ))
    )
  );
}
