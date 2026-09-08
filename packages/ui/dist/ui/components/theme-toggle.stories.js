import { useState } from "react";
import { HamburgerIcon } from "./icons/index.mjs";
import { ThemeToggle } from "./theme-toggle.mjs";
import { Small } from "./typography/small.mjs";
const meta = {
  component: ThemeToggle,
  title: "Components/Layout/ThemeToggle"
};
export default meta;
export const Default = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "Theme"), /* @__PURE__ */ React.createElement(ThemeToggle, null))
};
export const WithHamburger = {
  name: "Beside Hamburger",
  render: () => {
    const [open, setOpen] = useState(false);
    return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(ThemeToggle, null), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": open ? "Close menu" : "Open menu",
        className: "cursor-pointer bg-transparent p-2",
        onClick: () => setOpen((v) => !v),
        type: "button"
      },
      /* @__PURE__ */ React.createElement(HamburgerIcon, { open })
    ));
  }
};
