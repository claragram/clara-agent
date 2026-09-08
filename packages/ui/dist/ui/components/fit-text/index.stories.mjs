import { FitText } from "../fit-text/index.mjs";
const meta = {
  args: { children: "Fit Text", max: "infinity * 1px", min: "1em" },
  component: FitText,
  title: "Components/Effects/FitText"
};
export default meta;
export const Playground = {};
export const Fills = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement(FitText, { className: "font-sans font-bold" }, "Design System"))
};
export const CappedMax = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement(FitText, { className: "font-mondwest", max: "4rem" }, "Capped max at 4rem"))
};
