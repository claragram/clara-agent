"use client";
import { cn } from "../../utils";
export function Blink({ className, cursor = "block" }) {
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      className: cn(
        "blink hidden group-hover:inline-block",
        "dither ml-1 w-[1.2ch]",
        cursor === "block" ? "-mb-[0.15em] h-[1.1em]" : "-mb-[0.1em] h-[2px]",
        className
      )
    }
  );
}
