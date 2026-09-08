import { useState } from "react";
import { Button } from "./button.mjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./dialog.mjs";
import { Input } from "./input.mjs";
import { Label } from "./label.mjs";
const meta = {
  component: Dialog,
  title: "Components/Overlays/Dialog"
};
export default meta;
export const Default = {
  render: () => /* @__PURE__ */ React.createElement(Dialog, null, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, null, "Open Dialog")), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, null, "Dialog Title"), /* @__PURE__ */ React.createElement(DialogDescription, null, "A description of the dialog content and its purpose.")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("p", { className: "font-courier text-sm text-midground/80" }, "This is a general-purpose dialog built on Radix UI primitives. It handles focus trapping, ESC to close, and backdrop click automatically.")), /* @__PURE__ */ React.createElement(DialogFooter, null, /* @__PURE__ */ React.createElement(DialogClose, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { outlined: true }, "Close")))))
};
export const Controlled = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpen(true) }, "Controlled Open"), /* @__PURE__ */ React.createElement(Dialog, { onOpenChange: setOpen, open }, /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, null, "Controlled Dialog"), /* @__PURE__ */ React.createElement(DialogDescription, null, "This dialog is controlled via external state.")), /* @__PURE__ */ React.createElement("div", { className: "p-4" }, /* @__PURE__ */ React.createElement("p", { className: "font-courier text-sm text-midground/80" }, "Open state is managed by the parent component. Useful when you need to open the dialog programmatically.")), /* @__PURE__ */ React.createElement(DialogFooter, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpen(false), outlined: true }, "Cancel"), /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpen(false) }, "Save")))));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
export const WithForm = {
  render: () => /* @__PURE__ */ React.createElement(Dialog, null, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, null, "Edit Profile")), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, null, "Edit Profile"), /* @__PURE__ */ React.createElement(DialogDescription, null, "Make changes to your profile. Click save when you are done.")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "name" }, "Name"), /* @__PURE__ */ React.createElement(Input, { defaultValue: "Clara", id: "name" })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1.5" }, /* @__PURE__ */ React.createElement(Label, { htmlFor: "email" }, "Email"), /* @__PURE__ */ React.createElement(Input, { defaultValue: "hey@claraship.com", id: "email", type: "email" }))), /* @__PURE__ */ React.createElement(DialogFooter, null, /* @__PURE__ */ React.createElement(DialogClose, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { outlined: true }, "Cancel")), /* @__PURE__ */ React.createElement(DialogClose, { asChild: true }, /* @__PURE__ */ React.createElement(Button, null, "Save Changes")))))
};
export const NoCloseButton = {
  render: () => /* @__PURE__ */ React.createElement(Dialog, null, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, null, "Without Close Button")), /* @__PURE__ */ React.createElement(DialogContent, { showCloseButton: false }, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, null, "Minimal Dialog"), /* @__PURE__ */ React.createElement(DialogDescription, null, "This dialog hides the X close button. Users can still close it by pressing ESC or clicking the backdrop.")), /* @__PURE__ */ React.createElement(DialogFooter, null, /* @__PURE__ */ React.createElement(DialogClose, { asChild: true }, /* @__PURE__ */ React.createElement(Button, null, "Got it")))))
};
