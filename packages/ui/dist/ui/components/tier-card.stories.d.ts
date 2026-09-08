import type { StoryObj } from '@storybook/react-vite';
import { TierCard } from './tier-card';
declare const meta: Meta<typeof TierCard>;
export default meta;
type Story = StoryObj<typeof meta>;
/** Default resting state. Hover to preview the arc-border shimmer. */
export declare const Idle: Story;
/** Selected state — arc-border, active distortion, lifted text. */
export declare const Selected: Story;
/** Current plan, not selected — subtle midground border hint. */
export declare const Current: Story;
/** Current plan AND selected — both treatments compose. */
export declare const CurrentSelected: Story;
/** Highest tier red-overlay treatment. */
export declare const HighestTier: Story;
/** Struck-through comparison price (e.g. first-payment discount). */
export declare const WithDiscount: Story;
/**
 * Full 5-card row approximating the live manage-subscription page, with
 * the highest tier carrying the red overlay. Click any card to toggle
 * selection — mirrors the interaction model in the consumer app.
 */
export declare const Row: StoryObj;
