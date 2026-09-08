"use client";
import {
  useEffect,
  useState
} from "react";
import spinners from "unicode-animations";
import { cn } from "../../utils";
export function Spinner({
  className,
  name = "braille",
  style,
  ...props
}) {
  const [frame, setFrame] = useState(0);
  const animation = spinners[name];
  useEffect(() => {
    const id = setInterval(
      () => setFrame((f) => (f + 1) % animation.frames.length),
      animation.interval
    );
    return () => clearInterval(id);
  }, [animation.frames.length, animation.interval]);
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      "aria-hidden": props["aria-label"] ? void 0 : true,
      className: cn(
        "font-mono inline-block leading-none tabular-nums",
        className
      ),
      style,
      ...props
    },
    animation.frames[frame]
  );
}
