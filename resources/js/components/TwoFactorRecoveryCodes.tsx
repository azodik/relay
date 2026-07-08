import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AlertError from '@/components/AlertError';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { regenerateRecoveryCodes } from '@/routes/two-factor';

export default function TwoFactorRecoveryCodes() {
    const { recoveryCodesList, fetchRecoveryCodes, errors } =
        useTwoFactorAuth();
    const [isRecoveryCodesVisible, setIsRecoveryCodesVisible] =
        useState(false);
    const recoveryCodeSectionRef = useRef<HTMLDivElement>(null);

    const toggleRecoveryCodesVisibility = async (): Promise<void> => {
        if (!isRecoveryCodesVisible && recoveryCodesList.length === 0) {
            await fetchRecoveryCodes();
        }

        const nextVisible = !isRecoveryCodesVisible;
        setIsRecoveryCodesVisible(nextVisible);

        if (nextVisible) {
            window.requestAnimationFrame(() => {
                recoveryCodeSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                });
            });
        }
    };

    useEffect(() => {
        if (recoveryCodesList.length === 0) {
            void fetchRecoveryCodes();
        }
        // Intentionally run once on mount to mirror Vue onMounted behavior.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex gap-3">
                    <LockKeyhole className="size-4" />
                    2FA recovery codes
                </CardTitle>
                <CardDescription>
                    Recovery codes let you regain access if you lose your 2FA
                    device. Store them in a secure password manager.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        onClick={() => {
                            void toggleRecoveryCodesVisibility();
                        }}
                        className="w-fit"
                    >
                        {isRecoveryCodesVisible ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                        {isRecoveryCodesVisible ? 'Hide' : 'View'} recovery
                        codes
                    </Button>

                    {isRecoveryCodesVisible &&
                        recoveryCodesList.length > 0 && (
                            <Form
                                {...regenerateRecoveryCodes.form()}
                                options={{ preserveScroll: true }}
                                onSuccess={() => {
                                    void fetchRecoveryCodes();
                                }}
                            >
                                {({ processing }) => (
                                    <Button
                                        variant="secondary"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        <RefreshCw /> Regenerate codes
                                    </Button>
                                )}
                            </Form>
                        )}
                </div>
                <div
                    className={[
                        'relative overflow-hidden transition-all duration-300',
                        isRecoveryCodesVisible
                            ? 'h-auto opacity-100'
                            : 'h-0 opacity-0',
                    ].join(' ')}
                >
                    {errors.length > 0 ? (
                        <div className="mt-6">
                            <AlertError errors={errors} />
                        </div>
                    ) : (
                        <div className="mt-3 space-y-3">
                            <div
                                ref={recoveryCodeSectionRef}
                                className="grid gap-1 rounded-lg bg-muted p-4 font-mono text-sm"
                            >
                                {recoveryCodesList.length === 0
                                    ? Array.from({ length: 8 }, (_, n) => (
                                          <div
                                              key={n}
                                              className="h-4 animate-pulse rounded bg-muted-foreground/20"
                                          />
                                      ))
                                    : recoveryCodesList.map((code, index) => (
                                          <div key={index}>{code}</div>
                                      ))}
                            </div>
                            <p className="text-xs text-muted-foreground select-none">
                                Each recovery code can be used once to access
                                your account and will be removed after use. If
                                you need more, click{' '}
                                <span className="font-bold">
                                    Regenerate codes
                                </span>{' '}
                                above.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
