import {
  TerminalDemo
} from "./terminal-demo.mjs";
const SEQUENCE = [
  { text: "\u276F ", type: "prompt" },
  {
    delay: 30,
    text: "Research the latest approaches to GRPO training and write a summary",
    type: "type"
  },
  { ms: 600, type: "pause" },
  {
    lines: [
      "",
      '<span class="opacity-50">  web_search "GRPO reinforcement learning"         1.2s</span>',
      '<span class="opacity-50">  web_extract arxiv.org/abs/2402.03300             3.1s</span>',
      '<span class="opacity-50">  write_file ~/research/grpo-summary.md            0.1s</span>'
    ],
    type: "output"
  },
  { ms: 500, type: "pause" },
  {
    lines: [
      "",
      `<span class="opacity-70">Done! I've written a summary covering:</span>`,
      "",
      `<span class="opacity-70">  <span class="text-midground">\u2713</span> GRPO's group-relative advantage</span>`,
      '<span class="opacity-70">  <span class="text-midground">\u2713</span> Comparison with PPO/DPO</span>',
      "",
      '<span class="opacity-70">Saved to</span> <span class="text-midground">~/research/grpo-summary.md</span>'
    ],
    type: "output"
  },
  { ms: 2500, type: "pause" },
  { type: "clear" }
];
const meta = {
  args: { label: "Clara", sequence: SEQUENCE },
  component: TerminalDemo,
  title: "Components/Data Display/TerminalDemo"
};
export default meta;
export const Default = {
  render: (args) => /* @__PURE__ */ React.createElement("div", { className: "w-[640px]" }, /* @__PURE__ */ React.createElement(TerminalDemo, { ...args }))
};
export const TallerWindow = {
  args: { height: 480, label: "shell" },
  render: (args) => /* @__PURE__ */ React.createElement("div", { className: "w-[640px]" }, /* @__PURE__ */ React.createElement(TerminalDemo, { ...args }))
};
