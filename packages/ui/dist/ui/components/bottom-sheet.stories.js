import { useState } from "react";
import { BottomSheet } from "./bottom-sheet.mjs";
import { Button } from "./button.mjs";
import { ListItem } from "./list-item.mjs";
const meta = {
  component: BottomSheet,
  title: "Components/Overlays/BottomSheet"
};
export default meta;
export const Default = {
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => setOpen(true) }, "Open sheet"), /* @__PURE__ */ React.createElement(
        BottomSheet,
        {
          onClose: () => setOpen(false),
          open,
          title: "Pick an option"
        },
        ["Alpha", "Beta", "Gamma", "Delta"].map((item) => /* @__PURE__ */ React.createElement(ListItem, { key: item, onClick: () => setOpen(false) }, item))
      ));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
