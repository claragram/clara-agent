import { Cell, Grid } from "./components/grid/index.mjs";
import { Progress } from "./components/progress.mjs";
import { H1 } from "./components/typography/h1.mjs";
import { Small } from "./components/typography/small.mjs";
export function BasicPage({ children, subtitle, title }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Grid, null, /* @__PURE__ */ React.createElement(Cell, null, /* @__PURE__ */ React.createElement(Progress, { value: 0 }))), /* @__PURE__ */ React.createElement(Grid, { className: "lg:grid-cols-[max-content_1fr]" }, /* @__PURE__ */ React.createElement(Cell, { className: "-order-1" }, /* @__PURE__ */ React.createElement("div", { className: "sticky top-4 flex flex-col gap-4" }, title ? /* @__PURE__ */ React.createElement(H1, { className: "-mb-2 pr-10 opacity-90" }, title) : null, subtitle ? /* @__PURE__ */ React.createElement(Small, { className: "opacity-60" }, subtitle) : null)), /* @__PURE__ */ React.createElement(Cell, { className: "post bg-current/3" }, children)));
}
