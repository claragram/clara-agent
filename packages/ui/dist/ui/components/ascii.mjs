"use client";
import { useEffect, useRef, useState } from "react";
const BLOCK = "\u2591\u2592\u2593\u2588\u2584\u2580\u2590\u258C\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u254C\u254E\u28C0\u28E4\u28F6\u28FF";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
const rand = (chars) => chars[Math.random() * chars.length | 0];
export function Scramble({
  delay = 0,
  text
}) {
  const [display, setDisplay] = useState(text);
  const iter = useRef(0);
  useEffect(() => {
    iter.current = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(
          text.split("").map(
            (c, i) => c === " " ? " " : i < iter.current ? text[i] : rand(ALPHA)
          ).join("")
        );
        iter.current += 1 / 3;
        if (iter.current >= text.length) {
          clearInterval(interval);
          setDisplay(text);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, display);
}
export function AsciiSkeleton({
  className = "",
  cols = 12,
  rows = 1,
  speed = 80
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const total = cols * rows;
    let frame = 0;
    const tick = () => {
      let text = "";
      for (let i = 0; i < total; i++) {
        const x = i % cols;
        const shimmer = (x - frame * 0.5 + cols * 2) % (cols * 2);
        text += shimmer < 6 ? " " : rand(BLOCK);
        if (rows > 1 && x === cols - 1) {
          text += "\n";
        }
      }
      el.textContent = text;
      frame++;
    };
    tick();
    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [cols, rows, speed]);
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      "aria-hidden": true,
      className: `inline-block leading-tight opacity-20 select-none ${className}`,
      ref,
      style: {
        fontFamily: "monospace",
        fontSize: "inherit",
        letterSpacing: "0.05em"
      }
    }
  );
}
