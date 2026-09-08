import { Tabs, TabsList, TabsTrigger } from "./tabs.mjs";
import { Small } from "./typography/small.mjs";
const meta = {
  component: Tabs,
  title: "Components/Forms/Tabs"
};
export default meta;
export const Playground = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "w-[28rem]" }, /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "overview" }, (active, setActive) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TabsList, null, /* @__PURE__ */ React.createElement(
    TabsTrigger,
    {
      active: active === "overview",
      onClick: () => setActive("overview"),
      value: "overview"
    },
    "Overview"
  ), /* @__PURE__ */ React.createElement(
    TabsTrigger,
    {
      active: active === "metrics",
      onClick: () => setActive("metrics"),
      value: "metrics"
    },
    "Metrics"
  ), /* @__PURE__ */ React.createElement(
    TabsTrigger,
    {
      active: active === "logs",
      onClick: () => setActive("logs"),
      value: "logs"
    },
    "Logs"
  ), /* @__PURE__ */ React.createElement(
    TabsTrigger,
    {
      active: active === "settings",
      onClick: () => setActive("settings"),
      value: "settings"
    },
    "Settings"
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4 border border-midground/10 bg-background-base" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60" }, "Active panel: ", /* @__PURE__ */ React.createElement("span", { className: "opacity-100" }, active))))))
};
export const TwoTabs = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "w-80" }, /* @__PURE__ */ React.createElement(Tabs, { defaultValue: "local" }, (active, setActive) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TabsList, null, /* @__PURE__ */ React.createElement(
    TabsTrigger,
    {
      active: active === "local",
      onClick: () => setActive("local"),
      value: "local"
    },
    "Local"
  ), /* @__PURE__ */ React.createElement(
    TabsTrigger,
    {
      active: active === "remote",
      onClick: () => setActive("remote"),
      value: "remote"
    },
    "Remote"
  )), /* @__PURE__ */ React.createElement("div", { className: "p-4 border border-midground/10 bg-background-base" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-60" }, "Active panel: ", /* @__PURE__ */ React.createElement("span", { className: "opacity-100" }, active))))))
};
