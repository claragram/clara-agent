import { useRef } from "react";
import { Scramble } from "./scramble.mjs";
import { Typography } from "./typography/index.mjs";
import { Small } from "./typography/small.mjs";
const meta = {
  component: Scramble,
  title: "Components/Effects/Scramble"
};
export default meta;
export const HoverToScramble = {
  render: () => {
    const ref = useRef(null);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2", ref }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-40" }, "Hover the container"), /* @__PURE__ */ React.createElement(Typography, { as: "div", className: "text-lg", mono: true }, /* @__PURE__ */ React.createElement(Scramble, { target: ref }, "HOVER TO SCRAMBLE THIS TEXT")));
  }
};
export const Tuned = {
  render: () => {
    const ref = useRef(null);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2", ref }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-40" }, "dur=1200, spread=2"), /* @__PURE__ */ React.createElement(Typography, { as: "div", className: "text-lg", mono: true }, /* @__PURE__ */ React.createElement(Scramble, { dur: 1200, spread: 2, target: ref }, "FASTER WAVE, TIGHTER SPREAD")));
  }
};
