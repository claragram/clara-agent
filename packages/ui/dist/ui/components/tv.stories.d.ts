import type { StoryObj } from '@storybook/react-vite';
import { TV } from './tv';
declare const meta: Meta<typeof TV>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Large: Story;
