import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import type { ActivityController } from '../useActivityController';

type ComplaintsSectionProps = {
    ctx: ActivityController;
};

const COMPLAINT_TABLE_COLS =
    'grid-cols-[minmax(260px,1fr)_120px_minmax(220px,1fr)_120px]';

export default function ComplaintsSection({ ctx }: ComplaintsSectionProps) {
    const {
        emails,
        sectionHref,
        complaintRows,
        complaintRate,
        complaintSuppressionCount,
        lastComplaintTime,
    } = ctx;

    return (
        <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
            <section className="relay-stat-strip cols-4 mb-4">
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Complaint rate
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {complaintRate}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                        {emails.length} messages in range
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Total complaints
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {complaintRows.length}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                        selected range
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Suppressed
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {complaintSuppressionCount}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                        complaint recipients
                    </div>
                </div>
                <div>
                    <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        Last complaint
                    </div>
                    <div className="mt-3 text-xl font-semibold">
                        {lastComplaintTime}
                    </div>
                    <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                        observed event
                    </div>
                </div>
            </section>

            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 text-[12.5px] sm:flex-row sm:items-center">
                <AlertTriangle className="size-3.5 shrink-0 text-amber-400" />
                <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">
                        Monitor complaint feedback loops before AWS reputation
                        is affected.
                    </div>
                    <div className="text-muted-foreground">
                        Complaint events create suppressions as SES webhook
                        events arrive.
                    </div>
                </div>
                <Link
                    href={sectionHref('suppressions')}
                    className="w-full rounded-md border border-border px-2 py-1 text-center text-[11.5px] font-medium sm:w-auto"
                >
                    Review suppressions
                </Link>
            </div>

            <div className="mb-2 flex items-baseline gap-3">
                <h2 className="text-[13px] font-semibold">
                    Feedback loop reports
                </h2>
                <span className="text-[11.5px] text-muted-foreground">
                    {complaintRows.length} in selected range
                </span>
            </div>

            {/* Mobile: stack as cards */}
            <div className="grid gap-2 lg:hidden">
                {complaintRows.length === 0 ? (
                    <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
                        No complaints in this range.
                    </div>
                ) : (
                    complaintRows.map((email) => (
                        <div
                            key={email.id}
                            className="rounded-xl border border-border bg-card p-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 truncate font-semibold">
                                    {email.recipientEmails ||
                                        email.recipientEmail}
                                </div>
                                <span className="shrink-0 rounded bg-red-400/10 px-1.5 py-0.5 font-mono text-[10.5px] text-red-400">
                                    abuse
                                </span>
                            </div>
                            <div className="mt-2 truncate text-[13px] text-muted-foreground">
                                {email.subject}
                            </div>
                            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                                {email.time}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop: wide table */}
            <div className="hidden lg:block">
                <div className="relay-wide-table">
                    <div className="min-w-[760px]">
                        <div
                            className={`grid gap-3 border-b border-border bg-muted px-3.5 py-2 font-mono text-[10.5px] tracking-widest text-muted-foreground uppercase ${COMPLAINT_TABLE_COLS}`}
                        >
                            <div>Recipient</div>
                            <div>Type</div>
                            <div>Subject</div>
                            <div className="text-right">When</div>
                        </div>
                        {complaintRows.map((email) => (
                            <div
                                key={email.id}
                                className={`grid min-h-11 items-center gap-3 border-b border-border px-3.5 py-2 text-[12.5px] last:border-b-0 ${COMPLAINT_TABLE_COLS}`}
                            >
                                <div className="truncate font-medium">
                                    {email.recipientEmails ||
                                        email.recipientEmail}
                                </div>
                                <div>
                                    <span className="rounded bg-red-400/10 px-1.5 py-0.5 font-mono text-[10.5px] text-red-400">
                                        abuse
                                    </span>
                                </div>
                                <div className="truncate text-muted-foreground">
                                    {email.subject}
                                </div>
                                <div className="text-right font-mono text-muted-foreground">
                                    {email.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
