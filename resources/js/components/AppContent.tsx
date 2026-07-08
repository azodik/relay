import type { PropsWithChildren } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { AppVariant } from '@/types';

type AppContentProps = PropsWithChildren<{
    variant?: AppVariant;
    className?: string;
}>;

export default function AppContent({
    children,
    variant = 'sidebar',
    className,
}: AppContentProps) {
    if (variant === 'sidebar') {
        return <SidebarInset className={className}>{children}</SidebarInset>;
    }

    return (
        <main
            className={cn(
                'mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl',
                className,
            )}
        >
            {children}
        </main>
    );
}
