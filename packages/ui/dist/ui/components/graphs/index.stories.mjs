import { BarChart, LineChart } from "../graphs/index.mjs";
import { Small } from "../typography/small.mjs";
const LINE_DATA = ["primary", "secondary", "tertiary"].flatMap(
  (series, si) => [0, 5e4, 1e5, 15e4].map((label, i) => ({
    label,
    series,
    value: 0.15 + si * 0.1 + i % 2 * 0.05 + Math.sin(i + si) * 0.08
  }))
);
const BAR_DATA = (() => {
  let x = 42;
  const f = () => (x = (1103515245 * x + 12345) % 2147483648) / 2147483648;
  return Array.from({ length: 100 }, (_, i) => ({
    label: i / 99 * 15e4,
    value: f() * 10
  }));
})();
const meta = {
  parameters: { layout: "padded" },
  title: "Components/Data Display/Graphs"
};
export default meta;
export const Line = {
  render: () => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Small, { className: "mb-5 block opacity-50" }, "LineChart"), /* @__PURE__ */ React.createElement(
    LineChart,
    {
      data: LINE_DATA,
      series: "series",
      x: "label",
      y: "value",
      yDomain: [0, 0.5]
    }
  ))
};
export const Bar = {
  render: () => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Small, { className: "mb-5 block opacity-50" }, "BarChart"), /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: BAR_DATA,
      x: "label",
      xDomain: [0, 15e4],
      y: "value",
      yDomain: [0, 10]
    }
  ))
};
