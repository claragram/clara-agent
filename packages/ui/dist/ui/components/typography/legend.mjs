import { cn } from "../../../utils";
import { Small } from "./small.mjs";
export function Legend({
  children,
  className,
  label,
  sub,
  ...props
}) {
  return /* @__PURE__ */ React.createElement("hgroup", { className: cn("flex flex-col gap-2", className), ...props }, /* @__PURE__ */ React.createElement(Small, null, label), sub && /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "- ", sub), children);
}
