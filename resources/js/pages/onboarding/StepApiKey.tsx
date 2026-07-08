import { Check, Copy, KeyRound, Send } from 'lucide-react';
import { inputClassName } from '@/lib/form-classes';
import type { OnboardingForm } from './types';

type StepApiKeyProps = {
    form: OnboardingForm;
    codeSnippet: string;
    copied: string;
    copy: (value: string, key: string) => void;
};

export default function StepApiKey({
    form,
    codeSnippet,
    copied,
    copy,
}: StepApiKeyProps) {
    return (
        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="grid min-w-0 gap-3">
                <div className="flex items-center gap-2.5">
                    <KeyRound className="size-4 text-teal-500" />
                    <div>
                        <h3 className="font-semibold">First application key</h3>
                        <p className="text-[12px] text-muted-foreground">
                            Leave enabled for the easiest Laravel app
                            connection.
                        </p>
                    </div>
                </div>
                <label className="flex items-center gap-2">
                    <input
                        checked={form.data.create_api_key}
                        onChange={(event) =>
                            form.setData('create_api_key', event.target.checked)
                        }
                        type="checkbox"
                        className="size-4 rounded border-border accent-signal"
                    />
                    Create the first production key
                </label>
                <input
                    value={form.data.api_key_name}
                    onChange={(event) =>
                        form.setData('api_key_name', event.target.value)
                    }
                    disabled={!form.data.create_api_key}
                    className={`${inputClassName} disabled:opacity-50`}
                />
            </div>

            <div className="rounded-md border border-border bg-muted p-3 dark:border-border dark:bg-background">
                <div className="mb-2 flex items-center gap-2">
                    <Send className="size-4 text-teal-500" />
                    <span className="font-semibold">Laravel env</span>
                </div>
                <div className="flex items-start gap-2">
                    <code className="min-w-0 flex-1 whitespace-pre-wrap font-mono text-[11.5px] leading-5">
                        {codeSnippet}
                    </code>
                    <button
                        type="button"
                        className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground active:translate-y-px dark:hover:bg-zinc-900 dark:hover:text-foreground"
                        aria-label="Copy Laravel environment snippet"
                        onClick={() => copy(codeSnippet, 'env-snippet')}
                    >
                        {copied === 'env-snippet' ? (
                            <Check className="size-3.5" />
                        ) : (
                            <Copy className="size-3.5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
