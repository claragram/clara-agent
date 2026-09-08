import { cn } from "../../utils";
export function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      "aria-orientation": orientation,
      role: "separator",
      className: cn(
        "shrink-0 bg-midground/15",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      ),
      ...props
    }
  );
}
