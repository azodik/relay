import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type TextLinkProps = PropsWithChildren<
    Pick<InertiaLinkProps, 'href' | 'method' | 'as' | 'tabIndex'> & {
        className?: string;
    }
>;

export default function TextLink({
    children,
    className,
    href,
    method,
    as,
    tabIndex,
}: TextLinkProps) {
    return (
        <Link
            href={href}
            tabIndex={tabIndex}
            method={method}
            as={as}
            className={cn(
                'text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500',
                className,
            )}
        >
            {children}
        </Link>
    );
}
