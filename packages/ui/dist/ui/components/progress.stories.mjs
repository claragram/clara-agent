import { useState } from "react";
import { Button } from "./button.mjs";
import { Progress } from "./progress.mjs";
const meta = {
  args: { animate: true, speed: 0.4, value: 42 },
  component: Progress,
  title: "Components/Feedback/Progress"
};
export default meta;
export const Playground = {
  args: { children: "42%" }
};
export const Stages = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement(Progress, { value: 15 }), /* @__PURE__ */ React.createElement(Progress, { value: 42 }, "42%"), /* @__PURE__ */ React.createElement(Progress, { value: 75 }, "75%"), /* @__PURE__ */ React.createElement(Progress, { value: 100 }, "Complete"))
};
export const Interactive = {
  render: () => {
    const [value, setValue] = useState(42);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Progress, { value }, value, "%"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(Button, { onClick: () => setValue((v) => Math.max(0, v - 10)) }, "-10"), /* @__PURE__ */ React.createElement(Button, { onClick: () => setValue((v) => Math.min(100, v + 10)) }, "+10")));
  }
};
