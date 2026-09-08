import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
declare const meta: Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof Card>;
export declare const Default: Story;
export declare const WithForm: Story;
