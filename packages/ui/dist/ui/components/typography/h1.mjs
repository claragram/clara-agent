import { forwardRef } from "react";
import { cn } from "../../../utils";
import { Typography } from "./index.mjs";
export const H1 = forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      Typography,
      {
        as: "h1",
        className: cn("font-bold", className),
        variant: "xl",
        ...{ ref, ...props }
      }
    );
  }
);
