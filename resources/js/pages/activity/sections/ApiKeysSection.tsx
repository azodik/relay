import { Copy, KeyRound, RefreshCw, Trash2 } from 'lucide-react';
import { fieldCompactClassName } from '@/lib/form-classes';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type ApiKeysSectionProps = {
    ctx: ActivityController;
};

const API_KEY_TABLE_COLS =
    'grid-cols-[240px_170px_minmax(190px,1fr)_150px_160px_120px_92px_92px]';

export default function ApiKeysSection({ ctx }: ApiKeysSectionProps) {
    const {
        s,
        workspace,
        apiKeys,
        apiKeyStats,
        issueApiKey,
        toggleApiKeyScope,
        apiKeyScopes,
        rotateApiKey,
        deleteApiKey,
        apiKeyScopeOptions,
        copyText,
        relativeTime,
    } = ctx;

    return (
        <div className="grid gap-4">
            <section className="relay-stat-strip cols-3">
                {apiKeyStats.map((stat) => (
                    <div key={stat.label}>
                        <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                            {stat.label}
                        </div>
                        <div className="mt-3 text-xl font-semibold">
                            {stat.value}
                        </div>
                        <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                            {stat.meta}
                        </div>
                    </div>
                ))}
            </section>

            {workspace.can_manage_api_keys ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        issueApiKey();
                    }}
                    className="grid gap-3 rounded-xl border border-border bg-card p-3 sm:p-4"
                >
                    <div className="relay-section-head">
                        <div className="flex min-w-0 items-start gap-3">
                            <KeyRound className="mt-0.5 size-4 shrink-0 text-signal" />
                            <div className="min-w-0">
                                <div className="font-semibold">
                                    Keys are only shown once at creation.
                                </div>
                                <div className="mt-0.5 text-[12px] text-muted-foreground">
                                    Pick scopes, optional expiration, then
                                    copy the full token from the reveal dialog.
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={s.apiKeyForm.scopes.length === 0}
                            className="w-full rounded-lg bg-signal px-3 py-2 text-[12px] font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto"
                        >
                            + Create key
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_220px_minmax(260px,1fr)]">
                        <label>
                            <span className="mb-1.5 block text-xs text-muted-foreground">
                                Key name
                            </span>
                            <input
                                placeholder="Production · Harborlight"
                                required
                                className={cn(
                                    fieldCompactClassName,
                                    'w-full text-[12px]',
                                )}
                                value={s.apiKeyForm.name}
                                onChange={(e) => {
                                    s.apiKeyForm.name = e.target.value;
                                }}
                            />
                        </label>
                        <label>
                            <span className="mb-1.5 block text-xs text-muted-foreground">
                                Expires
                            </span>
                            <input
                                type="datetime-local"
                                className={cn(
                                    fieldCompactClassName,
                                    'w-full text-[12px]',
                                )}
                                value={s.apiKeyForm.expires_at}
                                onChange={(e) => {
                                    s.apiKeyForm.expires_at = e.target.value;
                                }}
                            />
                        </label>
                        <div>
                            <span className="mb-1.5 block text-xs text-muted-foreground">
                                Scopes
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {apiKeyScopeOptions.map((scope) => (
                                    <button
                                        key={scope.value}
                                        type="button"
                                        onClick={() => {
                                            toggleApiKeyScope(scope.value);
                                        }}
                                        className={cn(
                                            'rounded-md border px-3 py-2 font-mono text-xs',
                                            s.apiKeyForm.scopes.includes(
                                                scope.value,
                                            )
                                                ? 'border-signal bg-signal/10 text-signal dark:text-signal'
                                                : 'border-border text-muted-foreground dark:border-border',
                                        )}
                                    >
                                        {scope.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            ) : null}

            {/* Mobile: stack as cards */}
            <div className="grid gap-2 lg:hidden">
                {apiKeys.length === 0 ? (
                    <div className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">
                        No API keys yet.
                    </div>
                ) : (
                    apiKeys.map((apiKey, index) => (
                        <div
                            key={apiKey.id}
                            className="rounded-xl border border-border bg-card p-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        {apiKey.name}
                                    </div>
                                    <div className="font-mono text-[11px] text-muted-foreground">
                                        k_{index.toString().padStart(5, '0')}
                                    </div>
                                </div>
                                {workspace.can_manage_api_keys ? (
                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            type="button"
                                            title="Rotate API key"
                                            onClick={() => {
                                                rotateApiKey(apiKey);
                                            }}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                                        >
                                            <RefreshCw className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete API key"
                                            onClick={() => {
                                                deleteApiKey(apiKey);
                                            }}
                                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                <span className="font-mono text-[12px] text-muted-foreground">
                                    {apiKey.prefix}••••
                                </span>
                                <button
                                    type="button"
                                    title="Copy key prefix"
                                    onClick={() => {
                                        copyText(apiKey.prefix);
                                    }}
                                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                                >
                                    <Copy className="size-3.5" />
                                </button>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1">
                                {apiKeyScopes(apiKey).map((scope) => (
                                    <span
                                        key={`${apiKey.id}-${scope}`}
                                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground dark:bg-muted"
                                    >
                                        {scope}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
                                <div>
                                    <div className="uppercase tracking-widest">
                                        Last used
                                    </div>
                                    <div className="mt-0.5 text-[12px]">
                                        {apiKey.last_used_at
                                            ? relativeTime(apiKey.last_used_at)
                                            : 'never'}
                                    </div>
                                </div>
                                <div>
                                    <div className="uppercase tracking-widest">
                                        Expires
                                    </div>
                                    <div className="mt-0.5 text-[12px]">
                                        {apiKey.expires_at
                                            ? relativeTime(apiKey.expires_at)
                                            : 'never'}
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
                    <div className="min-w-[1230px]">
                        <div
                            className={cn(
                                'grid border-b border-border bg-muted px-3 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase dark:border-border dark:bg-card',
                                API_KEY_TABLE_COLS,
                            )}
                        >
                            <div>Name</div>
                            <div>Key prefix</div>
                            <div>Scopes</div>
                            <div>Last used</div>
                            <div>Last app/IP</div>
                            <div>Expires</div>
                            <div>Created</div>
                            <div></div>
                        </div>
                        {apiKeys.map((apiKey, index) => (
                            <div
                                key={apiKey.id}
                                className={cn(
                                    'grid min-h-12 items-center gap-2 border-b border-border px-3 py-2 text-[13px] last:border-b-0 dark:border-border',
                                    API_KEY_TABLE_COLS,
                                )}
                            >
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        {apiKey.name}
                                    </div>
                                    <div className="font-mono text-[11px] text-muted-foreground">
                                        k_{index.toString().padStart(5, '0')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[12px] text-muted-foreground">
                                        {apiKey.prefix}••••
                                    </span>
                                    <button
                                        type="button"
                                        title="Copy key prefix"
                                        onClick={() => {
                                            copyText(apiKey.prefix);
                                        }}
                                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted dark:hover:text-foreground"
                                    >
                                        <Copy className="size-3.5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {apiKeyScopes(apiKey).map((scope) => (
                                        <span
                                            key={`${apiKey.id}-${scope}`}
                                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground dark:bg-muted"
                                        >
                                            {scope}
                                        </span>
                                    ))}
                                </div>
                                <div className="font-mono text-[12px] text-muted-foreground">
                                    {apiKey.last_used_at
                                        ? relativeTime(apiKey.last_used_at)
                                        : 'never'}
                                </div>
                                <div className="min-w-0 font-mono text-[12px] text-muted-foreground">
                                    <div className="truncate">
                                        {apiKey.last_used_ip || '—'}
                                    </div>
                                    <div className="truncate text-[10px]">
                                        {apiKey.last_used_user_agent ||
                                            'no app'}
                                    </div>
                                </div>
                                <div className="font-mono text-[12px] text-muted-foreground">
                                    {apiKey.expires_at
                                        ? relativeTime(apiKey.expires_at)
                                        : 'never'}
                                </div>
                                <div className="font-mono text-[12px] text-muted-foreground">
                                    {apiKey.created_at}
                                </div>
                                {workspace.can_manage_api_keys ? (
                                    <div className="flex justify-end gap-1">
                                        <button
                                            type="button"
                                            title="Rotate API key"
                                            onClick={() => {
                                                rotateApiKey(apiKey);
                                            }}
                                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                                        >
                                            <RefreshCw className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete API key"
                                            onClick={() => {
                                                deleteApiKey(apiKey);
                                            }}
                                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
