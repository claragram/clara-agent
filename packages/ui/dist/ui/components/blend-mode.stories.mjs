import { BlendMode } from "./blend-mode.mjs";
const meta = {
  component: BlendMode,
  title: "Components/Effects/BlendMode"
};
export default meta;
export const Static = {
  args: {
    background: "mg/0.1",
    children: "BlendMode static",
    className: "p-3",
    color: "fg"
  }
};
export const RenderProp = {
  render: () => /* @__PURE__ */ React.createElement(BlendMode, { background: "mg/0.05", color: "mg" }, (colors) => /* @__PURE__ */ React.createElement("div", { className: "p-3", style: colors }, "Render-prop variant (receives `", "{ backgroundColor, color }", "`)"))
};
