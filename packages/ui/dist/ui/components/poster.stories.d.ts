import type { Meta, StoryObj } from '@storybook/react-vite';
import { Poster } from './poster';
import type { ComponentProps } from 'react';
type TriptychArgs = ComponentProps<typeof Poster> & {
    showLabels?: boolean;
};
type TriptychStory = StoryObj<TriptychArgs>;
declare const meta: Meta<typeof Poster>;
export default meta;
type Story = StoryObj<typeof Poster>;
/**
 * Primary story. Full-bleed "Scout" scene (warrior approaching the giant),
 * minimal chrome, just the subtle `Clara Agent` overlay at the bottom-right.
 * Screen-record one ~7s pass (two 3.6s slash cycles) → export as GIF →
 * attach to the pricing tweet.
 *
 * Rendered at full target resolution (1080×1080). The storybook viewport
 * naturally clamps it via `max-width: 100%` if your window is narrower.
 */
export declare const Vibe: Story;
/** 9:16 for Instagram / TikTok stories and reels. */
export declare const VibeStory: Story;
/** 16:9 for Twitter cards, LinkedIn, Discord embeds. */
export declare const VibeLandscape: Story;
/** 4:5 — the Instagram feed recommendation. */
export declare const VibePortrait: Story;
/**
 * All five `manage-subscription` tier images in one view, each with the
 * tint from `TierCard.tsx`. Pick whichever one matches the vibe for the
 * release and screen-record it on its own.
 */
export declare const TierGallery: TriptychStory;
export declare const TierScout: Story;
export declare const TierVisor: Story;
export declare const TierAngel: Story;
export declare const TierHerald: Story;
export declare const TierMuse: Story;
/**
 * Top-tier red-overlay treatment from `TierCard` — use this for the
 * "Sovereign" / highest tier poster.
 */
export declare const TierApex: Story;
/** Three vibe tiles side-by-side — same scene, three tier tints. */
export declare const VibeTriptychScout: TriptychStory;
/** Three vibe tiles, three tier images — mixed character set. */
export declare const VibeTriptychMixed: TriptychStory;
/** "Gentle" choreography — softer, slower drift. */
export declare const VibeGentle: Story;
/** "Aggressive" choreography — rapid multi-directional stabs. */
export declare const VibeAggressive: Story;
/** Full broadcast-card layout with copy, sidebar tags, and chrome. */
export declare const DispatchPricingTeaser: Story;
/** Three dispatch posters side-by-side for the full tier rollout. */
export declare const DispatchTriptych: TriptychStory;
