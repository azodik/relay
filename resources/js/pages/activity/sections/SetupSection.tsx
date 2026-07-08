import { Link } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type SetupSectionProps = {
    ctx: ActivityController;
};

export default function SetupSection({ ctx }: SetupSectionProps) {
    const {
        s,
        setup,
        source,
        healthToneClass,
        setupHealthCards,
        credentialMode,
        quotaDetail,
        quotaStatus,
        syncQuota,
    } = ctx;

    return (
        <>
            <div className="grid gap-4">
                {setup.next_step ? (
                    <div className="max-w-5xl rounded-lg border border-signal/40 bg-signal/10 p-3 font-sans text-signal-foreground sm:p-4 dark:border-signal/20 dark:bg-signal/10 dark:text-signal">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="font-mono text-[10px] tracking-widest text-signal uppercase dark:text-signal">
                                    Next action
                                </div>
                                <h2 className="mt-1 text-lg font-semibold">
                                    {setup.next_step.label}
                                </h2>
                                <p className="mt-1 max-w-3xl text-sm opacity-80">
                                    {setup.next_step.description}
                                </p>
                            </div>
                            <Link
                                href={setup.next_step.href}
                                className="rounded-lg bg-signal px-3 py-2 text-sm font-bold text-signal-foreground transition hover:brightness-105 active:translate-y-px"
                            >
                                Continue
                            </Link>
                        </div>
                    </div>
                ) : null}

                <div className="max-w-5xl rounded-lg border border-border p-3 font-sans sm:p-4 dark:border-border">
                    <h2 className="text-lg font-semibold">Sending source</h2>
                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Verify the source, domain, event webhooks, API key, and
                        first send before routing production traffic through
                        Azodik Relay.
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {setupHealthCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-lg border border-border p-3 dark:border-border"
                            >
                                <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                                    {card.label}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                                    <span
                                        className={cn(
                                            'size-2 rounded-full',
                                            healthToneClass(card.tone),
                                        )}
                                    />
                                    <span className="truncate">
                                        {card.value}
                                    </span>
                                </div>
                                <div className="mt-1 truncate text-xs text-muted-foreground">
                                    {card.meta}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 grid gap-3">
                        {setup.steps.map((step) => (
                            <div
                                key={step.key}
                                className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-border p-3 sm:grid-cols-[32px_1fr_auto] sm:p-4 dark:border-border"
                            >
                                <div
                                    className={cn(
                                        'flex size-7 items-center justify-center rounded-full text-sm font-bold',
                                        step.complete
                                            ? 'bg-signal text-foreground'
                                            : 'bg-muted text-muted-foreground dark:bg-zinc-900',
                                    )}
                                >
                                    {step.complete ? '✓' : '·'}
                                </div>
                                <div>
                                    <div className="font-semibold">
                                        {step.label}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        {step.description}
                                    </div>
                                </div>
                                <Link
                                    href={step.href}
                                    className="col-start-2 w-full rounded-lg border border-border px-3 py-2 text-center text-sm font-semibold text-muted-foreground hover:text-foreground sm:col-start-auto sm:w-auto dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                >
                                    {step.complete ? 'Review' : 'Configure'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid max-w-5xl gap-3 rounded-lg border border-border p-3 font-sans text-sm sm:p-4 dark:border-border">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div>
                            <h2 className="text-lg font-semibold">
                                AWS wiring
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {quotaStatus}
                            </p>
                        </div>
                        <button
                            type="button"
                            disabled={s.syncingQuota}
                            title="Sync SES sending quota"
                            onClick={() => {
                                syncQuota();
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:cursor-wait disabled:opacity-60 sm:ml-auto dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                        >
                            <RefreshCw
                                className={cn('size-4', {
                                    'animate-spin': s.syncingQuota,
                                })}
                            />
                            {s.syncingQuota ? 'Syncing...' : 'Sync quota'}
                        </button>
                    </div>
                    <div className="grid gap-2 text-muted-foreground">
                        <div className="grid gap-3 rounded-lg border border-border p-3 text-foreground/80 dark:border-border dark:text-muted-foreground">
                            <div className="grid gap-3 md:grid-cols-5">
                                <div>
                                    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Source
                                    </div>
                                    <div className="mt-1 font-semibold">
                                        {source?.name || 'Production'}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Credentials
                                    </div>
                                    <div className="mt-1 font-semibold">
                                        {credentialMode}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Default sender
                                    </div>
                                    <div className="mt-1 truncate font-semibold">
                                        {source?.default_from_email || 'Missing'}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        SES events
                                    </div>
                                    <div className="mt-1 font-semibold">
                                        {setup.webhook_url
                                            ? 'Webhook ready'
                                            : 'Not configured'}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Quota
                                    </div>
                                    <div className="mt-1 font-semibold">
                                        {quotaDetail}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            1. Deploy the app with `APP_URL`, database, queue
                            worker, and HTTPS configured.
                        </div>
                        <div>
                            2. Create an IAM user or role with SES permissions
                            for `ses:SendRawEmail`, `ses:CreateEmailIdentity`,
                            `ses:GetEmailIdentity`, `ses:GetSendQuota`, and
                            `ses:GetAccount`.
                        </div>
                        <div>
                            3. Save the SES source in Azodik Relay, add your
                            sending domain, then publish the DKIM records in
                            Route 53 or your DNS provider.
                        </div>
                        <div>
                            4. Configure SES event publishing through SNS to
                            this webhook URL:
                        </div>
                        <div className="overflow-auto rounded-md bg-muted p-3 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                            {setup.webhook_url || 'Save a source first'}
                        </div>
                        <div>
                            5. Create an API key and set `MAIL_MAILER=relay`,
                            `RELAY_API_KEY`, and `RELAY_ENDPOINT` in the Laravel
                            app that sends mail.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
