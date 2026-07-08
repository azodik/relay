import { Head, Link } from '@inertiajs/react';
import { createElement, useEffect, type ReactNode } from 'react';
import {
    AlertTriangle,
    Cloud,
    Copy,
    KeyRound,
    Menu,
    RefreshCw,
    Search,
    Send,
    X,
} from 'lucide-react';
import AppLogoIcon from '@/components/AppLogoIcon';
import MetricSparkline from '@/components/MetricSparkline';
import UserAvatarMenu from '@/components/UserAvatarMenu';
import { fieldClassName } from '@/lib/form-classes';
import { slugify } from '@/lib/slugify';
import { timeRangeOptions } from '@/lib/time-range';
import { cn } from '@/lib/utils';
import type { ActivityController } from './useActivityController';

type ActivityShellProps = {
    ctx: ActivityController;
    children: ReactNode;
};

export default function ActivityShell({ ctx, children }: ActivityShellProps) {
    const {
        s,
        project,
        workspace,
        projects,
        section,
        metrics,
        quota,
        searchInputRef,
        buildLabel,
        navItems,
        configItems,
        isMailSection,
        showMetrics,
        pageTitle,
        quotaPercent,
        hasProviderQuota,
        quotaTitle,
        quotaStatus,
        sectionHref,
        sectionPath,
        exportHref,
        applySearch,
        setRange,
        syncQuota,
        props,
        closeConfirmation,
        confirmAction,
        copyRevealedApiKey,
        closeApiKeyModal,
        selectTextArea,
        copyWebhookSecret,
        closeWebhookSecretModal,
        copyText,
        createProject,
    } = ctx;

    useEffect(() => {
        if (!s.showMobileNav) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                s.showMobileNav = false;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [s, s.showMobileNav]);

    useEffect(() => {
        if (!s.showMobileSearch) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                s.showMobileSearch = false;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        window.requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [s, s.showMobileSearch, searchInputRef]);

    const closeMobileNav = (): void => {
        s.showMobileNav = false;
    };

    return (
        <>
            <Head title={section.replace('-', ' ')} />
            <div className="relay-shell">
                <div className="relay-grid">
                    <header
                        className={cn(
                            'relay-header',
                            isMailSection &&
                                s.showMobileSearch &&
                                'is-search-open',
                        )}
                    >
                        <button
                            type="button"
                            className="relay-icon-btn relay-header-menu lg:hidden"
                            aria-label={
                                s.showMobileNav
                                    ? 'Close navigation'
                                    : 'Open navigation'
                            }
                            aria-expanded={s.showMobileNav}
                            onClick={() => {
                                s.showMobileNav = !s.showMobileNav;
                                s.showMobileSearch = false;
                            }}
                        >
                            {s.showMobileNav ? (
                                <X className="size-4" />
                            ) : (
                                <Menu className="size-4" />
                            )}
                        </button>

                        <Link
                            href={sectionHref('activity')}
                            className="relay-header-brand"
                        >
                            <span className="relay-brand-mark">
                                <AppLogoIcon className="size-[15px] sm:size-[17px]" />
                            </span>
                            <span className="hidden font-sans text-sm font-semibold tracking-tight lg:inline">
                                Relay
                            </span>
                        </Link>

                        <div className="relay-header-crumbs relative flex min-w-0 items-center gap-1 font-sans text-[12px] text-muted-foreground sm:text-[12.5px]">
                            <Link
                                href={sectionHref('projects')}
                                className="hidden hover:text-foreground md:inline"
                            >
                                Projects
                            </Link>
                            <span className="hidden text-muted-foreground md:inline">
                                /
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    s.showProjectMenu = !s.showProjectMenu;
                                }}
                                className="max-w-[5.5rem] truncate rounded-md px-1 py-0.5 font-medium text-foreground hover:bg-muted sm:max-w-[12rem] sm:px-1.5 sm:py-1"
                            >
                                {project.slug}
                            </button>
                            <span className="hidden text-muted-foreground lg:inline">
                                /
                            </span>
                            <span className="hidden font-medium text-foreground capitalize lg:inline">
                                {section.replace('-', ' ')}
                            </span>

                            {s.showProjectMenu ? (
                                <div className="absolute top-9 left-0 z-40 w-[min(310px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/20">
                                    <div className="border-b border-border px-3 py-2">
                                        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                            {workspace.name}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            Switch project or create a new
                                            isolated sending workspace.
                                        </div>
                                    </div>
                                    <div className="max-h-[260px] overflow-auto p-1">
                                        {projects.map((item) => (
                                            <Link
                                                key={item.slug}
                                                href={item.href}
                                                className={cn(
                                                    'grid grid-cols-[1fr_auto] gap-3 rounded-md px-2.5 py-2 hover:bg-muted',
                                                    {
                                                        'bg-muted':
                                                            item.is_current,
                                                    },
                                                )}
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-semibold text-foreground">
                                                        {item.name}
                                                    </span>
                                                    <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">
                                                        {item.slug} ·{' '}
                                                        {item.environment} ·{' '}
                                                        {item.region}
                                                    </span>
                                                </span>
                                                <span className="text-right font-mono text-[11px] text-muted-foreground">
                                                    {item.emails_count} sends
                                                    <br /> {item.domains_count}{' '}
                                                    domains
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="border-t border-border p-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                s.showProjectForm = true;
                                                s.showProjectMenu = false;
                                            }}
                                            className="w-full rounded-md border border-border px-3 py-2 text-left text-sm font-semibold text-foreground/80 hover:bg-muted"
                                        >
                                            + New project
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {isMailSection ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    applySearch();
                                }}
                                className={cn(
                                    'relay-search relay-header-search',
                                    !s.showMobileSearch && 'max-lg:!hidden',
                                )}
                            >
                                <Search className="size-3.5 shrink-0" />
                                <input
                                    placeholder="Search messages, recipients, IDs…"
                                    ref={searchInputRef}
                                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                                    value={s.searchQuery}
                                    onChange={(e) => {
                                        s.searchQuery = e.target.value;
                                    }}
                                />
                                <button
                                    type="button"
                                    className="relay-icon-btn -mr-1 size-7 lg:hidden"
                                    aria-label="Close search"
                                    onClick={() => {
                                        s.showMobileSearch = false;
                                    }}
                                >
                                    <X className="size-3.5" />
                                </button>
                                <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10.5px] text-muted-foreground lg:inline">
                                    ⌘K
                                </kbd>
                            </form>
                        ) : (
                            <div className="relay-header-search max-lg:!hidden" />
                        )}

                        <div className="relay-header-actions">
                            {isMailSection ? (
                                <>
                                    <button
                                        type="button"
                                        className={cn(
                                            'relay-icon-btn lg:hidden',
                                            s.showMobileSearch && 'is-active',
                                            s.searchQuery && 'text-foreground',
                                        )}
                                        aria-label={
                                            s.showMobileSearch
                                                ? 'Close search'
                                                : 'Search'
                                        }
                                        aria-expanded={s.showMobileSearch}
                                        onClick={() => {
                                            s.showMobileSearch =
                                                !s.showMobileSearch;
                                            s.showMobileNav = false;
                                        }}
                                    >
                                        <Search className="size-3.5" />
                                    </button>
                                    <Link
                                        href={`${sectionPath}?q=${encodeURIComponent(s.searchQuery)}&range=${encodeURIComponent(s.selectedRange)}`}
                                        title="Refresh"
                                        className="relay-icon-btn hidden lg:grid"
                                    >
                                        <RefreshCw className="size-3.5" />
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={sectionHref('setup')}
                                    className="relay-btn-ghost hidden lg:inline-flex"
                                >
                                    Setup
                                </Link>
                            )}

                            <Link
                                href={sectionHref('send')}
                                className="relay-btn-primary"
                                title="Send"
                            >
                                <Send className="size-3.5" />
                                <span className="hidden lg:inline">Send</span>
                            </Link>
                            <UserAvatarMenu className="size-8 text-[11px]" />
                        </div>
                    </header>

                    {s.showMobileNav ? (
                        <button
                            type="button"
                            className="relay-sidebar-overlay"
                            aria-label="Close navigation"
                            onClick={closeMobileNav}
                        />
                    ) : null}

                    <aside
                        className={cn(
                            'relay-sidebar',
                            s.showMobileNav && 'is-open',
                        )}
                    >
                        <div className="min-h-0 flex-1 overflow-y-auto pb-28">
                            <div className="relay-nav-label">Mail</div>
                            <nav className="space-y-0.5">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={closeMobileNav}
                                        className={cn(
                                            'relay-nav-item',
                                            props.section === item.section &&
                                                'relay-nav-item-active',
                                        )}
                                    >
                                        {createElement(item.icon, {
                                            className: 'size-3.5',
                                        })}
                                        <span className="truncate">
                                            {item.label}
                                        </span>
                                        <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">
                                            {item.count}
                                        </span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-3 border-t border-border pt-2">
                                <div className="relay-nav-label">
                                    Configuration
                                </div>
                                <nav className="space-y-0.5">
                                    {configItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={closeMobileNav}
                                            className={cn(
                                                'relay-nav-item',
                                                props.section ===
                                                    item.section &&
                                                    'relay-nav-item-active',
                                            )}
                                        >
                                            {createElement(item.icon, {
                                                className: 'size-3.5',
                                            })}
                                            <span className="truncate">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        <div className="relay-quota absolute right-2 bottom-3 left-2">
                            <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                {quotaTitle}
                            </div>
                            <div className="mt-2 flex justify-between font-sans text-[11.5px] text-muted-foreground">
                                <span>{quota.sent.toLocaleString()} sent</span>
                                {hasProviderQuota ? (
                                    <span className="font-mono text-foreground">
                                        {quotaPercent}%
                                    </span>
                                ) : (
                                    <span className="font-mono text-foreground">
                                        30d
                                    </span>
                                )}
                            </div>
                            {hasProviderQuota ? (
                                <div className="mt-2 h-1 rounded-full bg-muted">
                                    <div
                                        className="h-1 rounded-full bg-signal"
                                        style={{ width: `${quotaPercent}%` }}
                                    />
                                </div>
                            ) : null}
                            <div className="mt-2 flex justify-between border-t border-border pt-2 font-sans text-[11.5px] text-muted-foreground">
                                <span>
                                    {hasProviderQuota
                                        ? 'Daily limit'
                                        : 'Provider quota'}
                                </span>
                                {!hasProviderQuota ? (
                                    <button
                                        type="button"
                                        disabled={s.syncingQuota}
                                        title="Sync SES sending quota from the configured source"
                                        onClick={() => {
                                            syncQuota();
                                        }}
                                        className="inline-flex items-center gap-1 font-mono text-foreground transition hover:text-signal disabled:cursor-wait disabled:opacity-60"
                                    >
                                        <RefreshCw
                                            className={cn('size-3', {
                                                'animate-spin': s.syncingQuota,
                                            })}
                                        />{' '}
                                        {s.syncingQuota ? 'syncing' : 'sync'}
                                    </button>
                                ) : (
                                    <span className="font-mono text-foreground">
                                        {`${quota.limit?.toLocaleString()} / ${quota.rate ?? 'unknown'}/s`}
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 truncate font-sans text-[10.5px] text-muted-foreground">
                                {quotaStatus}
                            </div>
                            <div className="mt-2 border-t border-border pt-2 font-mono text-[10px] text-muted-foreground">
                                {buildLabel}
                            </div>
                        </div>
                    </aside>

                    <main className="relay-main">
                        <section className="relay-pagebar">
                            <h1 className="m-0 min-w-0 shrink truncate font-sans text-[14px] font-semibold tracking-tight sm:text-[15px]">
                                {pageTitle}
                            </h1>
                            <span className="hidden items-center gap-1.5 rounded-full border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground lg:inline-flex">
                                <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(92,212,148,0.14)]" />
                                live
                            </span>

                            {isMailSection ? (
                                <div className="relay-range-scroll ml-auto min-w-0 flex-1 justify-end">
                                    <div className="flex shrink-0 rounded-md border border-border bg-card p-0.5 text-[10.5px] sm:text-[11px]">
                                        {timeRangeOptions.map((range) => (
                                            <button
                                                key={range}
                                                type="button"
                                                onClick={() => {
                                                    setRange(range);
                                                }}
                                                className={cn(
                                                    'h-6 shrink-0 rounded px-1.5 font-medium text-muted-foreground sm:px-2',
                                                    {
                                                        'bg-muted text-foreground':
                                                            range ===
                                                            s.selectedRange,
                                                    },
                                                )}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                    <a
                                        href={exportHref}
                                        className="hidden h-7 items-center rounded-md px-2 font-sans text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground lg:inline-flex"
                                    >
                                        Export
                                    </a>
                                </div>
                            ) : null}
                        </section>

                        {showMetrics ? (
                            <section className="relay-metrics">
                                {metrics.map((metric) => (
                                    <div key={metric.label}>
                                        <div className="truncate font-mono text-[9.5px] font-medium tracking-widest text-muted-foreground uppercase">
                                            {metric.label}
                                        </div>
                                        <div className="mt-1 font-sans text-[17px] leading-none font-semibold tracking-tight text-foreground">
                                            {metric.value}
                                        </div>
                                        {metric.spark?.length ? (
                                            <div className="mt-2 h-8 w-full">
                                                <MetricSparkline
                                                    points={metric.spark}
                                                    trend={
                                                        metric.trend === 'down'
                                                            ? 'down'
                                                            : 'up'
                                                    }
                                                />
                                            </div>
                                        ) : null}
                                        {metric.delta ? (
                                            <div
                                                className={cn(
                                                    'mt-1 inline-flex max-w-full items-center gap-1 truncate font-mono text-[10px]',
                                                    {
                                                        'text-emerald-400':
                                                            metric.tone ===
                                                            'good',
                                                        'text-red-400':
                                                            metric.tone ===
                                                            'bad',
                                                        'text-muted-foreground':
                                                            metric.tone ===
                                                            'neutral',
                                                    },
                                                )}
                                            >
                                                <span>
                                                    {metric.trend === 'up'
                                                        ? '▲'
                                                        : metric.trend ===
                                                            'down'
                                                          ? '▼'
                                                          : '•'}
                                                </span>{' '}
                                                {metric.delta}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </section>
                        ) : null}

                        {children}
                    </main>
                </div>

                {s.showProjectForm ? (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/75 px-4 backdrop-blur-sm">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createProject();
                            }}
                            className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        New project
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Create an isolated project for a
                                        product, customer, service, or
                                        environment group.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        s.showProjectForm = false;
                                    }}
                                    className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="mt-5 grid gap-4">
                                <label className="grid gap-2 text-sm">
                                    <span className="text-muted-foreground">
                                        Project name
                                    </span>
                                    <input
                                        placeholder="Northwind production"
                                        required
                                        className={fieldClassName}
                                        value={s.projectForm.name}
                                        onChange={(e) => {
                                            s.projectForm.name = e.target.value;
                                        }}
                                    />
                                </label>
                                <label className="grid gap-2 text-sm">
                                    <span className="text-muted-foreground">
                                        Slug
                                    </span>
                                    <input
                                        placeholder="northwind-production"
                                        className={cn(
                                            fieldClassName,
                                            'font-mono',
                                        )}
                                        value={s.projectForm.slug}
                                        onChange={(e) => {
                                            s.projectForm.slug = slugify(
                                                e.target.value,
                                            );
                                        }}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        Leave blank to generate it from the
                                        project name.
                                    </span>
                                </label>
                            </div>
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        s.showProjectForm = false;
                                    }}
                                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-signal px-4 py-2 text-sm font-bold text-signal-foreground"
                                >
                                    Create project
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}

                {s.confirmation ? (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/75 px-4 backdrop-blur-sm">
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="confirmation-title"
                            className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={cn(
                                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                                        s.confirmation.tone === 'danger'
                                            ? 'bg-red-500/12 text-red-500'
                                            : 'bg-amber-500/12 text-amber-500',
                                    )}
                                >
                                    <AlertTriangle className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2
                                        id="confirmation-title"
                                        className="text-lg font-semibold"
                                    >
                                        {s.confirmation.title}
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        {s.confirmation.body}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    title="Close confirmation"
                                    onClick={closeConfirmation}
                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeConfirmation}
                                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmAction}
                                    className={cn(
                                        'rounded-lg px-4 py-2 text-sm font-bold',
                                        s.confirmation.tone === 'danger'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-amber-400 text-amber-950',
                                    )}
                                >
                                    {s.confirmation.actionLabel}
                                </button>
                            </div>
                        </section>
                    </div>
                ) : null}

                {s.revealedApiKey ? (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/75 px-4 backdrop-blur-sm">
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="api-key-title"
                            className="w-full max-w-2xl rounded-xl border border-border bg-card p-5 font-sans shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-signal text-foreground">
                                    <KeyRound className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2
                                        id="api-key-title"
                                        className="text-xl font-semibold tracking-tight"
                                    >
                                        Copy this API key now
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        For security, Azodik Relay only shows
                                        the full token once. Store it in your
                                        application secrets before closing this
                                        dialog.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    title="Close API key dialog"
                                    onClick={closeApiKeyModal}
                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="mt-5 rounded-xl border border-border bg-muted p-4">
                                <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    New API key
                                </div>
                                <textarea
                                    value={s.revealedApiKey}
                                    readOnly
                                    rows={3}
                                    aria-label="Full API key"
                                    onFocus={selectTextArea}
                                    onClick={selectTextArea}
                                    className="mt-3 w-full resize-none rounded-md border border-border bg-card p-3 font-mono text-sm leading-6 break-all text-foreground outline-none selection:bg-signal/40 focus:border-signal"
                                />
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-muted-foreground">
                                    This token will not be available again after
                                    this page state is dismissed.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={copyRevealedApiKey}
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground"
                                    >
                                        <Copy className="size-4" />{' '}
                                        {s.apiKeyCopied ? 'Copied' : 'Copy key'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeApiKeyModal}
                                        className="rounded-lg bg-signal px-4 py-2 text-sm font-bold text-signal-foreground"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : null}

                {s.revealedWebhookEndpoint ? (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/75 px-4 backdrop-blur-sm">
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="webhook-secret-title"
                            className="w-full max-w-2xl rounded-xl border border-border bg-card p-5 font-sans shadow-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-signal text-foreground">
                                    <Cloud className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2
                                        id="webhook-secret-title"
                                        className="text-xl font-semibold tracking-tight"
                                    >
                                        Copy this webhook secret now
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        Use this secret to verify Azodik Relay
                                        webhook signatures. The full secret is
                                        only shown once.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    title="Close webhook secret dialog"
                                    onClick={closeWebhookSecretModal}
                                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            <div className="mt-5 grid gap-3">
                                <div className="rounded-xl border border-border bg-muted p-4">
                                    <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                        Endpoint URL
                                    </div>
                                    <div className="mt-3 font-mono text-sm leading-6 break-all text-foreground">
                                        {s.revealedWebhookEndpoint?.url}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-border bg-muted p-4">
                                    <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                        Signing secret
                                    </div>
                                    <div className="mt-3 font-mono text-sm leading-6 break-all text-foreground">
                                        {s.revealedWebhookEndpoint?.secret}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Store it in your webhook consumer secrets
                                    before closing this dialog.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            copyText(
                                                s.revealedWebhookEndpoint
                                                    ?.url ?? '',
                                            );
                                        }}
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground"
                                    >
                                        <Copy className="size-4" /> Copy URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={copyWebhookSecret}
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground"
                                    >
                                        <Copy className="size-4" />{' '}
                                        {s.webhookSecretCopied
                                            ? 'Copied'
                                            : 'Copy secret'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeWebhookSecretModal}
                                        className="rounded-lg bg-signal px-4 py-2 text-sm font-bold text-signal-foreground"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : null}
            </div>
        </>
    );
}
