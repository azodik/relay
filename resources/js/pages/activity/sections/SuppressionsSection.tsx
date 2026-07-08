import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type SuppressionsSectionProps = {
    ctx: ActivityController;
};

const SUPPRESSION_TABLE_COLS =
    'grid-cols-[minmax(260px,1fr)_150px_220px_140px_130px]';

export default function SuppressionsSection({
    ctx,
}: SuppressionsSectionProps) {
    const {
        exportHref,
        complaintSuppressionCount,
        suppressionRows,
        bounceSuppressionCount,
        statusClass,
    } = ctx;

    return (
        <div className="grid gap-4">
            <section className="relay-stat-strip sm:grid-cols-3 xl:grid-cols-5">
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Suppressed
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {suppressionRows.length}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                        total
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Bounces
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {bounceSuppressionCount}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-red-400">
                        blocked
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Complaints
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {complaintSuppressionCount}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-violet-400">
                        blocked
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Manual
                    </div>
                    <div className="mt-3 text-xl font-semibold">0</div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                        list
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Policy
                    </div>
                    <div className="mt-3 text-xl font-semibold">Active</div>
                    <div className="mt-1 font-mono text-[12px] text-emerald-400">
                        enforced
                    </div>
                </div>
            </section>

            <section>
                <div className="relay-section-head mb-3">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold">
                            Suppression list
                        </h2>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">
                            Recipients automatically excluded from future
                            sends.
                        </p>
                    </div>
                    <a
                        href={exportHref}
                        className="w-full rounded-lg border border-border px-3 py-2 text-center text-[12px] font-semibold text-muted-foreground hover:text-foreground sm:ml-auto sm:w-auto"
                    >
                        Export
                    </a>
                </div>

                {/* Mobile: stack as cards */}
                <div className="grid gap-2 lg:hidden">
                    {suppressionRows.length === 0 ? (
                        <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
                            No suppressed recipients yet.
                        </div>
                    ) : (
                        suppressionRows.map((email) => (
                            <div
                                key={email.id}
                                className="rounded-xl border border-border bg-card p-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 truncate font-semibold">
                                        {email.email}
                                    </div>
                                    <span
                                        className={cn(
                                            'shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px]',
                                            email.reason === 'complaint'
                                                ? statusClass('complained')
                                                : statusClass('bounced'),
                                        )}
                                    >
                                        {email.reason}
                                    </span>
                                </div>
                                <div className="mt-2 truncate font-mono text-[12px] text-muted-foreground">
                                    {email.source}
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
                                    <div>
                                        <div className="tracking-widest uppercase">
                                            Added
                                        </div>
                                        <div className="mt-0.5 text-[12px]">
                                            {email.added}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="tracking-widest uppercase">
                                            Expires
                                        </div>
                                        <div className="mt-0.5 text-[12px]">
                                            {email.expires}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop: wide table */}
                <div className="hidden lg:block">
                    <div className="relay-wide-table">
                        <div className="min-w-[900px]">
                            <div
                                className={cn(
                                    'grid border-b border-border bg-muted px-3 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase',
                                    SUPPRESSION_TABLE_COLS,
                                )}
                            >
                                <div>Recipient</div>
                                <div>Reason</div>
                                <div>Source</div>
                                <div>Added</div>
                                <div>Expires</div>
                            </div>
                            {suppressionRows.map((email) => (
                                <div
                                    key={email.id}
                                    className={cn(
                                        'grid h-11 items-center border-b border-border px-3 text-[13px] last:border-b-0',
                                        SUPPRESSION_TABLE_COLS,
                                    )}
                                >
                                    <div className="truncate">
                                        {email.email}
                                    </div>
                                    <div>
                                        <span
                                            className={cn(
                                                'rounded px-1.5 py-0.5 font-mono text-[11px]',
                                                email.reason === 'complaint'
                                                    ? statusClass('complained')
                                                    : statusClass('bounced'),
                                            )}
                                        >
                                            {email.reason}
                                        </span>
                                    </div>
                                    <div className="truncate font-mono text-[12px] text-muted-foreground">
                                        {email.source}
                                    </div>
                                    <div className="font-mono text-[12px] text-muted-foreground">
                                        {email.added}
                                    </div>
                                    <div className="font-mono text-[12px] text-muted-foreground">
                                        {email.expires}
                                    </div>
                                </div>
                            ))}
                            {suppressionRows.length === 0 ? (
                                <div className="px-4 py-10 text-center text-[13px] text-muted-foreground">
                                    No suppressed recipients yet.
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
