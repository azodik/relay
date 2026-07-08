import { usePoll } from '@inertiajs/react';
import { useEffect, type RefObject } from 'react';
import { clampInspectorWidth } from './helpers';
import type { EmailDetail, EmailRow, MutableBag } from './types';

type UseActivityEffectsArgs = {
    s: MutableBag;
    emails: EmailRow[];
    selectedEmail: EmailDetail | null;
    newApiKey: string | null;
    newWebhookEndpoint: {
        id: string;
        url: string;
        secret: string;
        events: string[];
    } | null;
    section: string;
    isMailSection: boolean;
    searchTimer: RefObject<ReturnType<typeof window.setTimeout> | null>;
    applySearch: () => void;
    handleGlobalShortcut: (event: KeyboardEvent) => void;
    stopInspectorResize: () => void;
    syncQuotaIfStale: () => void;
};

export function useActivityEffects({
    s,
    emails,
    selectedEmail,
    newApiKey,
    newWebhookEndpoint,
    section,
    isMailSection,
    searchTimer,
    applySearch,
    handleGlobalShortcut,
    stopInspectorResize,
    syncQuotaIfStale,
}: UseActivityEffectsArgs): void {
    useEffect(() => {
        if (newApiKey) {
            s.revealedApiKey = newApiKey;
            s.apiKeyCopied = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newApiKey]);

    useEffect(() => {
        if (newWebhookEndpoint) {
            s.revealedWebhookEndpoint = newWebhookEndpoint;
            s.webhookSecretCopied = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newWebhookEndpoint]);

    usePoll(
        5000,
        {
            only: [
                'emails',
                'selectedEmail',
                'metrics',
                'bounceMetrics',
                'bounceQueue',
                'sidebarCounts',
                'quota',
            ],
            showProgress: false,
        },
        { autoStart: isMailSection },
    );

    useEffect(() => {
        if (!s.selected?.id) {
            s.selected = selectedEmail;
            return;
        }
        const refreshed = emails.find((email) => email.id === s.selected?.id);
        if (refreshed) {
            s.selected = { ...s.selected, ...refreshed };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emails, selectedEmail]);

    useEffect(() => {
        if (!isMailSection) {
            return;
        }
        if (searchTimer.current) {
            window.clearTimeout(searchTimer.current);
        }
        searchTimer.current = window.setTimeout(() => applySearch(), 350);
        return () => {
            if (searchTimer.current) {
                window.clearTimeout(searchTimer.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [s.searchQuery, isMailSection, section]);

    useEffect(() => {
        const savedWidth = Number(
            window.localStorage.getItem('relay:inspectorWidth'),
        );
        if (Number.isFinite(savedWidth)) {
            s.inspectorWidth = clampInspectorWidth(savedWidth);
        }
        window.addEventListener('keydown', handleGlobalShortcut);
        syncQuotaIfStale();
        return () => {
            stopInspectorResize();
            window.removeEventListener('keydown', handleGlobalShortcut);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        syncQuotaIfStale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);
}
