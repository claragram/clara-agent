"use client";
import { useCallback, useState } from "react";
import { cn } from "../../utils";
import { Small } from "./typography/small.mjs";
export function CopyButton({
  children,
  className,
  copiedLabel = "Copied!",
  label = "Copy",
  resetDelayMs = 2e3,
  text
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelayMs);
    });
  }, [resetDelayMs, text]);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: cn(
        "font-courier text-display cursor-pointer border-none bg-transparent text-xs",
        "tracking-widest",
        "hover:text-midground tap-highlight-transparent transition-colors",
        "flex items-center justify-center",
        copied ? "text-midground" : "text-text-secondary",
        className
      ),
      onClick: handleCopy,
      type: "button"
    },
    children ?? (copied ? copiedLabel : label)
  );
}
export function CommandBlock({ className, code, label }) {
  return /* @__PURE__ */ React.createElement("div", { className: cn("flex flex-col gap-1", className) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, label), /* @__PURE__ */ React.createElement(CopyButton, { text: code })), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "bg-background/40 font-courier border border-current/20",
        "px-3 py-2 text-[0.6875rem] leading-relaxed lowercase"
      )
    },
    /* @__PURE__ */ React.createElement("code", { className: "break-all" }, code)
  ));
}
