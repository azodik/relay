import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { copyText } from '@/lib/clipboard';
import { slugify } from '@/lib/slugify';
import { wizardSteps } from './onboarding/constants';
import {
    OnboardingHeader,
    OnboardingNav,
    OnboardingSidebar,
    OnboardingStepPanel,
} from './onboarding/OnboardingChrome';
import StepApiKey from './onboarding/StepApiKey';
import StepBasics from './onboarding/StepBasics';
import StepCredentials from './onboarding/StepCredentials';
import StepFinish from './onboarding/StepFinish';
import StepSender from './onboarding/StepSender';
import type { OnboardingProps } from './onboarding/types';

export default function Onboarding({
    workspace,
    project,
    source,
    domain,
    progress,
}: OnboardingProps) {
    const [copied, setCopied] = useState('');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const form = useForm({
        workspace_name: workspace.name,
        project_name: project.name,
        project_slug: project.slug,
        credential_mode: project.credential_mode,
        source_name: source?.name ?? 'Production',
        environment: source?.environment ?? 'prod',
        ses_region: source?.ses_region ?? 'us-east-1',
        ses_configuration_set: source?.ses_configuration_set ?? '',
        default_from_name: source?.default_from_name ?? 'Azodik Relay',
        default_from_email: source?.default_from_email ?? '',
        aws_access_key_id: '',
        aws_secret_access_key: '',
        aws_session_token: '',
        sending_domain: domain?.domain ?? '',
        create_api_key: true,
        api_key_name: 'Production key',
        webhook_url: '',
    });

    const currentStep = wizardSteps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === wizardSteps.length - 1;
    const dnsRows = domain?.dns_records ?? [];
    const codeSnippet = useMemo(
        () =>
            [
                'MAIL_MAILER=relay',
                'RELAY_API_KEY=your_key_from_relay',
                `RELAY_ENDPOINT=${typeof window !== 'undefined' ? window.location.origin : ''}`,
            ].join('\n'),
        [],
    );
    const nextSetupLabel = project.next_step?.label ?? 'Open setup guide';

    useEffect(() => {
        if (
            !project.has_started_setup &&
            form.data.project_slug === project.slug
        ) {
            form.setData('project_slug', slugify(form.data.project_name));
        }
        // Mirror Vue watch on project_name / slug auto-generation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.data.project_name]);

    const copy = (value: string, key: string): void => {
        void copyText(value).then((ok) => {
            if (!ok) {
                return;
            }

            setCopied(key);
            window.setTimeout(() => {
                setCopied((current) => (current === key ? '' : current));
            }, 1300);
        });
    };

    const goNext = (): void => {
        if (!isLastStep) {
            setCurrentStepIndex((index) => index + 1);
        }
    };

    const goBack = (): void => {
        if (!isFirstStep) {
            setCurrentStepIndex((index) => index - 1);
        }
    };

    const goToStep = (index: number): void => {
        setCurrentStepIndex(index);
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        form.post('/onboarding', {
            preserveScroll: true,
            onError: (errors) => {
                if (
                    errors.aws_access_key_id ||
                    errors.aws_secret_access_key ||
                    errors.credential_mode
                ) {
                    setCurrentStepIndex(1);

                    return;
                }

                if (
                    errors.default_from_email ||
                    errors.sending_domain ||
                    errors.ses_region
                ) {
                    setCurrentStepIndex(2);

                    return;
                }

                setCurrentStepIndex(0);
            },
        });
    };

    return (
        <>
            <Head title="First-run setup" />

            <main className="min-h-screen bg-background text-[13px] text-foreground dark:bg-background dark:text-foreground">
                <OnboardingHeader resumePath={project.resume_path} />

                <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <OnboardingSidebar
                        progress={progress}
                        currentStepIndex={currentStepIndex}
                        nextSetupLabel={nextSetupLabel}
                        resumePath={project.resume_path}
                        onGoToStep={goToStep}
                    />

                    <form className="grid min-w-0 gap-4" onSubmit={submit}>
                        <OnboardingStepPanel currentStep={currentStep}>
                            {currentStep.key === 'basics' ? (
                                <StepBasics form={form} />
                            ) : null}

                            {currentStep.key === 'credentials' ? (
                                <StepCredentials form={form} />
                            ) : null}

                            {currentStep.key === 'sender' ? (
                                <StepSender
                                    form={form}
                                    dnsRows={dnsRows}
                                    copied={copied}
                                    copy={copy}
                                />
                            ) : null}

                            {currentStep.key === 'api-key' ? (
                                <StepApiKey
                                    form={form}
                                    codeSnippet={codeSnippet}
                                    copied={copied}
                                    copy={copy}
                                />
                            ) : null}

                            {currentStep.key === 'finish' ? (
                                <StepFinish
                                    webhookUrl={source?.webhook_url}
                                    copied={copied}
                                    copy={copy}
                                />
                            ) : null}
                        </OnboardingStepPanel>

                        <OnboardingNav
                            isFirstStep={isFirstStep}
                            isLastStep={isLastStep}
                            processing={form.processing}
                            onBack={goBack}
                            onNext={goNext}
                        />
                    </form>
                </div>
            </main>
        </>
    );
}
