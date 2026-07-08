import { Rocket, Server, ShieldCheck } from 'lucide-react';
import { inputClassName, monoInputClassName } from '@/lib/form-classes';
import type { CredentialMode, OnboardingForm } from './types';

type StepCredentialsProps = {
    form: OnboardingForm;
};

export default function StepCredentials({ form }: StepCredentialsProps) {
    const canShowAwsFields = form.data.credential_mode === 'aws_keys';

    const credentialModeCardClass = (mode: CredentialMode): string =>
        form.data.credential_mode === mode
            ? 'border-signal bg-signal/10 dark:bg-signal/10'
            : 'border-border dark:border-border';

    return (
        <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
                <label
                    className={[
                        'grid cursor-pointer gap-2 rounded-lg border p-3 transition',
                        credentialModeCardClass('aws_keys'),
                    ].join(' ')}
                >
                    <input
                        className="sr-only"
                        type="radio"
                        name="credential_mode"
                        value="aws_keys"
                        checked={form.data.credential_mode === 'aws_keys'}
                        onChange={() =>
                            form.setData('credential_mode', 'aws_keys')
                        }
                    />
                    <ShieldCheck className="size-4 text-teal-500" />
                    <span className="font-semibold">IAM keys</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                        Paste an access key and secret for a self-hosted Docker
                        install.
                    </span>
                </label>
                <label
                    className={[
                        'grid cursor-pointer gap-2 rounded-lg border p-3 transition',
                        credentialModeCardClass('instance_role'),
                    ].join(' ')}
                >
                    <input
                        className="sr-only"
                        type="radio"
                        name="credential_mode"
                        value="instance_role"
                        checked={form.data.credential_mode === 'instance_role'}
                        onChange={() =>
                            form.setData('credential_mode', 'instance_role')
                        }
                    />
                    <Server className="size-4 text-teal-500" />
                    <span className="font-semibold">Instance role</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                        Use the IAM role attached to the AWS host running Azodik
                        Relay.
                    </span>
                </label>
                <label
                    className={[
                        'grid cursor-pointer gap-2 rounded-lg border p-3 transition',
                        credentialModeCardClass('configure_later'),
                    ].join(' ')}
                >
                    <input
                        className="sr-only"
                        type="radio"
                        name="credential_mode"
                        value="configure_later"
                        checked={
                            form.data.credential_mode === 'configure_later'
                        }
                        onChange={() =>
                            form.setData('credential_mode', 'configure_later')
                        }
                    />
                    <Rocket className="size-4 text-teal-500" />
                    <span className="font-semibold">Configure later</span>
                    <span className="text-xs leading-5 text-muted-foreground">
                        Save the project now and finish AWS wiring from the
                        setup guide.
                    </span>
                </label>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">Source name</span>
                    <input
                        value={form.data.source_name}
                        onChange={(event) =>
                            form.setData('source_name', event.target.value)
                        }
                        required
                        className={inputClassName}
                    />
                </label>
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">Environment</span>
                    <input
                        value={form.data.environment}
                        onChange={(event) =>
                            form.setData('environment', event.target.value)
                        }
                        required
                        className={monoInputClassName}
                    />
                </label>
                <label className="grid gap-1.5">
                    <span className="text-muted-foreground">SES region</span>
                    <input
                        value={form.data.ses_region}
                        onChange={(event) =>
                            form.setData('ses_region', event.target.value)
                        }
                        required
                        className={monoInputClassName}
                    />
                </label>
            </div>

            {canShowAwsFields ? (
                <div className="grid gap-3 md:grid-cols-3">
                    <label className="grid gap-1.5">
                        <span className="text-muted-foreground">
                            AWS access key ID
                        </span>
                        <input
                            value={form.data.aws_access_key_id}
                            onChange={(event) =>
                                form.setData(
                                    'aws_access_key_id',
                                    event.target.value,
                                )
                            }
                            autoComplete="off"
                            className={monoInputClassName}
                        />
                        {form.errors.aws_access_key_id ? (
                            <span className="text-xs text-red-500">
                                {form.errors.aws_access_key_id}
                            </span>
                        ) : null}
                    </label>
                    <label className="grid gap-1.5">
                        <span className="text-muted-foreground">
                            AWS secret access key
                        </span>
                        <input
                            value={form.data.aws_secret_access_key}
                            onChange={(event) =>
                                form.setData(
                                    'aws_secret_access_key',
                                    event.target.value,
                                )
                            }
                            autoComplete="off"
                            type="password"
                            className={inputClassName}
                        />
                        {form.errors.aws_secret_access_key ? (
                            <span className="text-xs text-red-500">
                                {form.errors.aws_secret_access_key}
                            </span>
                        ) : null}
                    </label>
                    <label className="grid gap-1.5">
                        <span className="text-muted-foreground">AWS session token</span>
                        <input
                            value={form.data.aws_session_token}
                            onChange={(event) =>
                                form.setData(
                                    'aws_session_token',
                                    event.target.value,
                                )
                            }
                            autoComplete="off"
                            placeholder="Optional STS token"
                            className={monoInputClassName}
                        />
                    </label>
                </div>
            ) : form.data.credential_mode === 'instance_role' ? (
                <div className="rounded-lg border border-signal/40 bg-signal/10 p-3 text-sm text-signal-foreground dark:border-signal/20 dark:bg-signal/10 dark:text-signal">
                    Attach an IAM role with SES permissions to the compute host
                    that runs Azodik Relay. No AWS keys will be stored in the
                    database for this source.
                </div>
            ) : null}
        </div>
    );
}
