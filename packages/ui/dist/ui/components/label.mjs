import { cn } from "../../utils";
export function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    "label",
    {
      className: cn(
        "font-mondwest text-xs tracking-[0.1em] uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      ),
      ...props
    }
  );
}
