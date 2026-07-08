import { Link } from '@inertiajs/react';
import {
    Activity,
    KeyRound,
    Menu,
    Palette,
    ShieldCheck,
    UserRound,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/AppLogoIcon';
import { Toaster } from '@/components/ui/sonner';
import UserAvatarMenu from '@/components/UserAvatarMenu';
import { useCurrentUrl } from '@/hooks/useCurrentUrl';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const sidebarNavItems = [
    {
        title: 'Profile',
        href: editProfile(),
        icon: UserRound,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Palette,
    },
] as const;

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        if (!mobileNavOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                setMobileNavOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [mobileNavOpen]);

    return (
        <>
            <div className="relay-shell">
                <div className="relay-grid">
                    <header className="relay-header">
                        <button
                            type="button"
                            className="relay-icon-btn relay-header-menu lg:hidden"
                            aria-label={
                                mobileNavOpen ? 'Close menu' : 'Open menu'
                            }
                            aria-expanded={mobileNavOpen}
                            onClick={() => setMobileNavOpen((open) => !open)}
                        >
                            {mobileNavOpen ? (
                                <X className="size-4" />
                            ) : (
                                <Menu className="size-4" />
                            )}
                        </button>

                        <div className="relay-header-brand">
                            <Link
                                href={dashboard()}
                                className="relay-brand-mark"
                            >
                                <AppLogoIcon className="size-[15px] sm:size-[17px]" />
                            </Link>
                            <Link
                                href={dashboard()}
                                className="hidden font-sans text-sm font-semibold tracking-tight lg:inline"
                            >
                                Relay
                            </Link>
                        </div>

                        <div className="relay-header-crumbs hidden items-center gap-2 font-sans text-[12.5px] text-muted-foreground sm:flex">
                            <Link
                                href={dashboard()}
                                className="hover:text-foreground"
                            >
                                Dashboard
                            </Link>
                            <span>/</span>
                            <span className="font-medium text-foreground">
                                Settings
                            </span>
                        </div>

                        <div className="relay-header-actions">
                            <Link
                                href={dashboard()}
                                className="relay-btn-ghost"
                            >
                                <Activity className="size-3.5" />
                                <span className="hidden sm:inline">
                                    Activity
                                </span>
                            </Link>
                            <UserAvatarMenu className="size-8 text-[11px]" />
                        </div>
                    </header>

                    {mobileNavOpen ? (
                        <button
                            type="button"
                            className="relay-sidebar-overlay"
                            aria-label="Close navigation"
                            onClick={() => setMobileNavOpen(false)}
                        />
                    ) : null}

                    <aside
                        className={cn(
                            'relay-sidebar',
                            mobileNavOpen && 'is-open',
                        )}
                    >
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <div className="relay-nav-label">Account</div>
                            <nav className="space-y-0.5" aria-label="Settings">
                                {sidebarNavItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={cn(
                                            'relay-nav-item',
                                            isCurrentOrParentUrl(item.href) &&
                                                'relay-nav-item-active',
                                        )}
                                        onClick={() => setMobileNavOpen(false)}
                                    >
                                        <item.icon className="size-3.5" />
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="relay-quota mt-3">
                            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                                <KeyRound className="size-3.5 text-signal" />
                                Account settings
                            </div>
                            <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                                Profile, access, and local display preferences.
                            </p>
                        </div>
                    </aside>

                    <main className="relay-main overflow-y-auto">
                        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-7">
                            <div className="mb-6 sm:mb-7">
                                <h1 className="text-xl font-semibold tracking-tight">
                                    Settings
                                </h1>
                                <p className="mt-1 text-[13px] text-muted-foreground">
                                    Manage your Azodik Relay profile and account
                                    settings.
                                </p>
                            </div>

                            <section className="max-w-2xl space-y-10 sm:space-y-12">
                                {children}
                            </section>
                        </div>
                    </main>
                </div>
            </div>
            <Toaster />
        </>
    );
}
