import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmDialog } from './confirm-dialog';
declare const meta: Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;
export declare const Default: Story;
export declare const Destructive: Story;
export declare const Loading: Story;
