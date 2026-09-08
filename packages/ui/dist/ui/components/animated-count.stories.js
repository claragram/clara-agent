import { useState } from "react";
import {
  AnimatedCount,
  useAnimatedCount
} from "./animated-count.mjs";
import { Button } from "./button.mjs";
import { Typography } from "./typography/index.mjs";
import { Small } from "./typography/small.mjs";
const meta = {
  args: { damping: 1, duration: 1600, value: 84210 },
  component: AnimatedCount,
  title: "Components/Feedback/AnimatedCount"
};
export default meta;
export const Playground = {
  render: (args) => /* @__PURE__ */ React.createElement(Typography, { className: "text-4xl font-bold tabular-nums", expanded: true }, /* @__PURE__ */ React.createElement(AnimatedCount, { ...args }))
};
function LiveCount() {
  const ts = useState(() => /* @__PURE__ */ new Date())[0];
  const value = useAnimatedCount(1e3, 12, ts);
  return /* @__PURE__ */ React.createElement(AnimatedCount, { duration: 500, value });
}
export const Live = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-40" }, "Live ticker (rate = 12)"), /* @__PURE__ */ React.createElement(Typography, { className: "text-4xl font-bold tabular-nums", expanded: true }, /* @__PURE__ */ React.createElement(LiveCount, null)))
};
export const Manual = {
  render: () => {
    const [value, setValue] = useState(100);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Typography, { className: "text-4xl font-bold tabular-nums", expanded: true }, /* @__PURE__ */ React.createElement(AnimatedCount, { duration: 800, value })), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(Button, { onClick: () => setValue((v) => v + 1e3) }, "+1000"), /* @__PURE__ */ React.createElement(Button, { onClick: () => setValue((v) => v + 100) }, "+100"), /* @__PURE__ */ React.createElement(Button, { onClick: () => setValue((v) => Math.max(0, v - 100)) }, "-100")));
  }
};
