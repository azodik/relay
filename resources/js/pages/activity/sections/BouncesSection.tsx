import { Link } from '@inertiajs/react';
import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type BouncesSectionProps = {
    ctx: ActivityController;
};

const BOUNCE_TABLE_COLS =
    'grid-cols-[96px_minmax(220px,1fr)_minmax(260px,1.25fr)_130px_minmax(180px,.8fr)_minmax(190px,.9fr)_100px_100px_42px]';

export default function BouncesSection({ ctx }: BouncesSectionProps) {
    const {
        s,
        bounceMetrics,
        bounceQueue,
        exportHref,
        sectionHref,
        softBounceCount,
        hardBounceCount,
        retrySoftBounces,
    } = ctx;

    return (
        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
            <section className="relay-stat-strip mb-4 sm:grid-cols-3 xl:grid-cols-5">
                {bounceMetrics.map((metric) => (
                    <div key={metric.label}>
                        <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                            {metric.label}
                        </div>
                        <div className="mt-3 text-xl font-semibold tracking-tight">
                            {metric.value}
                        </div>
                        <div
                            className={cn(
                                'mt-1 text-sm',
                                metric.tone === 'danger'
                                    ? 'text-red-400'
                                    : metric.tone === 'success'
                                      ? 'text-emerald-400'
                                      : 'text-muted-foreground',
                            )}
                        >
                            {metric.meta}
                        </div>
                    </div>
                ))}
            </section>

            <section>
                <div className="relay-section-head">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold">
                            Bounce queue
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {hardBounceCount} hard · {softBounceCount} soft ·{' '}
                            {s.selectedRange}
                        </p>
                    </div>
                    <div className="relay-section-actions">
                        <a
                            href={exportHref}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground sm:w-auto"
                        >
                            <ArrowUpRight className="size-4" />
                            Export
                        </a>
                        <button
                            type="button"
                            disabled={softBounceCount === 0}
                            onClick={retrySoftBounces}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                        >
                            <RefreshCw className="size-4" />
                            Retry soft bounces
                        </button>
                    </div>
                </div>

                {/* Mobile: stack as cards */}
                <div className="mt-4 grid gap-2 lg:hidden">
                    {bounceQueue.length === 0 ? (
                        <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
                            No bounces in this range.
                        </div>
                    ) : (
                        bounceQueue.map((bounce) => (
                            <Link
                                key={bounce.id}
                                href={`${sectionHref('activity')}?q=${encodeURIComponent(bounce.id)}`}
                                className="rounded-xl border border-border bg-card p-3 hover:bg-muted"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 truncate font-semibold">
                                        {bounce.recipient}
                                    </div>
                                    <span
                                        className={cn(
                                            'shrink-0 rounded-md px-2 py-1 font-mono text-xs',
                                            bounce.type === 'Hard'
                                                ? 'bg-red-500/12 text-red-400'
                                                : 'bg-amber-500/12 text-amber-300',
                                        )}
                                    >
                                        {bounce.type}
                                    </span>
                                </div>
                                <div className="mt-2 truncate text-[13px] text-muted-foreground">
                                    {bounce.reason}
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
                                    <div>
                                        <div className="tracking-widest uppercase">
                                            SMTP
                                        </div>
                                        <div className="mt-0.5 truncate text-[12px]">
                                            {bounce.smtp}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="tracking-widest uppercase">
                                            When
                                        </div>
                                        <div className="mt-0.5 text-[12px]">
                                            {bounce.when}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="tracking-widest uppercase">
                                            MX
                                        </div>
                                        <div className="mt-0.5 truncate text-[12px]">
                                            {bounce.mx}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="tracking-widest uppercase">
                                            Attempts
                                        </div>
                                        <div className="mt-0.5 text-[12px]">
                                            {bounce.attempts}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
                                    {bounce.template || 'custom'}
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Desktop: wide table */}
                <div className="mt-4 hidden lg:block">
                    <div className="relay-wide-table">
                        <div className="min-w-[1080px]">
                            <div
                                className={cn(
                                    'grid border-b border-border bg-muted px-3 py-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase',
                                    BOUNCE_TABLE_COLS,
                                )}
                            >
                                <div>Type</div>
                                <div>Recipient</div>
                                <div>Reason</div>
                                <div>SMTP</div>
                                <div>MX</div>
                                <div>Template</div>
                                <div className="text-right">Attempts</div>
                                <div className="text-right">When</div>
                                <div></div>
                            </div>
                            <div className="max-h-[58vh] overflow-auto">
                                {bounceQueue.map((bounce) => (
                                    <Link
                                        key={bounce.id}
                                        href={`${sectionHref('activity')}?q=${encodeURIComponent(bounce.id)}`}
                                        className={cn(
                                            'grid items-center border-b border-border px-3 py-2.5 text-sm last:border-b-0 hover:bg-muted',
                                            BOUNCE_TABLE_COLS,
                                        )}
                                    >
                                        <span>
                                            <span
                                                className={cn(
                                                    'rounded-md px-2 py-1 font-mono text-xs',
                                                    bounce.type === 'Hard'
                                                        ? 'bg-red-500/12 text-red-400'
                                                        : 'bg-amber-500/12 text-amber-300',
                                                )}
                                            >
                                                {bounce.type}
                                            </span>
                                        </span>
                                        <span className="truncate font-medium">
                                            {bounce.recipient}
                                        </span>
                                        <span className="truncate text-muted-foreground">
                                            {bounce.reason}
                                        </span>
                                        <span className="truncate font-mono text-muted-foreground">
                                            {bounce.smtp}
                                        </span>
                                        <span className="truncate font-mono text-muted-foreground">
                                            {bounce.mx}
                                        </span>
                                        <span className="truncate font-mono text-muted-foreground">
                                            {bounce.template || 'custom'}
                                        </span>
                                        <span className="text-right font-mono">
                                            {bounce.attempts}
                                        </span>
                                        <span className="text-right text-muted-foreground">
                                            {bounce.when}
                                        </span>
                                        <span className="text-right text-muted-foreground">
                                            ›
                                        </span>
                                    </Link>
                                ))}
                                {bounceQueue.length === 0 ? (
                                    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                                        No bounces in this range.
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
