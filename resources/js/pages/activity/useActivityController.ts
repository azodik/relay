import {
    apiKeyScopeOptions,
    copyText,
    dotClass,
    eventToneClass,
    formatHeaders,
    healthToneClass,
    recipientTitle,
    relativeTime,
    statusClass,
    statusFilters,
    webhookEventOptions,
    workspaceRoleOptions,
} from './helpers';
import type { ActivityProps } from './types';
import { useActivityActions } from './useActivityActions';
import { useActivityDerived } from './useActivityDerived';
import { useActivityEffects } from './useActivityEffects';
import { useActivityForms } from './useActivityForms';

export function useActivityController(props: ActivityProps) {
    const {
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
    } = useActivityForms(props);

    const derived = useActivityDerived(props, s);

    const {
        syncQuotaIfStale,
        handleGlobalShortcut,
        stopInspectorResize,
        ...publicActions
    } = useActivityActions({
        s,
        section: props.section,
        sectionPath: derived.sectionPath,
        projectAction: derived.projectAction,
        selectedIdentity: derived.selectedIdentity,
        selectedIdentityRecords: derived.selectedIdentityRecords,
        isMailSection: derived.isMailSection,
        quotaIsStale: derived.quotaIsStale,
        projectEditForm,
        workspaceMemberForm,
        searchInputRef,
        copiedDnsTimer,
        resizeStartX,
        resizeStartWidth,
    });

    useActivityEffects({
        s,
        emails: props.emails,
        selectedEmail: props.selectedEmail,
        newApiKey: props.newApiKey,
        newWebhookEndpoint: props.newWebhookEndpoint,
        section: props.section,
        isMailSection: derived.isMailSection,
        searchTimer,
        applySearch: publicActions.applySearch,
        handleGlobalShortcut,
        stopInspectorResize,
        syncQuotaIfStale,
    });

    return {
        props,
        ...props,
        page,
        s,
        searchInputRef,
        projectEditForm,
        workspaceMemberForm,
        buildLabel,
        statusFilters,
        webhookEventOptions,
        workspaceRoleOptions,
        apiKeyScopeOptions,
        ...derived,
        relativeTime,
        ...publicActions,
        copyText,
        statusClass,
        dotClass,
        healthToneClass,
        eventToneClass,
        formatHeaders,
        recipientTitle,
    };
}

export type ActivityController = ReturnType<typeof useActivityController>;
