import { forwardRef } from "react";
import { cn } from "../../../utils";
import { Typography } from "./index.mjs";
export const H2 = forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      Typography,
      {
        as: "h2",
        className: cn("font-bold", className),
        variant: "lg",
        ...{ ref, ...props }
      }
    );
  }
);
