import { Separator } from "./separator.mjs";
import { Small } from "./typography/small.mjs";
const meta = {
  component: Separator,
  title: "Components/Layout/Separator"
};
export default meta;
export const Horizontal = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "grid w-64 gap-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Section A"), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Section B"))
};
export const Vertical = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex h-8 items-center gap-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Left"), /* @__PURE__ */ React.createElement(Separator, { orientation: "vertical" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Right"))
};
