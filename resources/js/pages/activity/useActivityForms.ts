import type { SharedPageProps } from '@inertiajs/core';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo, useRef } from 'react';
import { createInitialMutableState } from './helpers';
import type { ActivityProps, MutableBag, WorkspaceMemberRole } from './types';
import { useMutableState } from './useMutableState';

export type ActivityPage = SharedPageProps & {
    auth: { user: { name?: string; email?: string } };
    build?: { version?: string | null; sha?: string | null };
};

export function useActivityForms(props: ActivityProps) {
    const {
        selectedEmail,
        filters,
        domains,
        newApiKey,
        newWebhookEndpoint,
        source,
        project,
    } = props;

    const page = usePage<ActivityPage>();

    const s = useMutableState<MutableBag>(
        createInitialMutableState({
            selectedEmail,
            filters,
            domains,
            newApiKey,
            newWebhookEndpoint,
            source,
            project,
        }),
    );

    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const copiedDnsTimer = useRef<ReturnType<typeof window.setTimeout> | null>(
        null,
    );
    const searchTimer = useRef<ReturnType<typeof window.setTimeout> | null>(
        null,
    );
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(0);

    const projectEditForm = useForm({
        name: '',
        slug: '',
    });
    const workspaceMemberForm = useForm({
        email: '',
        role: 'member' as WorkspaceMemberRole,
    });

    const buildLabel = useMemo(() => {
        const build = page.props.build;
        const version = build?.version || 'dev';
        const sha = build?.sha ? build.sha.slice(0, 7) : null;
        return sha ? `v${version} · ${sha}` : `v${version}`;
    }, [page.props.build]);

    return {
        page,
        s,
        searchInputRef,
        copiedDnsTimer,
        searchTimer,
        resizeStartX,
        resizeStartWidth,
        projectEditForm,
        workspaceMemberForm,
        buildLabel,
    };
}

export type ActivityForms = ReturnType<typeof useActivityForms>;
