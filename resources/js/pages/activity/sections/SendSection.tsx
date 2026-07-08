import { Link } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { fieldClassName } from '@/lib/form-classes';
import { cn } from '@/lib/utils';
import type { ActivityController } from '../useActivityController';

type SendSectionProps = {
    ctx: ActivityController;
};

export default function SendSection({ ctx }: SendSectionProps) {
    const {
        s,
        templates,
        canSendEmail,
        projectAction,
        sendEmail,
    } = ctx;

    return (
        <>
            <div className="grid gap-4">
                {!canSendEmail ? (
                    <div className="grid max-w-3xl gap-4 rounded-lg border border-amber-200 bg-amber-50 p-3 font-sans text-amber-950 sm:p-4 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 size-5" />
                            <div>
                                <h2 className="text-base font-semibold">
                                    SES setup required
                                </h2>
                                <p className="mt-1 text-sm">
                                    Add AWS SES credentials and verify a sending
                                    domain before sending email. Azodik Relay
                                    will not record local send events as
                                    successful deliveries.
                                </p>
                            </div>
                        </div>
                        <Link
                            href={projectAction('/identities')}
                            className="w-fit rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-amber-950"
                        >
                            Open identities
                        </Link>
                    </div>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendEmail();
                        }}
                        className="grid max-w-5xl gap-4 rounded-lg border border-border p-3 font-sans sm:p-4 dark:border-border"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">
                                Send email
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Uses the configured project source and sends
                                through AWS SES.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    From
                                </span>
                                <input
                                    required
                                    className={fieldClassName}
                                    value={s.sendForm.from}
                                    onChange={(e) => {
                                        s.sendForm.from = e.target.value;
                                    }}
                                />
                            </label>
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    To
                                </span>
                                <input
                                    placeholder="maya@example.com, team@example.com"
                                    required
                                    className={fieldClassName}
                                    value={s.sendForm.to}
                                    onChange={(e) => {
                                        s.sendForm.to = e.target.value;
                                    }}
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    CC
                                </span>
                                <input
                                    className={fieldClassName}
                                    value={s.sendForm.cc}
                                    onChange={(e) => {
                                        s.sendForm.cc = e.target.value;
                                    }}
                                />
                            </label>
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    BCC
                                </span>
                                <input
                                    className={fieldClassName}
                                    value={s.sendForm.bcc}
                                    onChange={(e) => {
                                        s.sendForm.bcc = e.target.value;
                                    }}
                                />
                            </label>
                            <label className="grid gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    Template
                                </span>
                                <select
                                    className={fieldClassName}
                                    value={s.sendForm.template_id}
                                    onChange={(e) => {
                                        s.sendForm.template_id = e.target.value;
                                    }}
                                >
                                    <option value="">Custom HTML</option>
                                    {templates.map((template) => (
                                        <option
                                            key={template.slug}
                                            value={template.slug}
                                        >
                                            {template.slug}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <label className="grid gap-2 text-sm">
                            <span className="text-muted-foreground">
                                Subject
                            </span>
                            <input
                                required
                                className={fieldClassName}
                                value={s.sendForm.subject}
                                onChange={(e) => {
                                    s.sendForm.subject = e.target.value;
                                }}
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            <span className="text-muted-foreground">HTML</span>
                            <textarea
                                className={cn(
                                    fieldClassName,
                                    'min-h-40 font-mono text-sm',
                                )}
                                value={s.sendForm.html}
                                onChange={(e) => {
                                    s.sendForm.html = e.target.value;
                                }}
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            <span className="text-muted-foreground">
                                Plain text
                            </span>
                            <textarea
                                className={cn(
                                    fieldClassName,
                                    'min-h-24 font-mono text-sm',
                                )}
                                value={s.sendForm.text}
                                onChange={(e) => {
                                    s.sendForm.text = e.target.value;
                                }}
                            />
                        </label>
                        <button className="w-fit rounded-lg bg-signal px-4 py-2 text-sm font-bold text-signal-foreground">
                            Send email
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
