import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, Rocket } from 'lucide-react';
import type { ReactNode } from 'react';
import { wizardSteps } from './constants';
import type { ProgressStep, WizardStep } from './types';

type OnboardingHeaderProps = {
    resumePath: string;
};

export function OnboardingHeader({ resumePath }: OnboardingHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur dark:border-border dark:bg-background/95">
            <div className="mx-auto flex h-[56px] w-full max-w-[1240px] items-center justify-between px-4">
                <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-md bg-signal font-mono text-xs font-semibold text-signal-foreground">
                        R
                    </div>
                    <div>
                        <div className="text-[13px] leading-4 font-semibold">
                            Relay
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                            first-run setup
                        </div>
                    </div>
                </div>

                <Link
                    href={resumePath}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted active:translate-y-px dark:border-border dark:text-muted-foreground dark:hover:bg-muted"
                >
                    Open setup guide
                </Link>
            </div>
        </header>
    );
}

type OnboardingSidebarProps = {
    progress: ProgressStep[];
    currentStepIndex: number;
    nextSetupLabel: string;
    resumePath: string;
    onGoToStep: (index: number) => void;
};

export function OnboardingSidebar({
    progress,
    currentStepIndex,
    nextSetupLabel,
    resumePath,
    onGoToStep,
}: OnboardingSidebarProps) {
    const completedCount = progress.filter((step) => step.complete).length;
    const completionPercent = Math.round(
        (completedCount / Math.max(progress.length, 1)) * 100,
    );

    return (
        <aside className="grid content-start gap-3 lg:sticky lg:top-[72px]">
            <section className="rounded-lg border border-border bg-card p-4 shadow-sm dark:border-border dark:bg-card">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Bootstrap progress
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                    <h1 className="text-3xl font-semibold">
                        {completionPercent}%
                    </h1>
                    <span className="rounded-full border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground dark:border-border">
                        {completedCount}/{progress.length}
                    </span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted dark:bg-muted">
                    <div
                        className="h-full rounded-full bg-signal transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>

                <div className="mt-4 grid gap-1.5">
                    {wizardSteps.map((step, index) => (
                        <button
                            key={step.key}
                            type="button"
                            className={[
                                'flex items-center gap-2.5 rounded-md px-2 py-2 text-left transition hover:bg-muted dark:hover:bg-muted',
                                index === currentStepIndex
                                    ? 'bg-signal/10 dark:bg-signal/10'
                                    : '',
                            ].join(' ')}
                            onClick={() => onGoToStep(index)}
                        >
                            <span
                                className={[
                                    'grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]',
                                    index < currentStepIndex
                                        ? 'border-signal bg-signal text-signal-foreground'
                                        : 'border-border text-muted-foreground dark:border-border',
                                ].join(' ')}
                            >
                                {index < currentStepIndex ? (
                                    <Check className="size-3" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </span>
                            <span className="font-medium">{step.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-4 shadow-sm dark:border-border dark:bg-card">
                <div className="flex items-center gap-2">
                    <Rocket className="size-4 text-signal" />
                    <h2 className="font-semibold">Next after bootstrap</h2>
                </div>
                <p className="mt-2 text-[12.5px] leading-5 text-muted-foreground">
                    {nextSetupLabel} is the next operational checkpoint. The
                    setup guide remains available until DNS verifies and the
                    first real send is visible in Activity.
                </p>
                <Link
                    href={resumePath}
                    className="mt-3 inline-flex items-center gap-2 rounded-md bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 active:translate-y-px dark:bg-muted dark:text-foreground dark:hover:bg-card"
                >
                    Open setup guide
                    <ArrowRight className="size-3.5" />
                </Link>
            </section>
        </aside>
    );
}

type OnboardingStepPanelProps = {
    currentStep: WizardStep;
    children: ReactNode;
};

export function OnboardingStepPanel({
    currentStep,
    children,
}: OnboardingStepPanelProps) {
    return (
        <section className="rounded-lg border border-border bg-card shadow-sm dark:border-border dark:bg-card">
            <div className="border-b border-border px-5 py-4 dark:border-border">
                <div className="font-mono text-[10px] tracking-widest text-signal uppercase dark:text-signal">
                    {currentStep.eyebrow}
                </div>
                <h2 className="mt-1 text-xl font-semibold">
                    {currentStep.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {currentStep.description}
                </p>
            </div>

            <div className="grid gap-4 p-5">{children}</div>
        </section>
    );
}

type OnboardingNavProps = {
    isFirstStep: boolean;
    isLastStep: boolean;
    processing: boolean;
    onBack: () => void;
    onNext: () => void;
};

export function OnboardingNav({
    isFirstStep,
    isLastStep,
    processing,
    onBack,
    onNext,
}: OnboardingNavProps) {
    return (
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/90 py-3 backdrop-blur dark:border-border dark:bg-background/90">
            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-[13px] font-semibold text-muted-foreground transition hover:bg-muted active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:text-muted-foreground dark:hover:bg-muted"
                disabled={isFirstStep}
                onClick={onBack}
            >
                <ArrowLeft className="size-4" />
                Back
            </button>
            <div className="flex items-center gap-2">
                {!isLastStep ? (
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md bg-signal px-3 py-2 text-[13px] font-bold text-signal-foreground transition hover:brightness-105 active:translate-y-px"
                        onClick={onNext}
                    >
                        Continue
                        <ArrowRight className="size-4" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-signal px-3 py-2 text-[13px] font-bold text-signal-foreground transition hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={processing}
                    >
                        <span>
                            {processing
                                ? 'Saving...'
                                : 'Save and continue to setup'}
                        </span>
                        <ArrowRight className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
