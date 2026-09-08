import { expect } from "storybook/test";
import { Button } from "./button.mjs";
import { ArrowIcon, LinkIcon, SearchIcon } from "./icons/index.mjs";
const meta = {
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
    invert: { control: "boolean" },
    outlined: { control: "boolean" }
  },
  args: { children: "Normal", disabled: false, invert: false, outlined: false },
  component: Button,
  title: "Components/Forms/Button"
};
export default meta;
export const Playground = {
  args: { prefix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" }) }
};
export const AllVariants = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(Button, { prefix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" }) }, "Normal"), /* @__PURE__ */ React.createElement(Button, { invert: true, prefix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" }) }, "Inverted"), /* @__PURE__ */ React.createElement(Button, { outlined: true, prefix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" }) }, "Outlined"), /* @__PURE__ */ React.createElement(Button, { invert: true, outlined: true, prefix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" }) }, "Out + Inv"))
};
export const WithIcons = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(Button, { suffix: /* @__PURE__ */ React.createElement(LinkIcon, null) }, "Suffix"), /* @__PURE__ */ React.createElement(
    Button,
    {
      prefix: /* @__PURE__ */ React.createElement(SearchIcon, null),
      suffix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" })
    },
    "Prefix + Suffix"
  ), /* @__PURE__ */ React.createElement(Button, { disabled: true, prefix: /* @__PURE__ */ React.createElement(ArrowIcon, { direction: "right" }) }, "Disabled"))
};
export const CssCheck = {
  args: { children: "Danger", destructive: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /danger/i });
    await expect(getComputedStyle(button).backgroundColor).toBe("rgb(251, 44, 54)");
  }
};
