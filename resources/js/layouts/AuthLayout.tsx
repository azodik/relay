import type { PropsWithChildren } from 'react';
import AuthLayoutTemplate from '@/layouts/auth/AuthSimpleLayout';

type AuthLayoutProps = PropsWithChildren<{
    title?: string;
    description?: string;
}>;

export default function AuthLayout({
    children,
    title = '',
    description = '',
}: AuthLayoutProps) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            {children}
        </AuthLayoutTemplate>
    );
}
