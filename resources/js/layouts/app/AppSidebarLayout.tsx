import type { PropsWithChildren } from 'react';
import AppContent from '@/components/AppContent';
import AppShell from '@/components/AppShell';
import AppSidebar from '@/components/AppSidebar';
import AppSidebarHeader from '@/components/AppSidebarHeader';
import { Toaster } from '@/components/ui/sonner';
import type { BreadcrumbItem } from '@/types';

type AppSidebarLayoutProps = PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
}>;

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}
