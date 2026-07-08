import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = PropsWithChildren<{
    label: string;
    body?: string;
    action?: ReactNode;
    className?: string;
}>;

export default function EmptyState({
    label,
    body,
    action,
    children,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn('relay-empty', className)}>
            <div className="relay-empty-label">{label}</div>
            {body ? <p className="relay-empty-body">{body}</p> : null}
            {children}
            {action ? <div className="mt-3">{action}</div> : null}
        </div>
    );
}
