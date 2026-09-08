import { forwardRef } from "react";
import { Typography } from "./index.mjs";
export const Small = forwardRef(
  (props, ref) => {
    return /* @__PURE__ */ React.createElement(Typography, { as: "small", mondwest: true, variant: "sm", ...{ ref, ...props } });
  }
);
