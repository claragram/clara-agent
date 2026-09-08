import { Stats } from "./stats.mjs";
const meta = {
  component: Stats,
  title: "Components/Feedback/Stats"
};
export default meta;
export const Default = {
  args: {
    items: [
      { label: "Parameters", value: "36.2b" },
      { label: "Checkpoint", value: "Scratch" },
      { label: "HfAuto", value: "Auto" },
      { label: "Type", value: "Text" },
      { label: "Loss", value: "0.56" }
    ]
  }
};
