import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/AppLogoIcon';
import { home } from '@/routes';

type AuthSimpleLayoutProps = PropsWithChildren<{
    title?: string;
    description?: string;
}>;

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthSimpleLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 py-10 text-foreground">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(61,214,181,0.08),transparent_55%)]"
            />

            <div className="relative z-10 w-full max-w-[400px]">
                <Link
                    href={home()}
                    className="mb-8 flex items-center justify-center gap-2.5"
                >
                    <span className="grid size-8 place-items-center rounded-md bg-signal text-signal-foreground shadow-[0_0_0_1px_rgba(61,214,181,0.35)]">
                        <AppLogoIcon className="size-[18px]" />
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight">
                        Relay
                    </span>
                </Link>

                <div className="rounded-md border border-border bg-card p-6">
                    <div className="mb-6 space-y-1.5">
                        <h1 className="text-lg font-semibold tracking-tight">
                            {title}
                        </h1>
                        {description ? (
                            <p className="text-[13px] leading-5 text-muted-foreground">
                                {description}
                            </p>
                        ) : null}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
