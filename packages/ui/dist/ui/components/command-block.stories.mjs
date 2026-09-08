import {
  CommandBlock,
  CopyButton
} from "./command-block.mjs";
const meta = {
  args: {
    code: "curl -fsSL https://agent.claraship.com/install.sh | bash",
    label: "1. Install"
  },
  component: CommandBlock,
  title: "Components/Data Display/CommandBlock"
};
export default meta;
export const Default = {
  render: (args) => /* @__PURE__ */ React.createElement("div", { className: "w-[520px]" }, /* @__PURE__ */ React.createElement(CommandBlock, { ...args }))
};
export const TwoStep = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex w-[520px] flex-col gap-3" }, /* @__PURE__ */ React.createElement(
    CommandBlock,
    {
      code: "curl -fsSL https://agent.claraship.com/install.sh | bash",
      label: "1. Install"
    }
  ), /* @__PURE__ */ React.createElement(CommandBlock, { code: "clara setup", label: "2. Configure" }))
};
export const StandaloneButton = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-courier text-xs opacity-60" }, 'echo "hello world"'), /* @__PURE__ */ React.createElement(CopyButton, { text: "echo 'hello world'" }))
};
