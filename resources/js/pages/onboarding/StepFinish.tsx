import { Check, Copy, MailCheck, Webhook } from 'lucide-react';

type StepFinishProps = {
    webhookUrl: string | undefined;
    copied: string;
    copy: (value: string, key: string) => void;
};

export default function StepFinish({
    webhookUrl,
    copied,
    copy,
}: StepFinishProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4 dark:border-border">
                <div className="flex items-center gap-2.5">
                    <MailCheck className="size-4 text-teal-500" />
                    <h3 className="font-semibold">What happens next</h3>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                    <div>1. Publish DKIM records for the domain.</div>
                    <div>2. Sync quota and confirm source health.</div>
                    <div>3. Connect SES event publishing to Azodik Relay.</div>
                    <div>4. Send one real test email.</div>
                </div>
            </div>
            <div className="rounded-lg border border-border p-4 dark:border-border">
                <div className="flex items-center gap-2.5">
                    <Webhook className="size-4 text-teal-500" />
                    <h3 className="font-semibold">SES/SNS source URL</h3>
                </div>
                <div className="mt-3 flex min-w-0 items-center gap-2">
                    <code className="min-w-0 flex-1 truncate font-mono text-xs">
                        {webhookUrl || 'Created after source save'}
                    </code>
                    {webhookUrl ? (
                        <button
                            type="button"
                            className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground active:translate-y-px dark:hover:bg-zinc-900 dark:hover:text-foreground"
                            aria-label="Copy SES webhook URL"
                            onClick={() => copy(webhookUrl, 'ses-webhook')}
                        >
                            {copied === 'ses-webhook' ? (
                                <Check className="size-3.5" />
                            ) : (
                                <Copy className="size-3.5" />
                            )}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
