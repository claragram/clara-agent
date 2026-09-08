"use client";
import { AnimatePresence, motion } from "motion/react";
import { createElement, useCallback, useRef, useState } from "react";
import { useCssVarDims } from "../hooks/use-css-var-dims";
import { useGpuTier } from "../hooks/use-gpu-tier";
import { cn } from "../utils";
import { Blink } from "./components/blink.mjs";
import { Cell, Grid } from "./components/grid/index.mjs";
import { HoverBg } from "./components/hover-bg.mjs";
import { HamburgerIcon } from "./components/icons/hamburger.mjs";
import { Scramble } from "./components/scramble.mjs";
import { Socials } from "./components/socials.mjs";
import { ThemeToggle } from "./components/theme-toggle.mjs";
import { H2 } from "./components/typography/h2.mjs";
import { Small } from "./components/typography/small.mjs";
const DEFAULT_BRAND = /* @__PURE__ */ React.createElement("hgroup", { className: "flex flex-col gap-2" }, /* @__PURE__ */ React.createElement(Small, null, "Clara"), /* @__PURE__ */ React.createElement(H2, null, "Agent"));
const DEFAULT_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/participants", label: "Participants" },
  { href: "/provenance", label: "Provenance" },
  { href: "/contribute", label: "Contribute" }
];
export function Header({
  brand = DEFAULT_BRAND,
  brandHref = "/",
  className,
  desktopGridStyle,
  links = DEFAULT_LINKS,
  LinkComponent = "a",
  scramble: scrambleProp = true,
  socials,
  socialsLabel = "Socials",
  style,
  themeLabel = "Theme",
  themeToggle = false
}) {
  const ref = useRef(null);
  useCssVarDims("header", ref);
  const gpuTier = useGpuTier();
  const scramble = scrambleProp && gpuTier > 0;
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const hasSocials = (socials?.length ?? 0) > 0;
  const hasMobileChrome = themeToggle || hasSocials;
  return /* @__PURE__ */ React.createElement("header", { className, ref, style }, /* @__PURE__ */ React.createElement(
    Grid,
    {
      className: "hidden border-t border-b lg:grid",
      style: desktopGridStyle
    },
    /* @__PURE__ */ React.createElement(
      BrandCell,
      {
        brand,
        href: brandHref,
        LinkComponent
      }
    ),
    links.map((link) => /* @__PURE__ */ React.createElement(
      NavCell,
      {
        key: link.href,
        link,
        LinkComponent,
        scramble
      }
    )),
    hasSocials && /* @__PURE__ */ React.createElement(Cell, { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, socialsLabel), /* @__PURE__ */ React.createElement(Socials, { items: socials })),
    themeToggle && /* @__PURE__ */ React.createElement(Cell, { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, themeLabel), /* @__PURE__ */ React.createElement(ThemeToggle, null))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "flex items-center justify-between border border-current/20 p-4",
        "lg:hidden"
      )
    },
    /* @__PURE__ */ React.createElement(
      BrandLink,
      {
        brand,
        href: brandHref,
        LinkComponent
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, themeToggle && /* @__PURE__ */ React.createElement(ThemeToggle, null), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": open ? "Close menu" : "Open menu",
        className: "relative z-50 cursor-pointer bg-transparent p-2",
        onClick: () => setOpen((v) => !v),
        type: "button"
      },
      /* @__PURE__ */ React.createElement(HamburgerIcon, { open })
    ))
  ), /* @__PURE__ */ React.createElement(AnimatePresence, null, open && /* @__PURE__ */ React.createElement(
    motion.div,
    {
      animate: { opacity: 1 },
      className: cn(
        "bg-background/95 fixed inset-0 z-50 flex flex-col backdrop-blur-sm",
        "p-8 lg:hidden"
      ),
      exit: { opacity: 0 },
      initial: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col border border-current/20" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between border-b border-current/20 p-4" }, /* @__PURE__ */ React.createElement(
      BrandLink,
      {
        brand,
        href: brandHref,
        LinkComponent,
        onClick: close
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Close menu",
        className: "cursor-pointer bg-transparent p-2",
        onClick: close,
        type: "button"
      },
      /* @__PURE__ */ React.createElement(HamburgerIcon, { open: true })
    )), links.map((link) => /* @__PURE__ */ React.createElement(
      MobileNavLink,
      {
        key: link.href,
        link,
        LinkComponent,
        onNavigate: close,
        scramble
      }
    )), hasMobileChrome && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 border-b border-current/20 p-4" }, hasSocials && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, socialsLabel), /* @__PURE__ */ React.createElement(Socials, { items: socials, onNavigate: close })), themeToggle && hasSocials && /* @__PURE__ */ React.createElement("span", { className: "flex-1" }), themeToggle && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, themeLabel), /* @__PURE__ */ React.createElement(ThemeToggle, null))))
  )));
}
function BrandCell({ brand, href, LinkComponent }) {
  return isExternal(href) ? /* @__PURE__ */ React.createElement(Cell, { href, ...EXTERNAL_REL, as: "a" }, brand) : /* @__PURE__ */ React.createElement(Cell, { as: LinkComponent, href }, brand);
}
function BrandLink({ brand, href, LinkComponent, onClick }) {
  if (isExternal(href)) {
    return /* @__PURE__ */ React.createElement("a", { href, onClick, ...EXTERNAL_REL }, brand);
  }
  return createElement(
    LinkComponent,
    { href, onClick },
    brand
  );
}
function NavCell({ link, LinkComponent, scramble }) {
  const ref = useRef(null);
  const isExt = link.external ?? isExternal(link.href);
  const inner = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Small, null, scramble ? /* @__PURE__ */ React.createElement(Scramble, { target: ref }, link.label) : link.label, /* @__PURE__ */ React.createElement(Blink, null)), /* @__PURE__ */ React.createElement(HoverBg, null));
  if (isExt) {
    return /* @__PURE__ */ React.createElement(
      Cell,
      {
        as: "a",
        className: "group relative cursor-pointer",
        href: link.href,
        onClick: link.onClick,
        ref,
        ...EXTERNAL_REL
      },
      inner
    );
  }
  return /* @__PURE__ */ React.createElement(
    Cell,
    {
      as: LinkComponent,
      className: "group relative cursor-pointer",
      href: link.href,
      onClick: link.onClick,
      ref
    },
    inner
  );
}
function MobileNavLink({
  link,
  LinkComponent,
  onNavigate,
  scramble
}) {
  const ref = useRef(null);
  const isExt = link.external ?? isExternal(link.href);
  const className = cn(
    "group relative flex cursor-pointer items-center border-b border-current/20 p-4"
  );
  const onClick = (e) => {
    link.onClick?.(e);
    onNavigate();
  };
  const children = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Small, null, scramble ? /* @__PURE__ */ React.createElement(Scramble, { target: ref }, link.label) : link.label, /* @__PURE__ */ React.createElement(Blink, null)), /* @__PURE__ */ React.createElement(HoverBg, null));
  if (isExt) {
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        className,
        href: link.href,
        onClick,
        ref,
        ...EXTERNAL_REL
      },
      children
    );
  }
  return createElement(
    LinkComponent,
    { className, href: link.href, onClick, ref },
    children
  );
}
const EXTERNAL_REL = {
  rel: "noopener noreferrer",
  target: "_blank"
};
const isExternal = (href) => /^(https?:|mailto:|tel:)/i.test(href);
