import fillerBg from "../../assets/filler-bg0.webp";
import { TierCard } from "./tier-card.mjs";
const SCOUT_SRC = fillerBg.src ?? fillerBg;
const TIERS = [
  {
    bullets: ["Free models only"],
    label: "Scout",
    price: { primary: "Free", primarySuffix: "/mo" },
    src: SCOUT_SRC,
    tint: "#88ccaa"
  },
  {
    bullets: ["300+ models", "Hosted tool usage", "$5 monthly credits"],
    label: "Visor",
    price: { primary: "$5", primarySuffix: "/mo" },
    src: "/img/clara-2.png",
    tint: "#99bbdd"
  },
  {
    bullets: [
      "300+ models",
      "Hosted tool usage",
      "$20 monthly credits",
      "$40 rollover cap"
    ],
    label: "Angel",
    price: { primary: "$20", primarySuffix: "/mo" },
    src: "/img/clara-3.jpg",
    tint: "#ccaa88"
  },
  {
    bullets: [
      "300+ models",
      "Hosted tool usage",
      "$50 monthly credits",
      "$100 rollover cap"
    ],
    label: "Herald",
    price: { primary: "$50", primarySuffix: "/mo" },
    src: "/img/clara-4.png",
    tint: "#dd8899"
  },
  {
    bullets: [
      "300+ models",
      "Hosted tool usage",
      "$150 monthly credits",
      "$300 rollover cap"
    ],
    label: "Muse",
    price: { primary: "$200", primarySuffix: "/mo" },
    src: "/img/clara-1.png",
    tint: "#ccaa88"
  }
];
const HIGHEST_OVERLAY = {
  overlay: "rgba(180, 30, 20, 1)",
  tint: "#ff4444",
  tintStrength: { active: 0.55, inactive: 0.35 }
};
const meta = {
  args: {
    bullets: [...TIERS[2].bullets],
    image: TIERS[2].src,
    price: TIERS[2].price,
    tint: TIERS[2].tint,
    title: TIERS[2].label
  },
  argTypes: {
    badge: { control: "text" },
    bullets: { control: "object" },
    className: { table: { disable: true } },
    image: { control: "text" },
    isCurrent: { control: "boolean" },
    onSelect: { action: "select" },
    overlay: { control: "color" },
    price: { control: "object" },
    selected: { control: "boolean" },
    tint: { control: "color" },
    tintStrength: { control: "object" },
    title: { control: "text" }
  },
  component: TierCard,
  decorators: [
    (Story, context) => {
      if (context.parameters?.tierCardRaw) {
        return /* @__PURE__ */ React.createElement(Story, null);
      }
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "bg-background flex items-center justify-center p-8",
          style: { minHeight: "100dvh" }
        },
        /* @__PURE__ */ React.createElement("div", { className: "w-[22rem]" }, /* @__PURE__ */ React.createElement(Story, null))
      );
    }
  ],
  parameters: {
    docs: {
      description: {
        component: "Selectable subscription-tier card. Fully presentational: the consumer owns the data (tier schema, price formatting, imagery, tints). Toggle `selected` to see the `.arc-border` shimmer and `mix-blend-mode: plus-lighter` lift on the headline / price."
      }
    },
    layout: "fullscreen"
  },
  title: "Components/Data Display/TierCard"
};
export default meta;
export const Idle = {};
export const Selected = {
  args: { selected: true }
};
export const Current = {
  args: { badge: "(current)", isCurrent: true }
};
export const CurrentSelected = {
  args: { badge: "(current)", isCurrent: true, selected: true }
};
export const HighestTier = {
  args: {
    ...HIGHEST_OVERLAY,
    bullets: [...TIERS[3].bullets],
    image: TIERS[3].src,
    price: { primary: "$200", primarySuffix: "/mo" },
    selected: true,
    title: "Sovereign"
  }
};
export const WithDiscount = {
  args: {
    bullets: [...TIERS[2].bullets],
    image: TIERS[2].src,
    price: {
      primary: "$10",
      primarySuffix: "first payment",
      secondary: "$20",
      secondarySuffix: "/mo"
    },
    tint: TIERS[2].tint,
    title: TIERS[2].label
  }
};
export const Row = {
  // Opt out of the compact single-card wrapper (see the meta decorator)
  // and supply a full-width grid instead.
  decorators: [
    (Story) => /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "bg-background flex items-center justify-center p-10",
        style: { minHeight: "100dvh" }
      },
      /* @__PURE__ */ React.createElement("div", { className: "grid w-full max-w-[90rem] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" }, /* @__PURE__ */ React.createElement(Story, null))
    )
  ],
  parameters: { layout: "fullscreen", tierCardRaw: true },
  render: () => /* @__PURE__ */ React.createElement(React.Fragment, null, TIERS.map((tier, i) => {
    const isHighest = i === TIERS.length - 1;
    return /* @__PURE__ */ React.createElement(
      TierCard,
      {
        bullets: [...tier.bullets],
        image: tier.src,
        key: tier.label,
        price: tier.price,
        selected: i === 2,
        title: tier.label,
        ...isHighest ? HIGHEST_OVERLAY : { tint: tier.tint }
      }
    );
  }))
};
