import fillerBg from "../../assets/filler-bg0.webp";
import { Poster } from "./poster.mjs";
const SCOUT_SRC = fillerBg.src ?? fillerBg;
const TIERS = [
  {
    label: "Scout",
    src: SCOUT_SRC,
    subtitle: "warrior approaches the giant",
    tint: "#88ccaa"
  },
  {
    label: "Visor",
    src: "/img/clara-2.png",
    subtitle: "helmeted figure, visor drawn",
    tint: "#99bbdd"
  },
  {
    label: "Angel",
    src: "/img/clara-3.jpg",
    subtitle: "winged, in flight",
    tint: "#ccaa88"
  },
  {
    label: "Herald",
    src: "/img/clara-4.png",
    subtitle: "plumed helm, armored",
    tint: "#dd8899"
  },
  {
    label: "Muse",
    src: "/img/clara-1.png",
    subtitle: "portrait, pensive",
    tint: "#ccaa88"
  }
];
const HIGHEST_TINT = "#ff4444";
const HIGHEST_TINT_STRENGTH = { active: 0.55, inactive: 0.35 };
const meta = {
  argTypes: {
    aspect: {
      control: "select",
      options: ["square", "portrait", "landscape", "story", "wide"]
    },
    autoPlay: {
      control: "select",
      options: ["slash", "gentle", "aggressive"]
    },
    // `React.ReactNode` props default to Storybook's "object" control, which
    // shows as "Set object" and can't be edited in-place. Force them to
    // plain text / object inputs since that's how they're used in practice.
    body: {
      control: "text",
      table: { category: "Dispatch variant" }
    },
    border: { control: "boolean" },
    channel: { control: "text" },
    // `children` and `className` are dev-only escape hatches (arbitrary JSX
    // / Tailwind passthrough). Neither is useful for the "record a GIF for
    // socials" workflow, so hide them from the panel to keep it tidy.
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    cornerMarks: { control: "boolean" },
    eyebrow: {
      control: "text",
      table: { category: "Dispatch variant" }
    },
    headline: {
      control: "object",
      table: { category: "Dispatch variant" }
    },
    layout: {
      control: "inline-radio",
      options: ["split", "stacked"],
      table: { category: "Dispatch variant" }
    },
    scale: { control: { max: 1, min: 0.25, step: 0.05, type: "range" } },
    seal: {
      control: "text",
      table: { category: "Dispatch variant" }
    },
    signature: { control: "text" },
    src: { control: "text" },
    tags: {
      control: "object",
      table: { category: "Dispatch variant" }
    },
    tint: { control: "color" },
    tintStrength: { control: "object" },
    variant: {
      control: "inline-radio",
      options: ["vibe", "dispatch"]
    }
  },
  component: Poster,
  parameters: {
    docs: {
      description: {
        component: 'A social-ready glitchy card built around the haptic-distortion image component. Defaults to the `vibe` variant \u2014 full-bleed distortion with minimal registration chrome \u2014 matching the overlay on the Clara agent website. Switch to `variant="dispatch"` for the broadcast-card layout with copy + sidebar tags.\n\nPoster stories include all five tier images from the `manage-subscription` page so you can screen-record any character on-demand.'
      }
    },
    layout: "centered"
  },
  title: "Components/Data Display/Poster"
};
export default meta;
export const Vibe = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    variant: "vibe"
  }
};
export const VibeStory = {
  args: {
    aspect: "story",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    variant: "vibe"
  },
  name: "Vibe \xB7 Story (9:16)"
};
export const VibeLandscape = {
  args: {
    aspect: "landscape",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    variant: "vibe"
  },
  name: "Vibe \xB7 Landscape (16:9)"
};
export const VibePortrait = {
  args: {
    aspect: "portrait",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    variant: "vibe"
  },
  name: "Vibe \xB7 Portrait (4:5)"
};
export const TierGallery = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    border: true,
    cornerMarks: true,
    scale: 0.3,
    showLabels: true,
    variant: "vibe"
  },
  argTypes: { showLabels: { control: "boolean" } },
  name: "Tier Gallery",
  parameters: { layout: "fullscreen" },
  render: ({ showLabels, ...args }) => /* @__PURE__ */ React.createElement("div", { className: "bg-background flex min-h-screen items-center justify-center p-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 items-start gap-4 xl:grid-cols-5" }, TIERS.map((tier) => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2", key: tier.label }, showLabels && /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline justify-between gap-2 px-1" }, /* @__PURE__ */ React.createElement("span", { className: "font-mondwest text-[0.75rem] tracking-[0.1875rem] uppercase opacity-80" }, tier.label), /* @__PURE__ */ React.createElement("span", { className: "font-courier text-[0.625rem] tracking-widest opacity-40" }, tier.tint)), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? tier.label : void 0,
      src: tier.src,
      tint: tier.tint
    }
  ), showLabels && /* @__PURE__ */ React.createElement("span", { className: "font-courier px-1 text-[0.625rem] tracking-wider opacity-50" }, tier.subtitle)))))
};
export const TierScout = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    src: SCOUT_SRC,
    tint: TIERS[0].tint,
    variant: "vibe"
  },
  name: "Tier \xB7 Scout"
};
export const TierVisor = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    src: TIERS[1].src,
    tint: TIERS[1].tint,
    variant: "vibe"
  },
  name: "Tier \xB7 Visor"
};
export const TierAngel = {
  args: {
    aspect: "square",
    autoPlay: "gentle",
    scale: 1,
    signature: "Clara Agent",
    src: TIERS[2].src,
    tint: TIERS[2].tint,
    variant: "vibe"
  },
  name: "Tier \xB7 Angel"
};
export const TierHerald = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    scale: 1,
    signature: "Clara Agent",
    src: TIERS[3].src,
    tint: TIERS[3].tint,
    variant: "vibe"
  },
  name: "Tier \xB7 Herald"
};
export const TierMuse = {
  args: {
    aspect: "square",
    autoPlay: "gentle",
    scale: 1,
    signature: "Clara Agent",
    src: TIERS[4].src,
    tint: TIERS[4].tint,
    variant: "vibe"
  },
  name: "Tier \xB7 Muse"
};
export const TierApex = {
  args: {
    aspect: "square",
    autoPlay: "aggressive",
    scale: 1,
    signature: "Clara \xB7 Apex",
    src: TIERS[3].src,
    tint: HIGHEST_TINT,
    tintStrength: HIGHEST_TINT_STRENGTH,
    variant: "vibe"
  },
  name: "Tier \xB7 Apex (highest)"
};
export const VibeTriptychScout = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    border: true,
    cornerMarks: true,
    scale: 0.35,
    showLabels: true,
    variant: "vibe"
  },
  argTypes: { showLabels: { control: "boolean" } },
  name: "Vibe \xB7 Triptych (Scout, 3 tints)",
  parameters: { layout: "fullscreen" },
  // `args` here drives the shared props across all three tiles; per-tile
  // specifics (signature, tint) stay hardcoded inside the render so the
  // triptych keeps its identity while you tweak chrome/scale/etc. from the
  // Controls panel. `showLabels` hides the per-tile signature text.
  render: ({ showLabels, ...args }) => /* @__PURE__ */ React.createElement("div", { className: "bg-background flex min-h-screen items-center justify-center p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-stretch gap-4" }, /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? "Studio" : void 0,
      tint: "#88ccaa"
    }
  ), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? "Pro" : void 0,
      tint: "#ccaa88"
    }
  ), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? "Sovereign" : void 0,
      tint: HIGHEST_TINT,
      tintStrength: HIGHEST_TINT_STRENGTH
    }
  )))
};
export const VibeTriptychMixed = {
  args: {
    aspect: "square",
    autoPlay: "slash",
    border: true,
    cornerMarks: true,
    scale: 0.35,
    showLabels: true,
    variant: "vibe"
  },
  argTypes: { showLabels: { control: "boolean" } },
  name: "Vibe \xB7 Triptych (mixed characters)",
  parameters: { layout: "fullscreen" },
  render: ({ showLabels, ...args }) => /* @__PURE__ */ React.createElement("div", { className: "bg-background flex min-h-screen items-center justify-center p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-stretch gap-4" }, /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? TIERS[0].label : void 0,
      src: TIERS[0].src,
      tint: TIERS[0].tint
    }
  ), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? TIERS[2].label : void 0,
      src: TIERS[2].src,
      tint: TIERS[2].tint
    }
  ), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      signature: showLabels ? TIERS[3].label : void 0,
      src: TIERS[3].src,
      tint: HIGHEST_TINT,
      tintStrength: HIGHEST_TINT_STRENGTH
    }
  )))
};
export const VibeGentle = {
  args: {
    aspect: "square",
    autoPlay: "gentle",
    scale: 1,
    signature: "Clara Agent",
    tint: "#88ccaa",
    variant: "vibe"
  }
};
export const VibeAggressive = {
  args: {
    aspect: "square",
    autoPlay: "aggressive",
    scale: 1,
    signature: "Clara Agent",
    tint: HIGHEST_TINT,
    variant: "vibe"
  }
};
export const DispatchPricingTeaser = {
  args: {
    aspect: "square",
    body: "New tiers. Same autonomous agent, scaled to how you actually run it \u2014 solo on a laptop, shared across a team, or sovereign on your own hardware.",
    channel: "CLARASHIP \u2022 CLARA AGENT",
    eyebrow: "PRICING / 2026",
    headline: ["Pricing", "That Grows", "With You."],
    scale: 1,
    seal: "v0.9 \xB7 2026",
    signature: "claraship.com",
    tags: ["Studio \xB7 free", "Pro \xB7 $20/mo", "Sovereign \xB7 on-prem"],
    tint: "#ccaa88",
    variant: "dispatch"
  },
  name: "Dispatch \xB7 Pricing Teaser"
};
export const DispatchTriptych = {
  args: {
    aspect: "square",
    border: true,
    cornerMarks: true,
    scale: 0.35,
    showLabels: true,
    variant: "dispatch"
  },
  argTypes: { showLabels: { control: "boolean" } },
  name: "Dispatch \xB7 Triptych",
  parameters: { layout: "fullscreen" },
  render: ({ showLabels, ...args }) => /* @__PURE__ */ React.createElement("div", { className: "bg-background flex min-h-screen items-center justify-center p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-stretch gap-4" }, /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      channel: showLabels ? "CLARA \u2022 STUDIO" : void 0,
      eyebrow: showLabels ? "TIER / 001" : void 0,
      headline: showLabels ? ["Clara", "Studio."] : [""],
      seal: showLabels ? "FREE \xB7 MIT" : void 0,
      signature: showLabels ? "claraship.com / studio" : void 0,
      src: TIERS[0].src,
      tags: showLabels ? ["Local-first", "Unlimited tools", "MIT"] : [],
      tint: TIERS[0].tint
    }
  ), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      channel: showLabels ? "CLARA \u2022 PRO" : void 0,
      eyebrow: showLabels ? "TIER / 002" : void 0,
      headline: showLabels ? ["Clara", "Pro."] : [""],
      seal: showLabels ? "$20/mo" : void 0,
      signature: showLabels ? "claraship.com / pro" : void 0,
      src: TIERS[2].src,
      tags: showLabels ? ["Hosted memory", "Priority inference", "Team workspaces"] : [],
      tint: TIERS[2].tint
    }
  ), /* @__PURE__ */ React.createElement(
    Poster,
    {
      ...args,
      channel: showLabels ? "CLARA \u2022 SOVEREIGN" : void 0,
      eyebrow: showLabels ? "TIER / 003" : void 0,
      headline: showLabels ? ["Clara", "Sovereign."] : [""],
      seal: showLabels ? "talk to us" : void 0,
      signature: showLabels ? "claraship.com / sovereign" : void 0,
      src: TIERS[3].src,
      tags: showLabels ? ["Self-hosted", "Dedicated inference", "SSO + audit"] : [],
      tint: HIGHEST_TINT,
      tintStrength: HIGHEST_TINT_STRENGTH
    }
  )))
};
