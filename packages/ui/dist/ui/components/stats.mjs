import React from "react";
import { cn } from "../../utils";
import { Typography } from "./typography/index.mjs";
export function Stats({ className, items, flip, ...props }) {
  return /* @__PURE__ */ React.createElement("div", { className: cn("flex w-full flex-col gap-5", className), ...props }, items.map(({ label, value }) => {
    const valueText = /* @__PURE__ */ React.createElement(
      Typography,
      {
        className: "text-xs leading-[1.4] tracking-widest",
        expanded: true
      },
      typeof value === "string" ? value : value.node
    );
    const labelText = /* @__PURE__ */ React.createElement(Typography, { className: "leading-none tracking-[0.2em] opacity-60", mono: true }, typeof label === "string" ? label : label.node);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "text-midground text-display grid grid-cols-[auto_1fr_auto] items-center gap-2.5",
        key: (typeof label === "string" ? label : label.key) + "@@@" + (typeof value === "string" ? value : value.key)
      },
      flip ? labelText : valueText,
      /* @__PURE__ */ React.createElement(
        Typography,
        {
          className: "min-w-0 overflow-hidden text-[13px] leading-[1.4] tracking-[0.4em] opacity-20",
          expanded: true
        },
        "\xB7".repeat(100)
      ),
      flip ? valueText : labelText
    );
  }));
}
