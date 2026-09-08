import { useState } from "react";
import { Select, SelectOption } from "./select.mjs";
import { Small } from "./typography/small.mjs";
const PROVIDERS = [
  { label: "OpenAI", value: "openai" },
  { label: "Anthropic", value: "anthropic" },
  { label: "Google", value: "google" },
  { label: "Mistral", value: "mistral" },
  { label: "xAI", value: "xai" }
];
function Demo({
  disabled,
  placeholder
}) {
  const [value, setValue] = useState("anthropic");
  return /* @__PURE__ */ React.createElement("div", { className: "w-72" }, /* @__PURE__ */ React.createElement(
    Select,
    {
      disabled,
      onValueChange: setValue,
      placeholder,
      value
    },
    PROVIDERS.map((p) => /* @__PURE__ */ React.createElement(SelectOption, { key: p.value, value: p.value }, p.label))
  ));
}
const meta = {
  component: Select,
  title: "Components/Forms/Select"
};
export default meta;
export const Playground = { render: () => /* @__PURE__ */ React.createElement(Demo, null) };
export const Disabled = { render: () => /* @__PURE__ */ React.createElement(Demo, { disabled: true }) };
export const Empty = {
  render: () => {
    function EmptyDemo() {
      const [value, setValue] = useState("");
      return /* @__PURE__ */ React.createElement("div", { className: "w-72" }, /* @__PURE__ */ React.createElement(
        Select,
        {
          onValueChange: setValue,
          placeholder: "Choose a provider\u2026",
          value
        },
        PROVIDERS.map((p) => /* @__PURE__ */ React.createElement(SelectOption, { key: p.value, value: p.value }, p.label))
      ));
    }
    return /* @__PURE__ */ React.createElement(EmptyDemo, null);
  }
};
export const NextToLabel = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "grid w-72 gap-2" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Provider"), /* @__PURE__ */ React.createElement(Demo, null))
};
