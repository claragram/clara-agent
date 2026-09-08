import { useState } from "react";
import { Button } from "./button.mjs";
import { Checkbox } from "./checkbox.mjs";
import { Input } from "./input.mjs";
import { Label } from "./label.mjs";
import { Select, SelectOption } from "./select.mjs";
import { Separator } from "./separator.mjs";
import { Switch } from "./switch.mjs";
const meta = {
  title: "Components/Forms/All Forms"
};
export default meta;
export const AllFormControls = {
  render: () => {
    function FormDemo() {
      const [name, setName] = useState("Clara");
      const [email, setEmail] = useState("hey@claraship.com");
      const [provider, setProvider] = useState("anthropic");
      const [logging, setLogging] = useState(true);
      const [telemetry, setTelemetry] = useState(false);
      const [terms, setTerms] = useState(false);
      const [newsletter, setNewsletter] = useState(true);
      return /* @__PURE__ */ React.createElement("div", { className: "flex w-full max-w-lg flex-col gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("h2", { className: "font-expanded text-sm font-bold tracking-[0.08em] uppercase" }, "Form Controls"), /* @__PURE__ */ React.createElement("p", { className: "font-mondwest text-xs text-midground/60" }, "All form primitives from the design system.")), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Label, { className: "text-midground/50" }, "Text Inputs"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "form-name" }, "Name"), /* @__PURE__ */ React.createElement(
        Input,
        {
          id: "form-name",
          onChange: (e) => setName(e.target.value),
          placeholder: "Enter your name",
          value: name
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "form-email" }, "Email"), /* @__PURE__ */ React.createElement(
        Input,
        {
          id: "form-email",
          onChange: (e) => setEmail(e.target.value),
          placeholder: "Enter your email",
          type: "email",
          value: email
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "form-disabled" }, "Disabled Input"), /* @__PURE__ */ React.createElement(
        Input,
        {
          disabled: true,
          id: "form-disabled",
          placeholder: "Cannot edit",
          value: "Read-only value"
        }
      ))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Label, { className: "text-midground/50" }, "Select"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "form-provider" }, "Provider"), /* @__PURE__ */ React.createElement(
        Select,
        {
          onValueChange: setProvider,
          placeholder: "Choose a provider\u2026",
          value: provider
        },
        /* @__PURE__ */ React.createElement(SelectOption, { value: "openai" }, "OpenAI"),
        /* @__PURE__ */ React.createElement(SelectOption, { value: "anthropic" }, "Anthropic"),
        /* @__PURE__ */ React.createElement(SelectOption, { value: "google" }, "Google"),
        /* @__PURE__ */ React.createElement(SelectOption, { value: "mistral" }, "Mistral")
      ))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Label, { className: "text-midground/50" }, "Switches"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, "Enable logging"), /* @__PURE__ */ React.createElement(Switch, { checked: logging, onCheckedChange: setLogging })), /* @__PURE__ */ React.createElement("label", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, "Send telemetry"), /* @__PURE__ */ React.createElement(Switch, { checked: telemetry, onCheckedChange: setTelemetry }))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Label, { className: "text-midground/50" }, "Checkboxes"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(
        Checkbox,
        {
          checked: terms,
          id: "form-terms",
          onCheckedChange: setTerms
        }
      ), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "form-terms" }, "Accept terms and conditions")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(
        Checkbox,
        {
          checked: newsletter,
          id: "form-newsletter",
          onCheckedChange: setNewsletter
        }
      ), /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer text-sm", htmlFor: "form-newsletter" }, "Subscribe to newsletter"))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement(Label, { className: "text-midground/50" }, "Buttons"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement(Button, null, "Primary"), /* @__PURE__ */ React.createElement(Button, { outlined: true }, "Outlined"), /* @__PURE__ */ React.createElement(Button, { invert: true }, "Inverted"), /* @__PURE__ */ React.createElement(Button, { destructive: true }, "Destructive"), /* @__PURE__ */ React.createElement(Button, { disabled: true }, "Disabled"))), /* @__PURE__ */ React.createElement(Separator, null), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end gap-2" }, /* @__PURE__ */ React.createElement(Button, { outlined: true }, "Cancel"), /* @__PURE__ */ React.createElement(Button, null, "Save Changes")));
    }
    return /* @__PURE__ */ React.createElement(FormDemo, null);
  }
};
