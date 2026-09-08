import { Blink } from "./blink.mjs";
import { Typography } from "./typography/index.mjs";
import { Small } from "./typography/small.mjs";
const meta = {
  component: Blink,
  title: "Components/Effects/Blink"
};
export default meta;
export const Cursors = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "group flex flex-col gap-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-40" }, "Hover to see the cursors blink"), /* @__PURE__ */ React.createElement(Typography, { className: "relative", mono: true }, "Block", /* @__PURE__ */ React.createElement(Blink, { className: "absolute", cursor: "block" })), /* @__PURE__ */ React.createElement(Typography, { className: "relative", mono: true }, "Line", /* @__PURE__ */ React.createElement(Blink, { className: "absolute", cursor: "line" })))
};
