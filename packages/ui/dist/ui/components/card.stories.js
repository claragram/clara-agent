import { Button } from "./button.mjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./card.mjs";
import { Input } from "./input.mjs";
import { Label } from "./label.mjs";
import { Separator } from "./separator.mjs";
const meta = {
  component: Card,
  title: "Components/Data Display/Card"
};
export default meta;
export const Default = {
  render: () => /* @__PURE__ */ React.createElement(Card, { className: "max-w-sm" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Card title"), /* @__PURE__ */ React.createElement(CardDescription, null, "A brief description of this card.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-midground/70" }, "Card body content goes here.")))
};
export const WithForm = {
  render: () => /* @__PURE__ */ React.createElement(Card, { className: "max-w-sm" }, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Settings"), /* @__PURE__ */ React.createElement(CardDescription, null, "Configure your preferences.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement("div", { className: "grid gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "grid gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "card-name" }, "Name"), /* @__PURE__ */ React.createElement(Input, { id: "card-name", placeholder: "Enter name\u2026" })), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(Button, null, "Save")))))
};
