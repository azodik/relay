import { Cloud, Copy } from 'lucide-react';
import { fieldClassName } from '@/lib/form-classes';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type WebhooksSectionProps = {
    ctx: ActivityController;
};

export default function WebhooksSection({ ctx }: WebhooksSectionProps) {
    const {
        s,
        webhooks,
        webhookStats,
        webhookDeliveries,
        sesWebhookUrl,
        webhookEventOptions,
        resetWebhookForm,
        editWebhook,
        toggleWebhookEvent,
        saveWebhookEndpoint,
        copyText,
    } = ctx;

    return (
        <div className="grid gap-4">
            <section className="relay-stat-strip cols-4">
                {webhookStats.map((stat) => (
                    <div key={stat.label}>
                        <div className="font-sans text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            {stat.label}
                        </div>
                        <div className="mt-3 font-sans text-xl font-semibold tracking-tight">
                            {stat.value}
                        </div>
                        <div
                            className={cn(
                                'mt-1 text-sm',
                                stat.tone === 'danger'
                                    ? 'text-red-400'
                                    : stat.tone === 'success'
                                      ? 'text-emerald-400'
                                      : 'text-muted-foreground',
                            )}
                        >
                            {stat.meta}
                        </div>
                    </div>
                ))}
            </section>

            <section className="rounded-xl border border-border bg-card">
                <div className="relay-section-head border-b border-border px-3 py-3 sm:px-4">
                    <div className="min-w-0">
                        <h2 className="font-sans text-base font-semibold">
                            Webhook endpoints
                        </h2>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            HTTP endpoints that receive signed Azodik Relay event
                            payloads.
                        </p>
                    </div>
                    <div className="relay-section-actions">
                        <button
                            type="button"
                            onClick={() => {
                                s.showWebhookDeliveries =
                                    !s.showWebhookDeliveries;
                            }}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 font-sans text-sm font-semibold text-muted-foreground hover:text-foreground sm:w-auto"
                        >
                            <Cloud className="size-4" />
                            {s.showWebhookDeliveries
                                ? 'Hide deliveries'
                                : 'View deliveries'}
                        </button>
                        <button
                            type="button"
                            onClick={resetWebhookForm}
                            className="w-full rounded-lg bg-signal px-3 py-2 font-sans text-sm font-bold text-signal-foreground sm:w-auto"
                        >
                            + Add endpoint
                        </button>
                    </div>
                </div>

                {s.showWebhookForm ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            saveWebhookEndpoint();
                        }}
                        className="grid gap-4 border-b border-border p-3 font-sans sm:p-4"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    Endpoint URL
                                </span>
                                <input
                                    type="url"
                                    placeholder="https://example.com/webhooks/relay"
                                    required
                                    className={fieldClassName}
                                    value={s.webhookForm.url}
                                    onChange={(e) => {
                                        s.webhookForm.url = e.target.value;
                                    }}
                                />
                            </label>
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    Status
                                </span>
                                <select
                                    className={fieldClassName}
                                    value={s.webhookForm.status}
                                    onChange={(e) => {
                                        s.webhookForm.status = e.target.value;
                                    }}
                                >
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">
                                Events
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {webhookEventOptions.map((event) => (
                                    <button
                                        key={event}
                                        type="button"
                                        onClick={() => {
                                            toggleWebhookEvent(event);
                                        }}
                                        className={cn(
                                            'rounded-md border px-3 py-1.5 font-mono text-xs',
                                            s.webhookForm.events.includes(event)
                                                ? 'border-signal bg-signal/10 text-signal'
                                                : 'border-border text-muted-foreground',
                                        )}
                                    >
                                        {event}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    s.showWebhookForm = false;
                                }}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-signal px-4 py-2 text-sm font-bold text-signal-foreground"
                            >
                                {s.editingWebhookId
                                    ? 'Save endpoint'
                                    : 'Create endpoint'}
                            </button>
                        </div>
                    </form>
                ) : null}

                {/* Mobile cards */}
                <div className="grid gap-0 lg:hidden">
                    {webhooks.length === 0 ? (
                        <div className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
                            No webhook endpoints yet.
                        </div>
                    ) : (
                        webhooks.map((webhook) => (
                            <div
                                key={webhook.id}
                                className="border-b border-border p-3 last:border-b-0"
                            >
                                <div className="flex items-start gap-2">
                                    <span
                                        className={cn(
                                            'mt-1.5 size-2.5 shrink-0 rounded-full',
                                            webhook.status === 'healthy'
                                                ? 'bg-emerald-400'
                                                : webhook.status === 'failing'
                                                  ? 'bg-red-400'
                                                  : 'bg-muted',
                                        )}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-mono text-sm">
                                            {webhook.url}
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                                            <span>{webhook.id}</span>
                                            <span>
                                                · secret{' '}
                                                {webhook.secret_prefix}...
                                            </span>
                                            <button
                                                type="button"
                                                title="Copy endpoint URL"
                                                onClick={() => {
                                                    copyText(webhook.url);
                                                }}
                                                className="hover:text-foreground"
                                            >
                                                <Copy className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            editWebhook(webhook);
                                        }}
                                        className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {webhook.events.map((event) => (
                                        <span
                                            key={`${webhook.id}-${event}`}
                                            className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                                        >
                                            {event}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
                                    <span
                                        className={cn(
                                            'rounded-md px-2 py-1',
                                            webhook.status === 'healthy'
                                                ? 'bg-emerald-500/12 text-emerald-400'
                                                : webhook.status === 'failing'
                                                  ? 'bg-red-500/12 text-red-400'
                                                  : 'bg-muted text-muted-foreground',
                                        )}
                                    >
                                        {webhook.status}
                                    </span>
                                    <span>{webhook.success_rate}</span>
                                    <span>{webhook.last_delivered_at}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden lg:block">
                    <div className="relay-wide-table rounded-none border-0 border-t">
                        <div className="min-w-[980px]">
                            <div className="grid grid-cols-[32px_minmax(300px,1.3fr)_minmax(280px,1fr)_120px_120px_120px_150px] border-b border-border bg-muted px-3 py-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                <div></div>
                                <div>URL</div>
                                <div>Events</div>
                                <div>Status</div>
                                <div>Success</div>
                                <div>Last</div>
                                <div></div>
                            </div>
                            {webhooks.map((webhook) => (
                                <div
                                    key={webhook.id}
                                    className="grid grid-cols-[32px_minmax(300px,1.3fr)_minmax(280px,1fr)_120px_120px_120px_150px] items-center border-b border-border px-3 py-2.5 font-sans text-sm last:border-b-0"
                                >
                                    <span
                                        className={cn(
                                            'size-2.5 rounded-full',
                                            webhook.status === 'healthy'
                                                ? 'bg-emerald-400'
                                                : webhook.status === 'failing'
                                                  ? 'bg-red-400'
                                                  : 'bg-muted',
                                        )}
                                    />
                                    <div className="min-w-0">
                                        <div className="truncate font-mono">
                                            {webhook.url}
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                                            <span>{webhook.id}</span>
                                            <span>
                                                · secret{' '}
                                                {webhook.secret_prefix}...
                                            </span>
                                            <button
                                                type="button"
                                                title="Copy endpoint URL"
                                                onClick={() => {
                                                    copyText(webhook.url);
                                                }}
                                                className="hover:text-foreground"
                                            >
                                                <Copy className="size-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {webhook.events.map((event) => (
                                            <span
                                                key={`${webhook.id}-${event}`}
                                                className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                                            >
                                                {event}
                                            </span>
                                        ))}
                                    </div>
                                    <span
                                        className={cn(
                                            'rounded-md px-2 py-1 font-mono text-xs',
                                            webhook.status === 'healthy'
                                                ? 'bg-emerald-500/12 text-emerald-400'
                                                : webhook.status === 'failing'
                                                  ? 'bg-red-500/12 text-red-400'
                                                  : 'bg-muted text-muted-foreground',
                                        )}
                                    >
                                        {webhook.status}
                                    </span>
                                    <span
                                        className={cn(
                                            'font-mono',
                                            webhook.success_rate.startsWith('8')
                                                ? 'text-red-400'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {webhook.success_rate}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {webhook.last_delivered_at}
                                    </span>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editWebhook(webhook);
                                            }}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {sesWebhookUrl ? (
                <section className="rounded-xl border border-border bg-card p-3 font-sans sm:p-4">
                    <div className="relay-section-head">
                        <div className="min-w-0">
                            <h2 className="text-base font-semibold">
                                SES inbound webhook
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Use this URL in SNS/SES so Azodik Relay can
                                ingest deliveries, opens, clicks, bounces, and
                                complaints.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                copyText(sesWebhookUrl);
                            }}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground sm:ml-auto sm:w-auto"
                        >
                            <Copy className="size-4" /> Copy URL
                        </button>
                    </div>
                    <div className="mt-4 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs text-foreground/80">
                        {sesWebhookUrl}
                    </div>
                </section>
            ) : null}

            {s.showWebhookDeliveries ? (
                <section className="rounded-xl border border-border bg-card">
                    <div className="border-b border-border px-3 py-3 sm:px-4">
                        <h2 className="font-sans text-base font-semibold">
                            Recent deliveries
                        </h2>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            Latest webhook delivery attempts across all
                            endpoints.
                        </p>
                    </div>

                    <div className="grid gap-0 lg:hidden">
                        {webhookDeliveries.length === 0 ? (
                            <div className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
                                No webhook deliveries yet.
                            </div>
                        ) : (
                            webhookDeliveries.map((delivery) => (
                                <div
                                    key={delivery.id}
                                    className="border-b border-border p-3 font-mono text-sm last:border-b-0"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className={cn(
                                                'rounded-md px-2 py-1 text-xs',
                                                delivery.status === 'ok'
                                                    ? 'bg-emerald-500/12 text-emerald-400'
                                                    : 'bg-red-500/12 text-red-400',
                                            )}
                                        >
                                            {delivery.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {delivery.when}
                                        </span>
                                    </div>
                                    <div className="mt-2">{delivery.event}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                        {delivery.endpoint} · HTTP{' '}
                                        {delivery.http} · {delivery.latency} ms
                                    </div>
                                    <div className="mt-1 truncate text-xs text-muted-foreground">
                                        {delivery.id}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="hidden lg:block">
                        <div className="relay-wide-table rounded-none border-0">
                            <div className="min-w-[880px]">
                                <div className="grid grid-cols-[94px_160px_180px_100px_120px_1fr_120px] border-b border-border bg-muted px-3 py-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                    <div>Status</div>
                                    <div>Event</div>
                                    <div>Endpoint</div>
                                    <div>HTTP</div>
                                    <div>Latency</div>
                                    <div>ID</div>
                                    <div>When</div>
                                </div>
                                <div className="max-h-[44vh] overflow-auto">
                                    {webhookDeliveries.map((delivery) => (
                                        <div
                                            key={delivery.id}
                                            className="grid grid-cols-[94px_160px_180px_100px_120px_1fr_120px] border-b border-border px-3 py-2.5 font-mono text-sm last:border-b-0"
                                        >
                                            <span
                                                className={cn(
                                                    'rounded-md px-2 py-1 text-xs',
                                                    delivery.status === 'ok'
                                                        ? 'bg-emerald-500/12 text-emerald-400'
                                                        : 'bg-red-500/12 text-red-400',
                                                )}
                                            >
                                                {delivery.status}
                                            </span>
                                            <span>{delivery.event}</span>
                                            <span className="text-muted-foreground">
                                                {delivery.endpoint}
                                            </span>
                                            <span
                                                className={cn(
                                                    delivery.status === 'ok'
                                                        ? ''
                                                        : 'text-red-400',
                                                )}
                                            >
                                                {delivery.http}
                                            </span>
                                            <span
                                                className={cn(
                                                    delivery.status === 'ok'
                                                        ? ''
                                                        : 'text-red-400',
                                                )}
                                            >
                                                {delivery.latency} ms
                                            </span>
                                            <span className="text-muted-foreground">
                                                {delivery.id}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {delivery.when}
                                            </span>
                                        </div>
                                    ))}
                                    {webhookDeliveries.length === 0 ? (
                                        <div className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
                                            No webhook deliveries yet.
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}
        </div>
    );
}
