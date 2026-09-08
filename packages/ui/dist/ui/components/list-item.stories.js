import { useState } from "react";
import { ListItem } from "./list-item.mjs";
const PROVIDERS = [
  { count: 412, name: "OpenAI", slug: "openai" },
  { count: 38, name: "Anthropic", slug: "anthropic" },
  { count: 124, name: "Google", slug: "google" },
  { count: 7, name: "Mistral", slug: "mistral" },
  { count: 4, name: "xAI", slug: "xai" }
];
function Demo() {
  const [active, setActive] = useState("anthropic");
  return /* @__PURE__ */ React.createElement("div", { className: "w-72 border border-midground/15 bg-background-base" }, PROVIDERS.map((p) => /* @__PURE__ */ React.createElement(
    ListItem,
    {
      active: p.slug === active,
      key: p.slug,
      onClick: () => setActive(p.slug)
    },
    /* @__PURE__ */ React.createElement("span", { className: "flex-1 truncate" }, p.name),
    /* @__PURE__ */ React.createElement("span", { className: "text-[0.65rem] tabular-nums text-midground/50" }, p.count)
  )));
}
const meta = {
  component: ListItem,
  title: "Components/Data Display/ListItem"
};
export default meta;
export const Playground = { render: () => /* @__PURE__ */ React.createElement(Demo, null) };
export const WithSubtitle = {
  render: () => {
    function MultiLineDemo() {
      const [active, setActive] = useState("anthropic");
      return /* @__PURE__ */ React.createElement("div", { className: "w-80 border border-midground/15 bg-background-base" }, PROVIDERS.map((p) => /* @__PURE__ */ React.createElement(
        ListItem,
        {
          active: p.slug === active,
          key: p.slug,
          onClick: () => setActive(p.slug)
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "truncate font-medium" }, p.name), /* @__PURE__ */ React.createElement("div", { className: "truncate text-[0.65rem] text-midground/60" }, p.slug, " \xB7 ", p.count, " models"))
      )));
    }
    return /* @__PURE__ */ React.createElement(MultiLineDemo, null);
  }
};
export const Disabled = {
  render: () => /* @__PURE__ */ React.createElement("div", { className: "w-72 border border-midground/15 bg-background-base" }, /* @__PURE__ */ React.createElement(ListItem, null, "Enabled item"), /* @__PURE__ */ React.createElement(ListItem, { disabled: true }, "Disabled item"), /* @__PURE__ */ React.createElement(ListItem, { active: true }, "Active item"))
};
