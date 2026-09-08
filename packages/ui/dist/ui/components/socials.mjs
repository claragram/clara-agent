import { cn } from "../../utils";
export function Socials({ className, items, onNavigate, ...rest }) {
  return /* @__PURE__ */ React.createElement("div", { className: cn("flex items-center gap-3", className), ...rest }, items.map(({ external = true, href, icon: Icon, label, onClick }) => /* @__PURE__ */ React.createElement(
    "a",
    {
      className: "opacity-60 transition-opacity hover:opacity-100",
      href,
      key: label,
      onClick: (e) => {
        onClick?.(e);
        onNavigate?.();
      },
      rel: external ? "noopener noreferrer" : void 0,
      target: external ? "_blank" : void 0,
      title: label
    },
    /* @__PURE__ */ React.createElement(Icon, null)
  )));
}
