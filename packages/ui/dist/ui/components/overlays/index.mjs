"use client";
import { Glitch } from "./glitch.mjs";
import { Greys } from "./greys.mjs";
import { Lens } from "./lens-layers.mjs";
import { Noise } from "./noise.mjs";
import { Vignette } from "./vignette.mjs";
export { BLEND_MODES } from "./blend-modes.mjs";
export { Glitch } from "./glitch.mjs";
export { Greys } from "./greys.mjs";
export { Lens } from "./lens-layers.mjs";
export { Noise } from "./noise.mjs";
export { Vignette } from "./vignette.mjs";
export {
  $lightMode,
  applyLens,
  lens0,
  lens5i,
  LENS_0,
  LENS_5I,
  LENSES,
  toggleLens
} from "./lens";
const LAYER = "pointer-events-none fixed inset-0";
export function Overlays({ dark, initial }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Lens, { dark, initial }), /* @__PURE__ */ React.createElement(Noise, { className: LAYER, style: { zIndex: 101 } }), /* @__PURE__ */ React.createElement(Vignette, { className: LAYER, style: { zIndex: 99 } }), /* @__PURE__ */ React.createElement(Greys, { className: LAYER, style: { zIndex: 200 } }), /* @__PURE__ */ React.createElement(Glitch, { className: LAYER, style: { zIndex: 201 } }));
}
