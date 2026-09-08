import { Badge } from "./badge.mjs";
import { NousGirlBadge } from "./badges/nous-girl.mjs";
const meta = {
  args: { children: "LIVE" },
  component: Badge,
  title: "Components/Feedback/Badge"
};
export default meta;
export const Default = {};
export const Row = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(Badge, null, "2.47"), /* @__PURE__ */ React.createElement(Badge, null, "LIVE"), /* @__PURE__ */ React.createElement(Badge, null, "14B"), /* @__PURE__ */ React.createElement(Badge, null, "DEMO"))
};
export const NousGirl = {
  render: () => /* @__PURE__ */ React.createElement(NousGirlBadge, { className: "h-20 w-auto" })
};
