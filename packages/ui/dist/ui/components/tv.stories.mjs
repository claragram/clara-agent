import { Suspense } from "react";
import { TV } from "./tv.mjs";
const meta = {
  component: TV,
  parameters: {
    docs: {
      description: {
        component: "Animated WebGL brush inside an SVG television frame. Renders a fragment shader, so it only makes sense on the client."
      }
    }
  },
  title: "Components/Effects/TV"
};
export default meta;
export const Default = {
  render: () => /* @__PURE__ */ React.createElement(Suspense, null, /* @__PURE__ */ React.createElement(TV, { className: "h-64 w-64" }))
};
export const Large = {
  render: () => /* @__PURE__ */ React.createElement(Suspense, null, /* @__PURE__ */ React.createElement(TV, { className: "h-[28rem] w-[28rem]" }))
};
