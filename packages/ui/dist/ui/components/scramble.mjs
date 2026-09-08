"use client";
import { useEffect, useRef, useState } from "react";
const CHARS = '.,\xB7-\u2500~+:;=*\u03C0""\u2510\u250C\u2518\u2534\u252C\u2557\u2554\u255D\u255A\u256C\u2560\u2563\u2569\u2566\u2551\u2591\u2592\u2593\u2588\u2584\u2580\u258C\u2590\u25A0!?&#$@0123456789*';
export function Scramble({
  children,
  dur = 666,
  spread = 1,
  target
}) {
  const text = String(children);
  const len = text.length;
  const [display, setDisplay] = useState(text);
  const frame = useRef(null);
  const waves = useRef([]);
  useEffect(() => {
    const el = target?.current;
    if (!el) {
      return;
    }
    const animate = () => {
      const t = Date.now();
      waves.current = waves.current.filter((w) => t - w.time < dur);
      if (!waves.current.length) {
        setDisplay(text);
        frame.current = null;
        return;
      }
      setDisplay(
        text.split("").map((c, i) => {
          if (c === " ") {
            return c;
          }
          for (const w of waves.current) {
            const age = t - w.time;
            const rad = Math.min(age / dur, 1) * (Math.max(w.pos, len - w.pos - 1) + 5) / spread;
            const dist = Math.abs(i - w.pos);
            const int = rad - dist;
            if (dist <= rad && int > 0 && int <= 3) {
              return CHARS[(dist * 3 + (age / 40 | 0)) % CHARS.length];
            }
          }
          return c;
        }).join("")
      );
      frame.current = requestAnimationFrame(animate);
    };
    const onEnter = () => {
      waves.current.push({ pos: len >> 1, time: Date.now() });
      frame.current ??= requestAnimationFrame(animate);
    };
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      frame.current && cancelAnimationFrame(frame.current);
    };
  }, [target, text, len, dur, spread]);
  useEffect(() => {
    setDisplay(text);
  }, [text]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, display);
}
