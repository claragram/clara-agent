import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageDistortion } from './image-distortion';
declare const meta: Meta<typeof ImageDistortion>;
export default meta;
type Story = StoryObj<typeof ImageDistortion>;
export declare const Default: Story;
export declare const Tinted: Story;
export declare const TintStrength: Story;
/**
 * Runs the haptic-distortion effect on a choreographed motion pattern so
 * the image looks alive without needing a real pointer. Perfect for
 * screen recordings, posters, and social cuts.
 */
export declare const AutoPlay: Story;
export declare const ToggleActive: Story;
