import { AsciiSkeleton, Scramble } from "./ascii.mjs";
import { Typography } from "./typography/index.mjs";
const meta = {
  title: "Components/Effects/Ascii"
};
export default meta;
export const RevealScramble = {
  render: () => /* @__PURE__ */ React.createElement(Typography, { className: "text-lg", mono: true }, /* @__PURE__ */ React.createElement(Scramble, { delay: 200, text: "PSYCHE NETWORK" }))
};
export const Skeleton = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(AsciiSkeleton, { cols: 20, rows: 1 }), /* @__PURE__ */ React.createElement(AsciiSkeleton, { cols: 40, rows: 3 }), /* @__PURE__ */ React.createElement(AsciiSkeleton, { cols: 60, rows: 5, speed: 120 }))
};
