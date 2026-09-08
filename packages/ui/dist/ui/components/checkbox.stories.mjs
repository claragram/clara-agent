import { useState } from "react";
import { Checkbox } from "./checkbox.mjs";
import { Small } from "./typography/small.mjs";
function Demo({ disabled }) {
  const [checked, setChecked] = useState(false);
  return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(
    Checkbox,
    {
      checked,
      disabled,
      id: "checkbox-demo",
      onCheckedChange: setChecked
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "checkbox-demo" }, "Accept terms"));
}
const meta = {
  component: Checkbox,
  title: "Components/Forms/Checkbox"
};
export default meta;
export const Playground = { render: () => /* @__PURE__ */ React.createElement(Demo, null) };
export const Disabled = { render: () => /* @__PURE__ */ React.createElement(Demo, { disabled: true }) };
export const Checked = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Checkbox, { defaultChecked: true, id: "checkbox-checked" }), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "checkbox-checked" }, "Clone from default profile"))
};
export const Stack = {
  render: () => {
    function StackDemo() {
      const [a, setA] = useState(true);
      const [b, setB] = useState(false);
      const [c, setC] = useState(true);
      return /* @__PURE__ */ React.createElement("div", { className: "grid w-72 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Checkbox, { checked: a, id: "opt-a", onCheckedChange: setA }), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "opt-a" }, "Logging")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Checkbox, { checked: b, id: "opt-b", onCheckedChange: setB }), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "opt-b" }, "Telemetry")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Checkbox, { checked: c, id: "opt-c", onCheckedChange: setC }), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "opt-c" }, "Auto-update")));
    }
    return /* @__PURE__ */ React.createElement(StackDemo, null);
  }
};
export const NextToLabel = {
  render: () => {
    function LabeledDemo() {
      const [checked, setChecked] = useState(true);
      return /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Persist globally"), /* @__PURE__ */ React.createElement(
        Checkbox,
        {
          checked,
          id: "persist-global",
          onCheckedChange: setChecked
        }
      ));
    }
    return /* @__PURE__ */ React.createElement(LabeledDemo, null);
  }
};
