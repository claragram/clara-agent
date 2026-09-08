import React, { ReactNode } from 'react';
export declare function Stats({ className, items, flip, ...props }: StatsProps): any;
interface StatsProps extends React.ComponentProps<'div'> {
    items: {
        label: string | {
            key: string;
            node: ReactNode;
        };
        value: string | {
            key: string;
            node: ReactNode;
        };
    }[];
    flip?: boolean;
}
export {};
