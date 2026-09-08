"use client";
import { cn } from "../../utils";
import { ImageDistortion } from "./image-distortion.mjs";
import { Typography } from "./typography/index.mjs";
export function TierCard({
  badge,
  bullets,
  className,
  image,
  isCurrent = false,
  onSelect,
  overlay,
  price,
  selected = false,
  tint,
  tintStrength,
  title
}) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: cn(
        "group relative flex w-full cursor-pointer flex-col border border-current/20",
        "text-left transition-colors duration-300",
        selected && "border-midground/60",
        isCurrent && !selected && "border-midground/30",
        className
      ),
      onClick: onSelect,
      type: "button"
    },
    /* @__PURE__ */ React.createElement(
      "span",
      {
        "aria-hidden": true,
        className: cn(
          "arc-border transition-opacity duration-200",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )
      }
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "relative aspect-[3/4] min-h-0 w-full flex-1 overflow-hidden",
        style: { backgroundColor: "var(--background)" }
      },
      /* @__PURE__ */ React.createElement(
        ImageDistortion,
        {
          active: selected,
          src: image,
          tint,
          tintStrength
        }
      ),
      overlay && /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "pointer-events-none absolute inset-0",
          style: { backgroundColor: overlay, mixBlendMode: "color" }
        }
      ),
      /* @__PURE__ */ React.createElement("div", { className: "pointer-events-none absolute inset-0 z-[1] flex flex-col justify-between p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-0.5" }, /* @__PURE__ */ React.createElement(
        Typography,
        {
          variant: "sm",
          className: cn(
            "block drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] text-[1.2rem]",
            "transition-colors",
            selected && "text-midground"
          ),
          style: selected ? { mixBlendMode: "plus-lighter" } : void 0
        },
        title,
        badge && /* @__PURE__ */ React.createElement("span", { className: "ml-1 opacity-50" }, badge)
      ), price.secondary ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "block text-md line-through opacity-50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
          expanded: true,
          style: { mixBlendMode: "plus-lighter" }
        },
        price.secondary,
        price.secondarySuffix && /* @__PURE__ */ React.createElement("span", { className: "text-[1rem]" }, price.secondarySuffix)
      ), /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "block text-xl font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
          expanded: true,
          style: { mixBlendMode: "plus-lighter" }
        },
        price.primary,
        price.primarySuffix && /* @__PURE__ */ React.createElement("span", { className: "text-[1rem] opacity-60" }, " ", price.primarySuffix)
      )) : /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "block text-xl font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
          expanded: true,
          style: { mixBlendMode: "plus-lighter" }
        },
        price.primary,
        price.primarySuffix && /* @__PURE__ */ React.createElement("span", { className: "text-[1rem] opacity-60" }, price.primarySuffix)
      )), bullets.length > 0 && /* @__PURE__ */ React.createElement("ul", { className: "flex flex-col gap-1" }, bullets.map((bullet, i) => /* @__PURE__ */ React.createElement(
        "li",
        {
          className: cn(
            "font-courier text-display text-[1rem] leading-tight tracking-tight",
            "drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          ),
          key: typeof bullet === "string" ? bullet : i
        },
        "\xB7 ",
        bullet
      ))))
    )
  );
}
