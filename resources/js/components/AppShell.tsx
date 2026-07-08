import type { SharedPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type AppShellProps = PropsWithChildren<{
    variant?: AppVariant;
}>;

export default function AppShell({
    children,
    variant = 'sidebar',
}: AppShellProps) {
    const isOpen = usePage<SharedPageProps>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
