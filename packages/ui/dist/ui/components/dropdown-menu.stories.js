import { useState } from "react";
import { DropdownMenu } from "./dropdown-menu.mjs";
import { Small } from "./typography/small.mjs";
const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" }
];
function Demo({ direction }) {
  const [value, setValue] = useState("a");
  return /* @__PURE__ */ React.createElement(
    DropdownMenu,
    {
      direction,
      onChange: setValue,
      options: OPTIONS,
      value
    }
  );
}
const meta = {
  component: DropdownMenu,
  title: "Components/Overlays/DropdownMenu"
};
export default meta;
export const Down = { render: () => /* @__PURE__ */ React.createElement(Demo, { direction: "down" }) };
export const Up = { render: () => /* @__PURE__ */ React.createElement(Demo, { direction: "up" }) };
export const Right = { render: () => /* @__PURE__ */ React.createElement(Demo, { direction: "right" }) };
export const Left = { render: () => /* @__PURE__ */ React.createElement(Demo, { direction: "left" }) };
export const AllDirections = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex gap-10" }, ["down", "up", "right", "left"].map((direction) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1", key: direction }, /* @__PURE__ */ React.createElement(Small, { className: "capitalize opacity-40" }, direction), /* @__PURE__ */ React.createElement(Demo, { direction }))))
};
