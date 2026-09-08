"use client";
import { useRef } from "react";
import { useCssVarDims } from "../hooks/use-css-var-dims";
import { Cell, Grid } from "./components/grid/index.mjs";
import { Socials } from "./components/socials.mjs";
import { ThemeToggle } from "./components/theme-toggle.mjs";
import { Small } from "./components/typography/small.mjs";
const DEFAULT_GROUPS = [
  { label: "Product", links: ["Overview", "Features", "Pricing"] },
  { label: "Resources", links: ["Docs", "Blog", "Support"] },
  { label: "Company", links: ["About", "Careers", "Contact"] },
  { label: "Legal", links: ["Privacy", "Terms", "License"] }
];
export function Footer({
  className,
  groups = DEFAULT_GROUPS,
  LinkComponent = "a",
  socials,
  socialsLabel = "Socials",
  style,
  themeLabel = "Theme",
  themeToggle = false
}) {
  const ref = useRef(null);
  useCssVarDims("footer", ref);
  const hasSocials = (socials?.length ?? 0) > 0;
  const hasChrome = hasSocials || themeToggle;
  return /* @__PURE__ */ React.createElement("footer", { className, ref, style }, /* @__PURE__ */ React.createElement(Grid, null, /* @__PURE__ */ React.createElement(Cell, null, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, "\xA9", (/* @__PURE__ */ new Date()).getFullYear())), groups.map(({ label, links }) => /* @__PURE__ */ React.createElement(Cell, { key: label }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, label), /* @__PURE__ */ React.createElement("nav", { className: "mt-3 flex flex-col gap-2" }, links.map((link) => {
    const href = typeof link === "string" ? `/${link.toLowerCase()}` : link.href;
    const label2 = typeof link === "string" ? link : link.label;
    return /* @__PURE__ */ React.createElement(
      Small,
      {
        as: LinkComponent,
        className: "underline",
        href,
        key: label2
      },
      label2
    );
  }))))), hasChrome && /* @__PURE__ */ React.createElement(Grid, null, hasSocials && /* @__PURE__ */ React.createElement(Cell, { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, socialsLabel), /* @__PURE__ */ React.createElement(Socials, { items: socials })), themeToggle && /* @__PURE__ */ React.createElement(Cell, { className: "flex items-start justify-between" }, /* @__PURE__ */ React.createElement(Small, { className: "opacity-50" }, themeLabel), /* @__PURE__ */ React.createElement(ThemeToggle, null))));
}
