import { cn } from "../../../utils";
export function ChevronIcon({
  className,
  direction = "left",
  ...props
}) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: cn(
        direction === "left" && "rotate-90",
        direction === "right" && "-rotate-90",
        className
      ),
      fill: "none",
      viewBox: "0 0 8 13",
      ...props
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        clipRule: "evenodd",
        d: "M0 7.49765h5V4.9969H1e-7z",
        fill: "currentColor",
        fillRule: "evenodd"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        clipRule: "evenodd",
        d: "M2.5 2.49765v7.5h2.50075v-7.5z",
        fill: "currentColor",
        fillRule: "evenodd"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        clipRule: "evenodd",
        d: "M5 .0000031V2.4996h2.4996V.0000032zM5 9.99805v2.49965h2.4996V9.99805z",
        fill: "currentColor",
        fillRule: "evenodd"
      }
    )
  );
}
