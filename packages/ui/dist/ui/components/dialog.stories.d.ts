import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';
declare const meta: Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof Dialog>;
export declare const Default: Story;
export declare const Controlled: Story;
export declare const WithForm: Story;
export declare const NoCloseButton: Story;
