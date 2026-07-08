import { useHttp } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { qrCode, recoveryCodes, secretKey } from '@/routes/two-factor';

export type UseTwoFactorAuthReturn = {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    recoveryCodesList: string[];
    errors: string[];
    hasSetupData: boolean;
    clearSetupData: () => void;
    clearErrors: () => void;
    clearTwoFactorAuthData: () => void;
    fetchQrCode: () => Promise<void>;
    fetchSetupKey: () => Promise<void>;
    fetchSetupData: () => Promise<void>;
    fetchRecoveryCodes: () => Promise<void>;
};

type QrCodeResponse = {
    svg: string;
    url: string;
};

type SecretKeyResponse = {
    secretKey: string;
};

export const useTwoFactorAuth = (): UseTwoFactorAuthReturn => {
    const http = useHttp();

    const [errors, setErrors] = useState<string[]>([]);
    const [manualSetupKey, setManualSetupKey] = useState<string | null>(null);
    const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
    const [recoveryCodesList, setRecoveryCodesList] = useState<string[]>([]);

    const hasSetupData = useMemo(
        () => qrCodeSvg !== null && manualSetupKey !== null,
        [qrCodeSvg, manualSetupKey],
    );

    const clearErrors = (): void => {
        setErrors([]);
    };

    const fetchQrCode = async (): Promise<void> => {
        try {
            const { svg } = (await http.submit(qrCode())) as QrCodeResponse;

            setQrCodeSvg(svg);
        } catch {
            setErrors((current) => [...current, 'Failed to fetch QR code']);
            setQrCodeSvg(null);
        }
    };

    const fetchSetupKey = async (): Promise<void> => {
        try {
            const { secretKey: key } = (await http.submit(
                secretKey(),
            )) as SecretKeyResponse;

            setManualSetupKey(key);
        } catch {
            setErrors((current) => [
                ...current,
                'Failed to fetch a setup key',
            ]);
            setManualSetupKey(null);
        }
    };

    const clearSetupData = (): void => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        clearErrors();
    };

    const clearTwoFactorAuthData = (): void => {
        clearSetupData();
        clearErrors();
        setRecoveryCodesList([]);
    };

    const fetchRecoveryCodes = async (): Promise<void> => {
        try {
            clearErrors();
            setRecoveryCodesList(
                (await http.submit(recoveryCodes())) as string[],
            );
        } catch {
            setErrors((current) => [
                ...current,
                'Failed to fetch recovery codes',
            ]);
            setRecoveryCodesList([]);
        }
    };

    const fetchSetupData = async (): Promise<void> => {
        try {
            clearErrors();
            await Promise.all([fetchQrCode(), fetchSetupKey()]);
        } catch {
            setQrCodeSvg(null);
            setManualSetupKey(null);
        }
    };

    return {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        errors,
        hasSetupData,
        clearSetupData,
        clearErrors,
        clearTwoFactorAuthData,
        fetchQrCode,
        fetchSetupKey,
        fetchSetupData,
        fetchRecoveryCodes,
    };
};
