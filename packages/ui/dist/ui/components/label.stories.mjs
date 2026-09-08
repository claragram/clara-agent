import { Input } from "./input.mjs";
import { Label } from "./label.mjs";
const meta = {
  component: Label,
  title: "Components/Forms/Label"
};
export default meta;
export const Playground = {
  render: () => /* @__PURE__ */ React.createElement(Label, null, "Field label")
};
export const WithInput = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "grid w-64 gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "label-demo" }, "API key"), /* @__PURE__ */ React.createElement(Input, { id: "label-demo", type: "password", placeholder: "sk-\u2026" }))
};
