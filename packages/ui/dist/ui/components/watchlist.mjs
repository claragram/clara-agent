"use client";
import { cn } from "../../utils";
import { Scramble } from "./ascii.mjs";
import { LinkIcon } from "./icons/index.mjs";
import { Typography } from "./typography/index.mjs";
const ETH_RE = /^0x[a-fA-F0-9]{40}$/;
const truncate = (a) => `${a.slice(0, 6)}${"\xB7".repeat(8)}${a.slice(-4)}`;
export function Watchlist({
  className,
  counter = false,
  items,
  scramble = false,
  ...props
}) {
  return /* @__PURE__ */ React.createElement("div", { className: cn("flex flex-col gap-3", className), ...props }, items.map(({ label, right, url }, i) => {
    const isStr = typeof label === "string";
    const eth = isStr && ETH_RE.test(label);
    const text = eth ? truncate(label) : label;
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        className: cn(
          "grid items-center gap-2.5 px-2.5 py-1.5",
          "text-display leading-[1.4]",
          "hover:bg-midground/10! hover:ring-2 hover:ring-current/20",
          "transition-all duration-500 hover:duration-0",
          "opacity-(--midground-alpha)"
        ),
        href: url,
        key: i,
        rel: "noopener noreferrer",
        style: {
          background: `color-mix(in oklch, var(--color-midground) ${10 * Math.max(0, 1 - i / 9)}%, transparent)`,
          gridTemplateColumns: [
            counter && "auto auto",
            "1fr",
            right && "auto",
            url && "auto auto"
          ].filter(Boolean).join(" ")
        },
        target: "_blank"
      },
      counter && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "text-lg tracking-[0.35em] opacity-40",
          compressed: true
        },
        String(i + 1).padStart(2, "0")
      ), /* @__PURE__ */ React.createElement("span", { className: "text-[0.8125rem] font-bold tracking-[0.4em] opacity-20" }, ":")),
      isStr ? /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "min-w-0 overflow-hidden text-lg font-bold tracking-[0.35em]",
          ...eth ? { mono: true } : { compressed: true }
        },
        scramble ? /* @__PURE__ */ React.createElement(Scramble, { delay: i * 80, text }) : text
      ) : label,
      right && /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "text-right text-sm tracking-widest opacity-40",
          mono: true
        },
        right
      ),
      url && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "text-[0.8125rem] tracking-[0.4em] opacity-20" }, ":"), /* @__PURE__ */ React.createElement(LinkIcon, { className: "text-midground size-3.5" }))
    );
  }));
}
