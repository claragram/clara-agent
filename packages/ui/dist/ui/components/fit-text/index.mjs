"use client";
import { createElement } from "react";
import { cn, polyRef } from "../../../utils";
export const FitText = polyRef(
  ({ as, children, className, max, min = "1em", style: baseStyle, ...rest }, ref) => {
    if (typeof children !== "string") {
      return null;
    }
    const style = {
      "--fit-max": max ?? "infinity * 1px",
      "--fit-min": min,
      ...baseStyle
    };
    return createElement(
      as ?? "span",
      { ...rest, className: cn("fit-text", className), ref, style },
      /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", null, children)), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, children))
    );
  }
);
