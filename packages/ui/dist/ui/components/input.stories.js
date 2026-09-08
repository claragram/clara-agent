import { Input } from "./input.mjs";
import { Label } from "./label.mjs";
const meta = {
  component: Input,
  title: "Components/Forms/Input"
};
export default meta;
export const Playground = {
  render: () => /* @__PURE__ */ React.createElement(Input, { placeholder: "Enter a value\u2026" })
};
export const Disabled = {
  render: () => /* @__PURE__ */ React.createElement(Input, { disabled: true, placeholder: "Disabled", value: "locked" })
};
export const WithLabel = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "grid w-64 gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "demo-input" }, "Model name"), /* @__PURE__ */ React.createElement(Input, { id: "demo-input", placeholder: "e.g. gpt-4o" }))
};
export const NumberInput = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "grid w-40 gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "demo-number" }, "Temperature"), /* @__PURE__ */ React.createElement(Input, { id: "demo-number", type: "number", step: 0.1, defaultValue: 0.7 }))
};
