import { HoverBg } from "./hover-bg.mjs";
import { Typography } from "./typography/index.mjs";
const meta = {
  component: HoverBg,
  title: "Components/Layout/HoverBg"
};
export default meta;
export const Row = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, ["Alpha", "Beta", "Gamma"].map((label) => /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "group relative flex items-center justify-center px-6 py-3",
      key: label
    },
    /* @__PURE__ */ React.createElement(Typography, { mono: true }, label),
    /* @__PURE__ */ React.createElement(HoverBg, null)
  )))
};
