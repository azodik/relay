import {
    Check,
    Copy,
    RefreshCw,
    Trash2,
    X,
} from 'lucide-react';
import { fieldClassName } from '@/lib/form-classes';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type IdentitiesSectionProps = {
    ctx: ActivityController;
};

export default function IdentitiesSection({ ctx }: IdentitiesSectionProps) {
    const {
        s,
        project,
        workspace,
        setup,
        domains,
        source,
        quota,
        quotaDetail,
        quotaStatus,
        saveSource,
        selectedIdentity,
        selectedIdentityRecords,
        identityStats,
        addDomain,
        checkDomain,
        deleteDomain,
        copyAllDns,
        copyDnsValue,
    } = ctx;

    return (
        <>
            <div className="relay-identities-split -m-3 grid min-h-full grid-cols-1 border-t border-border sm:-m-4 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="border-r border-border bg-muted dark:border-border dark:bg-background">
                    <div className="flex items-center justify-between border-b border-border px-3 py-2.5 dark:border-border">
                        <div className="font-sans text-sm font-semibold">
                            Identities{' '}
                            <span className="ml-1 text-muted-foreground">
                                {domains.length}
                            </span>
                        </div>
                        {workspace.can_manage_domains ? (
                            <button
                                onClick={() => {
                                    s.showNewIdentity = !s.showNewIdentity;
                                }}
                                className="rounded-lg bg-signal px-3 py-2 font-sans text-sm font-bold text-foreground"
                            >
                                + New identity
                            </button>
                        ) : null}
                    </div>
                    {s.showNewIdentity && workspace.can_manage_domains ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addDomain();
                            }}
                            className="grid gap-3 border-b border-border p-4 font-sans dark:border-border"
                        >
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    Domain
                                </span>
                                <input
                                    placeholder="mail.example.com"
                                    required
                                    className={fieldClassName}
                                    value={s.domainForm.domain}
                                    onChange={(e) => {
                                        s.domainForm.domain = e.target.value;
                                    }}
                                />
                            </label>
                            <button className="w-fit rounded-lg bg-signal px-3 py-2 text-sm font-bold text-signal-foreground">
                                Create identity
                            </button>
                        </form>
                    ) : null}
                    {domains.map((domain) => (
                        <button
                            key={domain.domain}
                            onClick={() => {
                                s.selectedIdentityDomain = domain.domain;
                            }}
                            className={cn(
                                'w-full border-b border-border px-3 py-2.5 text-left font-sans hover:bg-card dark:border-zinc-900 dark:hover:bg-zinc-950',
                                {
                                    'border-l-2 border-l-signal bg-card dark:bg-zinc-950':
                                        selectedIdentity?.domain ===
                                        domain.domain,
                                },
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="truncate text-base font-semibold">
                                    {domain.domain}
                                </span>
                                <span
                                    className={cn(
                                        'rounded-md px-2 py-0.5 font-mono text-xs',
                                        domain.status === 'verified' ||
                                            domain.status === 'local'
                                            ? 'bg-emerald-500/12 text-emerald-400'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {domain.status === 'local'
                                        ? 'verified'
                                        : domain.status}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                {project.region} · {quota.sent.toLocaleString()}{' '}
                                sent · 30d
                            </div>
                            <div className="mt-3 flex gap-2">
                                {(domain.dns_records ?? [])
                                    .slice(0, 3)
                                    .map((record) => (
                                        <span
                                            key={`${domain.domain}-${record.name}`}
                                            className={cn(
                                                'rounded-md px-2 py-1 font-mono text-xs',
                                                record.status === 'ok'
                                                    ? 'bg-emerald-500/12 text-emerald-400'
                                                    : 'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {record.type}{' '}
                                            {record.status === 'ok'
                                                ? 'pass'
                                                : 'pending'}
                                        </span>
                                    ))}
                            </div>
                        </button>
                    ))}
                </aside>

                {selectedIdentity ? (
                    <section className="min-w-0 overflow-auto p-3 font-sans sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold tracking-tight">
                                        {selectedIdentity.domain}
                                    </h2>
                                    <span className="rounded-md bg-emerald-500/12 px-2.5 py-1 font-mono text-xs text-emerald-400">
                                        {selectedIdentity.status === 'local'
                                            ? 'verified'
                                            : selectedIdentity.status}
                                    </span>
                                </div>
                                <div className="mt-2 font-mono text-sm text-muted-foreground">
                                    {project.region} · Amazon SES · verified{' '}
                                    {selectedIdentity.verified_at ||
                                        'pending DNS'}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:ml-auto sm:justify-end">
                                {workspace.can_manage_domains ? (
                                    <button
                                        disabled={
                                            s.checkingDomainId ===
                                            selectedIdentity.id
                                        }
                                        title="Resolve the DNS records and update their status"
                                        onClick={checkDomain}
                                        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                    >
                                        <RefreshCw
                                            className={cn('size-4', {
                                                'animate-spin':
                                                    s.checkingDomainId ===
                                                    selectedIdentity.id,
                                            })}
                                        />
                                        {s.checkingDomainId ===
                                        selectedIdentity.id
                                            ? 'Checking...'
                                            : 'Re-check DNS'}
                                    </button>
                                ) : null}

                                {workspace.can_manage_domains ? (
                                    <button
                                        onClick={() => {
                                            s.showSourceSettings =
                                                !s.showSourceSettings;
                                        }}
                                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground active:scale-[0.98] dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                    >
                                        {s.showSourceSettings
                                            ? 'Hide source settings'
                                            : 'Source settings'}
                                    </button>
                                ) : null}

                                {workspace.can_manage_domains ? (
                                    <button
                                        disabled={
                                            s.deletingDomainId ===
                                            selectedIdentity.id
                                        }
                                        title="Delete this sending identity from Azodik Relay"
                                        onClick={deleteDomain}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 dark:border-red-500/20 dark:hover:bg-red-500/10"
                                    >
                                        <Trash2
                                            className={cn('size-4', {
                                                'animate-pulse':
                                                    s.deletingDomainId ===
                                                    selectedIdentity.id,
                                            })}
                                        />
                                        {s.deletingDomainId ===
                                        selectedIdentity.id
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <div className="relay-stat-strip cols-4 mt-4">
                            {identityStats.map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-xs tracking-widest text-muted-foreground uppercase">
                                        {stat.label}
                                    </div>
                                    <div className="mt-2 text-xl font-semibold">
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5">
                            <h3 className="font-semibold">Authentication</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                DKIM, SPF, and DMARC alignment
                            </p>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {['DKIM', 'SPF', 'DMARC'].map((label) => (
                                    <div
                                        key={label}
                                        className="rounded-lg border border-border p-4 dark:border-border"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">
                                                {label}
                                            </span>
                                            <span className="rounded-md bg-emerald-500/12 px-2 py-0.5 font-mono text-xs text-emerald-400">
                                                {selectedIdentity.status ===
                                                'pending'
                                                    ? 'pending'
                                                    : 'pass'}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                            {label === 'DKIM'
                                                ? 'SES DKIM selectors are present and aligned.'
                                                : label === 'SPF'
                                                  ? 'TXT record authorizes Amazon SES as a sending source.'
                                                  : 'Policy record is present for domain alignment.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="font-semibold">
                                        DNS records
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        These records must remain in place for
                                        sends to continue.
                                    </p>
                                </div>
                                <button
                                    onClick={copyAllDns}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground active:scale-[0.98] sm:ml-auto dark:border-border dark:text-muted-foreground dark:hover:text-foreground"
                                >
                                    {s.copiedDnsKey === 'all' ? (
                                        <Check className="size-4 text-emerald-400" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                    {s.copiedDnsKey === 'all'
                                        ? 'Copied'
                                        : 'Copy all'}
                                </button>
                            </div>

                            <div className="mt-4 grid gap-2 lg:hidden">
                                {selectedIdentityRecords.map((record) => (
                                    <div
                                        key={`${record.type}-${record.name}-mobile`}
                                        className="rounded-lg border border-border p-3 font-mono text-sm dark:border-border"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'rounded-md px-2 py-1 text-xs',
                                                    record.status === 'ok'
                                                        ? 'bg-emerald-500/12 text-emerald-400'
                                                        : 'bg-muted text-muted-foreground',
                                                )}
                                            >
                                                {record.status === 'ok'
                                                    ? 'ok'
                                                    : 'wait'}
                                            </span>
                                            <span className="font-semibold">
                                                {record.type}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                                    Host
                                                </div>
                                                <div className="mt-1 break-all">
                                                    {record.name}
                                                </div>
                                            </div>
                                            <button
                                                title={
                                                    s.copiedDnsKey ===
                                                    `${record.type}-${record.name}-host`
                                                        ? 'Copied host'
                                                        : 'Copy host'
                                                }
                                                onClick={() => {
                                                    copyDnsValue(
                                                        `${record.type}-${record.name}-host`,
                                                        record.name,
                                                    );
                                                }}
                                                className={cn(
                                                    'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 dark:hover:bg-muted dark:hover:text-foreground',
                                                    {
                                                        'bg-emerald-500/10 text-emerald-500':
                                                            s.copiedDnsKey ===
                                                            `${record.type}-${record.name}-host`,
                                                    },
                                                )}
                                            >
                                                {s.copiedDnsKey ===
                                                `${record.type}-${record.name}-host` ? (
                                                    <Check className="size-4" />
                                                ) : (
                                                    <Copy className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="mt-3 flex items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                                    Value
                                                </div>
                                                <div className="mt-1 break-all text-muted-foreground">
                                                    {record.value}
                                                </div>
                                            </div>
                                            <button
                                                title={
                                                    s.copiedDnsKey ===
                                                    `${record.type}-${record.name}-value`
                                                        ? 'Copied value'
                                                        : 'Copy value'
                                                }
                                                onClick={() => {
                                                    copyDnsValue(
                                                        `${record.type}-${record.name}-value`,
                                                        record.value,
                                                    );
                                                }}
                                                className={cn(
                                                    'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 dark:hover:bg-muted dark:hover:text-foreground',
                                                    {
                                                        'bg-emerald-500/10 text-emerald-500':
                                                            s.copiedDnsKey ===
                                                            `${record.type}-${record.name}-value`,
                                                    },
                                                )}
                                            >
                                                {s.copiedDnsKey ===
                                                `${record.type}-${record.name}-value` ? (
                                                    <Check className="size-4" />
                                                ) : (
                                                    <Copy className="size-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 hidden lg:block">
                                <div className="relay-wide-table">
                                    <div className="min-w-[740px]">
                                        <div className="grid grid-cols-[90px_90px_minmax(220px,1fr)_40px_minmax(260px,1.2fr)_40px] border-b border-border bg-muted px-3 py-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase dark:border-border dark:bg-zinc-950">
                                            <div>Status</div>
                                            <div>Type</div>
                                            <div>Host</div>
                                            <div></div>
                                            <div>Value</div>
                                            <div></div>
                                        </div>
                                        {selectedIdentityRecords.map(
                                            (record) => (
                                                <div
                                                    key={`${record.type}-${record.name}`}
                                                    className="grid grid-cols-[90px_90px_minmax(220px,1fr)_40px_minmax(260px,1.2fr)_40px] items-center border-b border-border px-3 py-3 font-mono text-sm last:border-b-0 dark:border-zinc-900"
                                                >
                                                    <div>
                                                        <span
                                                            className={cn(
                                                                'rounded-md px-2 py-1 text-xs',
                                                                record.status ===
                                                                    'ok'
                                                                    ? 'bg-emerald-500/12 text-emerald-400'
                                                                    : 'bg-muted text-muted-foreground',
                                                            )}
                                                        >
                                                            {record.status ===
                                                            'ok'
                                                                ? 'ok'
                                                                : 'wait'}
                                                        </span>
                                                    </div>
                                                    <div>{record.type}</div>
                                                    <div className="truncate">
                                                        {record.name}
                                                    </div>
                                                    <button
                                                        title={
                                                            s.copiedDnsKey ===
                                                            `${record.type}-${record.name}-host`
                                                                ? 'Copied host'
                                                                : 'Copy host'
                                                        }
                                                        onClick={() => {
                                                            copyDnsValue(
                                                                `${record.type}-${record.name}-host`,
                                                                record.name,
                                                            );
                                                        }}
                                                        className={cn(
                                                            'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 dark:hover:bg-muted dark:hover:text-foreground',
                                                            {
                                                                'bg-emerald-500/10 text-emerald-500':
                                                                    s.copiedDnsKey ===
                                                                    `${record.type}-${record.name}-host`,
                                                            },
                                                        )}
                                                    >
                                                        {s.copiedDnsKey ===
                                                        `${record.type}-${record.name}-host` ? (
                                                            <Check className="size-4" />
                                                        ) : (
                                                            <Copy className="size-4" />
                                                        )}
                                                    </button>
                                                    <div className="truncate text-muted-foreground">
                                                        {record.value}
                                                    </div>
                                                    <button
                                                        title={
                                                            s.copiedDnsKey ===
                                                            `${record.type}-${record.name}-value`
                                                                ? 'Copied value'
                                                                : 'Copy value'
                                                        }
                                                        onClick={() => {
                                                            copyDnsValue(
                                                                `${record.type}-${record.name}-value`,
                                                                record.value,
                                                            );
                                                        }}
                                                        className={cn(
                                                            'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 dark:hover:bg-muted dark:hover:text-foreground',
                                                            {
                                                                'bg-emerald-500/10 text-emerald-500':
                                                                    s.copiedDnsKey ===
                                                                    `${record.type}-${record.name}-value`,
                                                            },
                                                        )}
                                                    >
                                                        {s.copiedDnsKey ===
                                                        `${record.type}-${record.name}-value` ? (
                                                            <Check className="size-4" />
                                                        ) : (
                                                            <Copy className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {s.showSourceSettings ? (
                            <section className="mt-5 rounded-lg border border-border p-4 dark:border-border">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">
                                        SES source settings
                                    </h3>
                                    <button
                                        title="Close source settings"
                                        onClick={() => {
                                            s.showSourceSettings = false;
                                        }}
                                        className="text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        saveSource();
                                    }}
                                    className="mt-5 grid gap-4"
                                >
                                    {source?.uses_instance_role ? (
                                        <div className="rounded-lg border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal-foreground dark:border-signal/30 dark:bg-signal/10 dark:text-signal">
                                            Production is using the EC2 instance
                                            role. AWS key fields below are
                                            optional overrides for self-hosted
                                            or non-role deployments.
                                        </div>
                                    ) : null}
                                    <div className="grid gap-4 rounded-lg border border-border p-3 dark:border-border">
                                        <div className="font-semibold">
                                            Source
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Name
                                                </span>
                                                <input
                                                    required
                                                    className={fieldClassName}
                                                    value={s.sourceForm.name}
                                                    onChange={(e) => {
                                                        s.sourceForm.name =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Environment
                                                </span>
                                                <input
                                                    required
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm.environment
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.environment =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    SES region
                                                </span>
                                                <input
                                                    required
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm.ses_region
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.ses_region =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 rounded-lg border border-border p-3 dark:border-border">
                                        <div className="font-semibold">
                                            Default sender
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    Default from email
                                                </span>
                                                <input
                                                    type="email"
                                                    required
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm
                                                            .default_from_email
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.default_from_email =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    SES configuration set
                                                </span>
                                                <input
                                                    placeholder="Optional"
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm
                                                            .ses_configuration_set
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.ses_configuration_set =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 rounded-lg border border-border p-3 dark:border-border">
                                        <div className="font-semibold">
                                            Credentials
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    AWS access key ID{' '}
                                                    {source?.uses_instance_role ? (
                                                        <span className="font-normal">
                                                            (optional override)
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <input
                                                    autoComplete="off"
                                                    placeholder="Leave blank to keep saved value"
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm
                                                            .aws_access_key_id
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.aws_access_key_id =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    AWS secret access key{' '}
                                                    {source?.uses_instance_role ? (
                                                        <span className="font-normal">
                                                            (optional override)
                                                        </span>
                                                    ) : null}
                                                </span>
                                                <input
                                                    type="password"
                                                    autoComplete="new-password"
                                                    placeholder="Leave blank to keep saved value"
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm
                                                            .aws_secret_access_key
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.aws_secret_access_key =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                            <label className="grid gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    AWS session token
                                                </span>
                                                <input
                                                    autoComplete="off"
                                                    placeholder="Optional STS token"
                                                    className={fieldClassName}
                                                    value={
                                                        s.sourceForm
                                                            .aws_session_token
                                                    }
                                                    onChange={(e) => {
                                                        s.sourceForm.aws_session_token =
                                                            e.target.value;
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid gap-2 rounded-lg border border-border p-3 text-sm dark:border-border">
                                        <div className="font-semibold">
                                            SES events
                                        </div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            {setup.webhook_url ||
                                                'Save a source first'}
                                        </div>
                                    </div>
                                    <div className="grid gap-2 rounded-lg border border-border p-3 text-sm dark:border-border">
                                        <div className="font-semibold">
                                            Quota
                                        </div>
                                        <div className="text-muted-foreground">
                                            {quotaDetail} · {quotaStatus}
                                        </div>
                                    </div>
                                    <button className="w-fit rounded-lg bg-signal px-4 py-2 text-sm font-bold text-signal-foreground">
                                        Save source
                                    </button>
                                </form>
                            </section>
                        ) : null}
                    </section>
                ) : null}
            </div>
        </>
    );
}
