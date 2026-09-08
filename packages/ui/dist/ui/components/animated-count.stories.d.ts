import type { StoryObj } from '@storybook/react-vite';
import { AnimatedCount } from './animated-count';
declare const meta: Meta<typeof AnimatedCount>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Live: StoryObj;
export declare const Manual: StoryObj;
