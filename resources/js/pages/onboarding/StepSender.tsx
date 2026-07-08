import { Check, Copy } from 'lucide-react';
import { inputClassName, monoInputClassName } from '@/lib/form-classes';
import type { DnsRecord, OnboardingForm } from './types';

type StepSenderProps = {
    form: OnboardingForm;
    dnsRows: DnsRecord[];
    copied: string;
    copy: (value: string, key: string) => void;
};

export default function StepSender({
    form,
    dnsRows,
    copied,
    copy,
}: StepSenderProps) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">Default from email</span>
                    <input
                        value={form.data.default_from_email}
                        onChange={(event) =>
                            form.setData(
                                'default_from_email',
                                event.target.value,
                            )
                        }
                        type="email"
                        placeholder="notifications@mail.example.com"
                        className={inputClassName}
                    />
                    {form.errors.default_from_email ? (
                        <span className="text-xs text-red-500">
                            {form.errors.default_from_email}
                        </span>
                    ) : null}
                </label>
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">Default from name</span>
                    <input
                        value={form.data.default_from_name}
                        onChange={(event) =>
                            form.setData(
                                'default_from_name',
                                event.target.value,
                            )
                        }
                        className={inputClassName}
                    />
                </label>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">Sending domain</span>
                    <input
                        value={form.data.sending_domain}
                        onChange={(event) =>
                            form.setData('sending_domain', event.target.value)
                        }
                        placeholder="mail.example.com"
                        className={monoInputClassName}
                    />
                    {form.errors.sending_domain ? (
                        <span className="text-xs text-red-500">
                            {form.errors.sending_domain}
                        </span>
                    ) : null}
                </label>
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">
                        SES configuration set
                    </span>
                    <input
                        value={form.data.ses_configuration_set}
                        onChange={(event) =>
                            form.setData(
                                'ses_configuration_set',
                                event.target.value,
                            )
                        }
                        placeholder="Optional"
                        className={monoInputClassName}
                    />
                </label>
            </div>

            {dnsRows.length > 0 ? (
                <div className="overflow-x-auto rounded-md border border-border dark:border-border">
                    <div className="grid min-w-[760px] grid-cols-[72px_minmax(240px,1fr)_38px_minmax(240px,1.15fr)_38px] bg-muted px-3 py-2 font-mono text-[10.5px] tracking-widest text-muted-foreground uppercase dark:bg-background">
                        <div>Type</div>
                        <div>Host</div>
                        <div />
                        <div>Value</div>
                        <div />
                    </div>
                    {dnsRows.map((record, index) => (
                        <div
                            key={`${record.name}-${index}`}
                            className="grid min-w-[760px] grid-cols-[72px_minmax(240px,1fr)_38px_minmax(240px,1.15fr)_38px] items-center border-t border-border px-3 py-2 dark:border-border"
                        >
                            <div className="font-mono">{record.type}</div>
                            <div className="truncate font-mono text-xs">
                                {record.name}
                            </div>
                            <button
                                type="button"
                                className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground active:translate-y-px dark:hover:bg-zinc-900 dark:hover:text-foreground"
                                aria-label="Copy DNS host"
                                onClick={() =>
                                    copy(record.name, `dns-name-${index}`)
                                }
                            >
                                {copied === `dns-name-${index}` ? (
                                    <Check className="size-3.5" />
                                ) : (
                                    <Copy className="size-3.5" />
                                )}
                            </button>
                            <div className="truncate font-mono text-xs text-muted-foreground">
                                {record.value}
                            </div>
                            <button
                                type="button"
                                className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground active:translate-y-px dark:hover:bg-zinc-900 dark:hover:text-foreground"
                                aria-label="Copy DNS value"
                                onClick={() =>
                                    copy(record.value, `dns-value-${index}`)
                                }
                            >
                                {copied === `dns-value-${index}` ? (
                                    <Check className="size-3.5" />
                                ) : (
                                    <Copy className="size-3.5" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
