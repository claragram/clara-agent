import { useState } from "react";
import {
  FilterGroup,
  Segmented
} from "./segmented.mjs";
const DENSITY_OPTIONS = [
  { label: "Compact", value: "compact" },
  { label: "Comfortable", value: "comfortable" },
  { label: "Spacious", value: "spacious" }
];
const SEVERITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warn", value: "warn" },
  { label: "Error", value: "error" }
];
function Demo({ size }) {
  const [value, setValue] = useState("comfortable");
  return /* @__PURE__ */ React.createElement(
    Segmented,
    {
      onChange: setValue,
      options: DENSITY_OPTIONS,
      size,
      value
    }
  );
}
const meta = {
  component: Segmented,
  title: "Components/Forms/Segmented"
};
export default meta;
export const Playground = { render: () => /* @__PURE__ */ React.createElement(Demo, null) };
export const Medium = { render: () => /* @__PURE__ */ React.createElement(Demo, { size: "md" }) };
export const TwoOptions = {
  render: () => {
    function TwoOptionsDemo() {
      const [value, setValue] = useState("on");
      return /* @__PURE__ */ React.createElement(
        Segmented,
        {
          onChange: setValue,
          options: [
            { label: "On", value: "on" },
            { label: "Off", value: "off" }
          ],
          value
        }
      );
    }
    return /* @__PURE__ */ React.createElement(TwoOptionsDemo, null);
  }
};
export const InFilterGroup = {
  render: () => {
    function FilterDemo() {
      const [severity, setSeverity] = useState("all");
      const [density, setDensity] = useState("comfortable");
      return /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-6" }, /* @__PURE__ */ React.createElement(FilterGroup, { label: "Severity" }, /* @__PURE__ */ React.createElement(
        Segmented,
        {
          onChange: setSeverity,
          options: SEVERITY_OPTIONS,
          value: severity
        }
      )), /* @__PURE__ */ React.createElement(FilterGroup, { label: "Density" }, /* @__PURE__ */ React.createElement(
        Segmented,
        {
          onChange: setDensity,
          options: DENSITY_OPTIONS,
          value: density
        }
      )));
    }
    return /* @__PURE__ */ React.createElement(FilterDemo, null);
  }
};
