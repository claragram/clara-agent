import { Spinner } from "./spinner.mjs";
import { Small } from "./typography/small.mjs";
const NAMES = [
  "braille",
  "braillewave",
  "dna",
  "scan",
  "rain",
  "scanline",
  "pulse",
  "snake",
  "sparkle",
  "cascade",
  "columns",
  "orbit",
  "breathe",
  "waverows",
  "checkerboard",
  "helix",
  "fillsweep",
  "diagswipe"
];
const meta = {
  component: Spinner,
  title: "Components/Feedback/Spinner"
};
export default meta;
export const Playground = { render: () => /* @__PURE__ */ React.createElement(Spinner, null) };
export const InlineWithText = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-midground/70" }, /* @__PURE__ */ React.createElement(Spinner, null), " Loading model info\u2026")
};
export const Sizes = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-end gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ React.createElement(Spinner, { className: "text-xs" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "xs")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ React.createElement(Spinner, { className: "text-sm" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "sm")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ React.createElement(Spinner, { className: "text-base" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "base")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ React.createElement(Spinner, { className: "text-2xl" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "2xl")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-2" }, /* @__PURE__ */ React.createElement(Spinner, { className: "text-4xl" }), /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "4xl")))
};
export const Tones = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 text-base" }, /* @__PURE__ */ React.createElement(Spinner, null), /* @__PURE__ */ React.createElement(Spinner, { className: "text-warning" }), /* @__PURE__ */ React.createElement(Spinner, { className: "text-success" }), /* @__PURE__ */ React.createElement(Spinner, { className: "text-destructive" }), /* @__PURE__ */ React.createElement(Spinner, { className: "text-midground/40" }))
};
export const Gallery = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-x-8 gap-y-3 text-base" }, NAMES.map((name) => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3", key: name }, /* @__PURE__ */ React.createElement(Spinner, { name }), /* @__PURE__ */ React.createElement(Small, { className: "font-mono opacity-60" }, name))))
};
