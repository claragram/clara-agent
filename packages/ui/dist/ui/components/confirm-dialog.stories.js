import { useState } from "react";
import { Button } from "./button.mjs";
import { ConfirmDialog } from "./confirm-dialog.mjs";
const meta = {
  component: ConfirmDialog,
  title: "Components/Overlays/ConfirmDialog"
};
export default meta;
export const Default = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpen(true) }, "Open dialog"), /* @__PURE__ */ React.createElement(
        ConfirmDialog,
        {
          description: "This action cannot be undone.",
          onCancel: () => setOpen(false),
          onConfirm: () => setOpen(false),
          open,
          title: "Are you sure?"
        }
      ));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
export const Destructive = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { destructive: true, onClick: () => setOpen(true) }, "Delete item"), /* @__PURE__ */ React.createElement(
        ConfirmDialog,
        {
          confirmLabel: "Delete",
          description: "This will permanently delete the item. This action cannot be undone.",
          destructive: true,
          onCancel: () => setOpen(false),
          onConfirm: () => setOpen(false),
          open,
          title: "Delete item?"
        }
      ));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
export const Loading = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpen(true) }, "With loading state"), /* @__PURE__ */ React.createElement(
        ConfirmDialog,
        {
          description: "Simulating a loading state.",
          loading: true,
          onCancel: () => setOpen(false),
          onConfirm: () => {
          },
          open,
          title: "Processing\u2026"
        }
      ));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
