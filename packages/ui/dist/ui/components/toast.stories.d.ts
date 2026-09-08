import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './toast';
declare const meta: Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof Toast>;
export declare const Success: Story;
export declare const Error: Story;
