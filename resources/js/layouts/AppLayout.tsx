import type { PropsWithChildren } from 'react';
import AppLayoutTemplate from '@/layouts/app/AppSidebarLayout';
import type { BreadcrumbItem } from '@/types';

type AppLayoutProps = PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
}>;

export default function AppLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
