import { router } from '@inertiajs/react';
import type { InertiaFormProps } from '@inertiajs/react';
import type { RefObject } from 'react';
import {
    clampInspectorWidth,
    copyText,
    recipientList,
    workspaceRoleOptions,
} from './helpers';
import type {
    ApiKeyScope,
    ArchivedProjectOption,
    ConfirmationState,
    EmailDetail,
    EmailRow,
    MutableBag,
    ProjectOption,
    WebhookEndpointRow,
    WorkspaceMemberRole,
} from './types';

type ProjectEditForm = InertiaFormProps<{
    name: string;
    slug: string;
}>;

type WorkspaceMemberForm = InertiaFormProps<{
    email: string;
    role: WorkspaceMemberRole;
}>;

type UseActivityActionsArgs = {
    s: MutableBag;
    section: string;
    sectionPath: string;
    projectAction: (path: string) => string;
    selectedIdentity: {
        id: number;
        domain: string;
        status: string;
        dns_records:
            | { type: string; name: string; value: string; status?: string }[]
            | null;
        verified_at: string | null;
    } | null;
    selectedIdentityRecords: {
        type: string;
        name: string;
        value: string;
        status?: string;
    }[];
    isMailSection: boolean;
    quotaIsStale: boolean;
    projectEditForm: ProjectEditForm;
    workspaceMemberForm: WorkspaceMemberForm;
    searchInputRef: RefObject<HTMLInputElement | null>;
    copiedDnsTimer: RefObject<ReturnType<typeof window.setTimeout> | null>;
    resizeStartX: RefObject<number>;
    resizeStartWidth: RefObject<number>;
};

export function useActivityActions({
    s,
    section,
    sectionPath,
    projectAction,
    selectedIdentity,
    selectedIdentityRecords,
    isMailSection,
    quotaIsStale,
    projectEditForm,
    workspaceMemberForm,
    searchInputRef,
    copiedDnsTimer,
    resizeStartX,
    resizeStartWidth,
}: UseActivityActionsArgs) {
    function saveSource(): void {
        router.put(projectAction('/source'), s.sourceForm, {
            preserveScroll: true,
        });
    }

    function syncQuota(silent = false): void {
        s.syncingQuota = true;

        router.post(
            projectAction('/source/quota'),
            { silent },
            {
                preserveScroll: true,
                showProgress: !silent,
                onFinish: () => {
                    s.syncingQuota = false;
                },
            },
        );
    }

    function syncQuotaIfStale(): void {
        if (
            section !== 'setup' ||
            s.attemptedAutoQuotaSync ||
            s.syncingQuota ||
            !quotaIsStale
        ) {
            return;
        }

        s.attemptedAutoQuotaSync = true;
        syncQuota(true);
    }

    function addDomain(): void {
        router.post(projectAction('/domains'), s.domainForm, {
            preserveScroll: true,
            onSuccess: () => {
                s.selectedIdentityDomain = s.domainForm.domain;
                s.domainForm.domain = '';
                s.showNewIdentity = false;
            },
        });
    }

    function checkDomain(): void {
        if (!selectedIdentity) {
            return;
        }

        s.checkingDomainId = selectedIdentity.id;
        router.post(
            projectAction(`/domains/${selectedIdentity.id}/check-dns`),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    s.checkingDomainId = null;
                },
            },
        );
    }

    function deleteDomain(): void {
        if (!selectedIdentity) {
            return;
        }

        const domain = selectedIdentity;

        openConfirmation({
            title: `Delete ${domain.domain}?`,
            body: 'This removes the identity from Azodik Relay only. SES identities and DNS records are not removed from AWS or your DNS provider.',
            actionLabel: 'Delete identity',
            tone: 'danger',
            onConfirm: () => {
                s.deletingDomainId = domain.id;
                router.delete(projectAction(`/domains/${domain.id}`), {
                    preserveScroll: true,
                    preserveState: false,
                    onFinish: () => {
                        s.deletingDomainId = null;
                    },
                });
            },
        });
    }

    async function copyRevealedApiKey(): Promise<void> {
        if (!s.revealedApiKey) {
            return;
        }

        s.apiKeyCopied = await copyText(s.revealedApiKey);
    }

    function closeApiKeyModal(): void {
        s.revealedApiKey = null;
        s.apiKeyCopied = false;
    }

    function selectTextArea(event: { target: EventTarget | null }): void {
        if (event.target instanceof HTMLTextAreaElement) {
            event.target.select();
        }
    }

    async function copyWebhookSecret(): Promise<void> {
        if (!s.revealedWebhookEndpoint) {
            return;
        }

        s.webhookSecretCopied = await copyText(
            s.revealedWebhookEndpoint.secret,
        );
    }

    function closeWebhookSecretModal(): void {
        s.revealedWebhookEndpoint = null;
        s.webhookSecretCopied = false;
    }

    function copyAllDns(): void {
        const text = selectedIdentityRecords
            .map((record) => `${record.type}\t${record.name}\t${record}`)
            .join('\n');
        void copyText(text);
        markDnsCopied('all');
    }

    function copyDnsValue(key: string, value: string): void {
        void copyText(value);
        markDnsCopied(key);
    }

    function markDnsCopied(key: string): void {
        s.copiedDnsKey = key;

        if (copiedDnsTimer.current) {
            window.clearTimeout(copiedDnsTimer.current);
        }

        copiedDnsTimer.current = window.setTimeout(() => {
            s.copiedDnsKey = null;
            copiedDnsTimer.current = null;
        }, 1400);
    }

    function saveTemplate(): void {
        router.post(projectAction('/templates'), s.templateForm, {
            preserveScroll: true,
        });
    }

    function issueApiKey(): void {
        router.post(projectAction('/api-keys'), s.apiKeyForm, {
            preserveScroll: true,
        });
    }

    function toggleApiKeyScope(scope: ApiKeyScope): void {
        if (s.apiKeyForm.scopes.includes(scope)) {
            s.apiKeyForm.scopes = s.apiKeyForm.scopes.filter(
                (value) => value !== scope,
            );

            return;
        }

        s.apiKeyForm.scopes = [...s.apiKeyForm.scopes, scope];
    }

    function apiKeyScopes(apiKey: {
        scopes: ApiKeyScope[] | null;
    }): ApiKeyScope[] {
        return apiKey.scopes?.length
            ? apiKey.scopes
            : ['send', 'read:activity'];
    }

    function rotateApiKey(apiKey: { id: number; name: string }): void {
        openConfirmation({
            title: `Rotate ${apiKey.name}?`,
            body: 'The current key will stop working immediately. Azodik Relay will reveal the replacement key once after rotation.',
            actionLabel: 'Rotate key',
            tone: 'warning',
            onConfirm: () => {
                router.post(
                    projectAction(`/api-keys/${apiKey.id}/rotate`),
                    {},
                    { preserveScroll: true },
                );
            },
        });
    }

    function deleteApiKey(apiKey: { id: number; name: string }): void {
        openConfirmation({
            title: `Delete ${apiKey.name}?`,
            body: 'This API key will stop authenticating immediately. Existing applications using it must switch to another key first.',
            actionLabel: 'Delete key',
            tone: 'danger',
            onConfirm: () => {
                router.delete(projectAction(`/api-keys/${apiKey.id}`), {
                    preserveScroll: true,
                });
            },
        });
    }

    function resetWebhookForm(): void {
        s.editingWebhookId = null;
        s.webhookForm.url = '';
        s.webhookForm.events = [
            'delivery',
            'bounce',
            'complaint',
            'open',
            'click',
        ];
        s.webhookForm.status = 'active';
        s.showWebhookForm = true;
    }

    function editWebhook(webhook: WebhookEndpointRow): void {
        s.editingWebhookId = webhook.id;
        s.webhookForm.url = webhook.url;
        s.webhookForm.events = [...webhook.events];
        s.webhookForm.status =
            webhook.configured_status === 'paused' ? 'paused' : 'active';
        s.showWebhookForm = true;
    }

    function toggleWebhookEvent(event: string): void {
        if (s.webhookForm.events.includes(event)) {
            s.webhookForm.events = s.webhookForm.events.filter(
                (value) => value !== event,
            );

            return;
        }

        s.webhookForm.events = [...s.webhookForm.events, event];
    }

    function saveWebhookEndpoint(): void {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                s.showWebhookForm = false;
                s.editingWebhookId = null;
            },
        };

        if (s.editingWebhookId) {
            router.put(
                projectAction(`/webhooks/${s.editingWebhookId}`),
                s.webhookForm,
                options,
            );

            return;
        }

        router.post(projectAction('/webhooks'), s.webhookForm, options);
    }

    function retrySoftBounces(): void {
        router.post(
            projectAction('/bounces/retry-soft'),
            {},
            { preserveScroll: true },
        );
    }

    function sendEmail(): void {
        router.post(
            projectAction('/send'),
            {
                ...s.sendForm,
                to: recipientList(s.sendForm.to),
                cc: recipientList(s.sendForm.cc),
                bcc: recipientList(s.sendForm.bcc),
            },
            { preserveScroll: true },
        );
    }

    function resendEmail(): void {
        if (!s.selected?.id) {
            return;
        }

        router.post(
            projectAction(`/emails/${s.selected.id}/resend`),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({
                        only: [
                            'emails',
                            's.selectedEmail',
                            'metrics',
                            'sidebarCounts',
                            'quota',
                        ],
                        showProgress: false,
                    });
                },
            },
        );
    }

    function createProject(): void {
        router.post('/projects', s.projectForm, {
            preserveScroll: true,
            onSuccess: () => {
                s.projectForm.name = '';
                s.projectForm.slug = '';
                s.showProjectForm = false;
                s.showProjectMenu = false;
            },
        });
    }

    function startProjectEdit(project: ProjectOption): void {
        s.editingProjectSlug = project.slug;
        projectEditForm.setData('name', project.name);
        projectEditForm.setData('slug', project.slug);
        projectEditForm.clearErrors();
    }

    function cancelProjectEdit(): void {
        s.editingProjectSlug = null;
        projectEditForm.reset();
        projectEditForm.clearErrors();
    }

    function updateProject(project: ProjectOption): void {
        projectEditForm.put(`/projects/${project.slug}`, {
            preserveScroll: true,
            onSuccess: () => {
                s.editingProjectSlug = null;
                s.showProjectMenu = false;
            },
        });
    }

    function archiveProject(project: ProjectOption): void {
        openConfirmation({
            title: `Archive ${project.name}?`,
            body: 'Email history, domains, API keys, and webhooks stay stored. The project moves out of active navigation and can be restored later.',
            actionLabel: 'Archive project',
            tone: 'warning',
            onConfirm: () => {
                s.archivingProjectSlug = project.slug;
                router.post(
                    `/projects/${project.slug}/archive`,
                    {},
                    {
                        preserveScroll: true,
                        onFinish: () => {
                            s.archivingProjectSlug = null;
                        },
                    },
                );
            },
        });
    }

    function restoreProject(project: ArchivedProjectOption): void {
        s.restoringProjectSlug = project.slug;
        router.post(
            `/projects/${project.slug}/restore`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    s.restoringProjectSlug = null;
                },
            },
        );
    }

    function deleteProject(project: ProjectOption): void {
        if (!project.can_delete) {
            openConfirmation({
                title: 'Archive this project instead',
                body: `${project.name} ${project.delete_block_reason ?? 'is not empty'}. Deleting is only available for projects with no sends and no domains.`,
                actionLabel: 'Archive project',
                tone: 'warning',
                onConfirm: () => archiveProject(project),
            });

            return;
        }

        openConfirmation({
            title: `Delete ${project.name}?`,
            body: 'This project has no sends or domains. Deleting it permanently removes its empty configuration shell.',
            actionLabel: 'Delete project',
            tone: 'danger',
            onConfirm: () => {
                s.deletingProjectSlug = project.slug;
                router.delete(`/projects/${project.slug}`, {
                    preserveScroll: true,
                    onFinish: () => {
                        s.deletingProjectSlug = null;
                    },
                });
            },
        });
    }

    function addWorkspaceMember(): void {
        workspaceMemberForm.post('/workspace/members', {
            preserveScroll: true,
            onSuccess: () => {
                workspaceMemberForm.reset();
            },
        });
    }

    function updateWorkspaceMemberRole(
        memberId: number,
        role: WorkspaceMemberRole,
    ): void {
        router.put(
            `/workspace/members/${memberId}`,
            { role },
            { preserveScroll: true },
        );
    }

    function handleWorkspaceMemberRoleChange(
        memberId: number,
        event: { target: EventTarget | null },
    ): void {
        const target = event.target;

        if (target instanceof HTMLSelectElement) {
            updateWorkspaceMemberRole(
                memberId,
                target.value as WorkspaceMemberRole,
            );
        }
    }

    function removeWorkspaceMember(memberId: number): void {
        openConfirmation({
            title: 'Remove workspace member?',
            body: 'This user will lose access to every project in this workspace.',
            actionLabel: 'Remove member',
            tone: 'danger',
            onConfirm: () => {
                router.delete(`/workspace/members/${memberId}`, {
                    preserveScroll: true,
                });
            },
        });
    }

    function openConfirmation(state: Exclude<ConfirmationState, null>): void {
        s.confirmation = state;
    }

    function closeConfirmation(): void {
        s.confirmation = null;
    }

    function confirmAction(): void {
        const state = s.confirmation;

        if (!state) {
            return;
        }

        s.confirmation = null;
        state.onConfirm();
    }

    function roleLabel(role: WorkspaceMemberRole): string {
        return (
            workspaceRoleOptions.find((option) => option.value === role)
                ?.label ?? role.replace('_', ' ')
        );
    }

    function selectEmail(email: EmailRow): void {
        s.selected = email as EmailDetail;
        s.activeTab = 'preview';
    }

    function closeInspector(): void {
        s.selected = null;
    }

    function applySearch(): void {
        router.get(
            sectionPath,
            { q: s.searchQuery, range: s.selectedRange },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function setRange(range: string): void {
        s.selectedRange = range;
        applySearch();
    }

    function handleGlobalShortcut(event: KeyboardEvent): void {
        if (
            !(event.metaKey || event.ctrlKey) ||
            event.key.toLowerCase() !== 'k'
        ) {
            return;
        }

        if (!isMailSection) {
            return;
        }

        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
    }

    function startInspectorResize(event: {
        preventDefault(): void;
        clientX: number;
    }): void {
        event.preventDefault();
        resizeStartX.current = event.clientX;
        resizeStartWidth.current = s.inspectorWidth;
        s.isResizingInspector = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        window.addEventListener('pointermove', resizeInspector);
        window.addEventListener('pointerup', stopInspectorResize);
    }

    function resizeInspector(event: PointerEvent): void {
        if (!s.isResizingInspector) {
            return;
        }

        const nextWidth =
            resizeStartWidth.current - (event.clientX - resizeStartX.current);
        s.inspectorWidth = clampInspectorWidth(nextWidth);
    }

    function stopInspectorResize(): void {
        if (!s.isResizingInspector) {
            return;
        }

        s.isResizingInspector = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.localStorage.setItem(
            'relay:s.inspectorWidth',
            String(s.inspectorWidth),
        );
        window.removeEventListener('pointermove', resizeInspector);
        window.removeEventListener('pointerup', stopInspectorResize);
    }

    return {
        saveSource,
        syncQuota,
        syncQuotaIfStale,
        addDomain,
        checkDomain,
        deleteDomain,
        copyText,
        copyRevealedApiKey,
        closeApiKeyModal,
        selectTextArea,
        copyWebhookSecret,
        closeWebhookSecretModal,
        copyAllDns,
        copyDnsValue,
        saveTemplate,
        issueApiKey,
        toggleApiKeyScope,
        apiKeyScopes,
        rotateApiKey,
        deleteApiKey,
        resetWebhookForm,
        editWebhook,
        toggleWebhookEvent,
        saveWebhookEndpoint,
        retrySoftBounces,
        sendEmail,
        resendEmail,
        createProject,
        startProjectEdit,
        cancelProjectEdit,
        updateProject,
        archiveProject,
        restoreProject,
        deleteProject,
        addWorkspaceMember,
        handleWorkspaceMemberRoleChange,
        removeWorkspaceMember,
        closeConfirmation,
        confirmAction,
        roleLabel,
        selectEmail,
        closeInspector,
        applySearch,
        setRange,
        handleGlobalShortcut,
        startInspectorResize,
        stopInspectorResize,
        clampInspectorWidth,
    };
}

export type ActivityActions = ReturnType<typeof useActivityActions>;
