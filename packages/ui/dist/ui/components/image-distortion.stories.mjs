import { useState } from "react";
import fillerBg from "../../assets/filler-bg0.webp";
import { Button } from "./button.mjs";
import { ImageDistortion } from "./image-distortion.mjs";
const meta = {
  args: { active: true, src: fillerBg.src ?? fillerBg },
  component: ImageDistortion,
  title: "Components/Effects/ImageDistortion"
};
export default meta;
function Frame({ children }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "bg-background-base relative h-[420px] w-[560px] overflow-hidden border border-current/20",
      style: { backgroundColor: "var(--background)" }
    },
    children
  );
}
export const Default = {
  render: (args) => /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(ImageDistortion, { ...args }))
};
export const Tinted = {
  args: { tint: "#88ccaa" },
  render: (args) => /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(ImageDistortion, { ...args }))
};
export const TintStrength = {
  render: () => {
    const src = fillerBg.src ?? fillerBg;
    return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-4" }, [
      ["#88ccaa", "mint"],
      ["#ccaa88", "amber"],
      ["#ff4444", "fatal"]
    ].map(([tint, label]) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2", key: label }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase tracking-widest opacity-50" }, label), /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(
      ImageDistortion,
      {
        src,
        tint,
        tintStrength: { active: 0.55, inactive: 0.25 }
      }
    )))));
  }
};
export const AutoPlay = {
  render: () => {
    const src = fillerBg.src ?? fillerBg;
    return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-4" }, ["slash", "gentle", "aggressive"].map((pattern) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2", key: pattern }, /* @__PURE__ */ React.createElement("span", { className: "text-xs uppercase tracking-widest opacity-50" }, pattern), /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(ImageDistortion, { autoPlay: pattern, src, tint: "#ccaa88" })))));
  }
};
export const ToggleActive = {
  render: () => {
    const [active, setActive] = useState(true);
    const src = fillerBg.src ?? fillerBg;
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(ImageDistortion, { active, src, tint: "#ff4444" })), /* @__PURE__ */ React.createElement(Button, { onClick: () => setActive((v) => !v) }, active ? "Active" : "Inactive"));
  }
};
