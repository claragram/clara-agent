import { useState } from "react";
import { Switch } from "./switch.mjs";
import { Small } from "./typography/small.mjs";
function Demo({ disabled }) {
  const [checked, setChecked] = useState(false);
  return /* @__PURE__ */ React.createElement(Switch, { checked, disabled, onCheckedChange: setChecked });
}
const meta = {
  component: Switch,
  title: "Components/Forms/Switch"
};
export default meta;
export const Playground = { render: () => /* @__PURE__ */ React.createElement(Demo, null) };
export const Disabled = { render: () => /* @__PURE__ */ React.createElement(Demo, { disabled: true }) };
export const NextToLabel = {
  render: () => {
    function LabeledDemo() {
      const [checked, setChecked] = useState(true);
      return /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Enable feature"), /* @__PURE__ */ React.createElement(Switch, { checked, onCheckedChange: setChecked }));
    }
    return /* @__PURE__ */ React.createElement(LabeledDemo, null);
  }
};
export const Stack = {
  render: () => {
    function StackDemo() {
      const [a, setA] = useState(true);
      const [b, setB] = useState(false);
      const [c, setC] = useState(true);
      return /* @__PURE__ */ React.createElement("div", { className: "grid w-64 gap-3" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Logging"), /* @__PURE__ */ React.createElement(Switch, { checked: a, onCheckedChange: setA })), /* @__PURE__ */ React.createElement("label", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Telemetry"), /* @__PURE__ */ React.createElement(Switch, { checked: b, onCheckedChange: setB })), /* @__PURE__ */ React.createElement("label", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60 uppercase tracking-wider" }, "Auto-update"), /* @__PURE__ */ React.createElement(Switch, { checked: c, onCheckedChange: setC })));
    }
    return /* @__PURE__ */ React.createElement(StackDemo, null);
  }
};
