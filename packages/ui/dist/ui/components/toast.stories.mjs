import { useToast } from "../../hooks/use-toast";
import { Button } from "./button.mjs";
import { Toast } from "./toast.mjs";
const meta = {
  component: Toast,
  title: "Components/Feedback/Toast"
};
export default meta;
export const Success = {
  render: () => {
    function Demo() {
      const { showToast, toast } = useToast();
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: () => showToast("Operation succeeded", "success") }, "Show success toast"), /* @__PURE__ */ React.createElement(Toast, { toast }));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
export const Error = {
  render: () => {
    function Demo() {
      const { showToast, toast } = useToast();
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        Button,
        {
          destructive: true,
          onClick: () => showToast("Something went wrong", "error")
        },
        "Show error toast"
      ), /* @__PURE__ */ React.createElement(Toast, { toast }));
    }
    return /* @__PURE__ */ React.createElement(Demo, null);
  }
};
