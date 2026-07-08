import type {
    ActivityProps,
    ApiKeyScope,
    EmailDetail,
    EmailRow,
    HealthTone,
    MutableBag,
    WorkspaceMemberRole,
} from './types';

export { copyText } from '@/lib/clipboard';

export function relativeTime(value: string | null): string {
    if (!value) {
        return 'never';
    }

    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
        return value;
    }

    const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));

    if (seconds < 60) {
        return `${seconds}s ago`;
    }

    const minutes = Math.round(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    return `${Math.round(hours / 24)}d ago`;
}

function startOfDay(date: Date): Date {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);

    return value;
}

function startOfWeek(date: Date): Date {
    const value = startOfDay(date);
    const day = value.getDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    value.setDate(value.getDate() - daysSinceMonday);

    return value;
}

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function dateGroupLabel(date: Date): string {
    const today = startOfDay(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const thisWeek = startOfWeek(today);
    const lastWeek = new Date(thisWeek);
    lastWeek.setDate(thisWeek.getDate() - 7);

    const thisMonth = startOfMonth(today);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);
    const emailDay = startOfDay(date);

    if (emailDay >= today) {
        return 'Today';
    }

    if (emailDay >= yesterday) {
        return 'Yesterday';
    }

    if (emailDay >= thisWeek) {
        return 'This Week';
    }

    if (emailDay >= lastWeek) {
        return 'Last Week';
    }

    if (emailDay >= thisMonth) {
        return 'This Month';
    }

    if (emailDay >= lastMonth) {
        return 'Last Month';
    }

    if (emailDay >= thisYear) {
        return 'This Year';
    }

    return 'Older';
}

export function statusClass(status: string): string {
    return (
        {
            queued: 'bg-amber-500/12 text-amber-400',
            sending: 'bg-sky-500/12 text-sky-400',
            sent: 'bg-emerald-500/12 text-emerald-400',
            delivered: 'bg-emerald-500/12 text-emerald-400',
            opened: 'bg-blue-500/12 text-blue-400',
            'clicked': 'bg-signal/12 text-signal',
            'bounced': 'bg-red-500/12 text-red-400',
            'complained': 'bg-violet-500/12 text-violet-400',
            'failed': 'bg-red-500/12 text-red-400',
        }[status] ?? 'bg-muted text-muted-foreground'
    );
}

export function dotClass(status: string): string {
    return (
        {
            queued: 'bg-amber-400',
            sending: 'bg-sky-400',
            sent: 'bg-emerald-400',
            delivered: 'bg-emerald-400',
            opened: 'bg-blue-400',
            clicked: 'bg-signal',
            bounced: 'bg-red-400',
            complained: 'bg-violet-400',
            failed: 'bg-red-400',
        }[status] ?? 'bg-muted-foreground'
    );
}

export function healthToneClass(tone: HealthTone | string): string {
    return (
        {
            success: 'bg-emerald-400',
            warning: 'bg-amber-400',
            neutral: 'bg-muted-foreground',
        }[tone] ?? 'bg-muted-foreground'
    );
}

export function eventToneClass(type: string): string {
    return (
        {
            queued: 'bg-amber-400',
            sending: 'bg-sky-400',
            send: 'bg-emerald-400',
            sent: 'bg-emerald-400',
            delivery: 'bg-emerald-400',
            delivered: 'bg-emerald-400',
            open: 'bg-blue-400',
            opened: 'bg-blue-400',
            click: 'bg-signal',
            clicked: 'bg-signal',
            bounce: 'bg-red-400',
            bounced: 'bg-red-400',
            complaint: 'bg-violet-400',
            complained: 'bg-violet-400',
            failed: 'bg-red-400',
        }[type] ?? 'bg-muted-foreground'
    );
}

export function clampInspectorWidth(width: number): number {
    if (typeof window === 'undefined') {
        return width;
    }

    const maxWidth = Math.max(460, Math.min(960, window.innerWidth - 360));

    return Math.min(Math.max(width, 420), maxWidth);
}

export function formatHeaders(email: Partial<EmailDetail>): string {
    const standardHeaders: Record<string, string> = {
        From: email.from || 'Stored sender',
        To: email.to || email.recipientEmail || 'Stored recipient',
        Subject: email.subject || 'Stored message',
        'Message-ID': `<${email.id || 'stored-message'}@relay.azodik.com>`,
    };

    if (email.cc) {
        standardHeaders.Cc = email.cc;
    }

    if (email.bcc) {
        standardHeaders.Bcc = email.bcc;
    }

    if (email.sesMessageId) {
        standardHeaders['X-SES-Message-ID'] = email.sesMessageId;
    }

    const headers = {
        ...standardHeaders,
        ...(email.headers ?? {}),
    };

    return Object.entries(headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
}

export function recipientTitle(email: EmailRow): string | undefined {
    const fullList = email.recipientEmails || email.recipientEmail;

    if (!fullList || fullList === email.recipient) {
        return undefined;
    }

    return fullList;
}

export function recipientList(value: string): string[] {
    return value
        .split(/[\n,]+/)
        .map((address) => address.trim())
        .filter(Boolean);
}

export const statusFilters = [
    'All',
    'Delivered',
    'Opened',
    'Clicked',
    'Queued',
    'Sending',
    'Bounced',
    'Complained',
    'Failed',
] as const;

export const webhookEventOptions = [
    'delivery',
    'bounce',
    'complaint',
    'open',
    'click',
    'suppress',
] as const;

export const workspaceRoleOptions: {
    value: WorkspaceMemberRole;
    label: string;
    description: string;
}[] = [
    {
        value: 'member',
        label: 'Member',
        description: 'Send, manage API keys, and manage domains.',
    },
    {
        value: 'sender',
        label: 'Can send',
        description: 'Send and resend email only.',
    },
    {
        value: 'api_keys',
        label: 'API keys',
        description: 'Create, rotate, and delete API keys.',
    },
    {
        value: 'domains',
        label: 'Domains',
        description: 'Manage sending sources, domains, and quota sync.',
    },
    {
        value: 'read_only',
        label: 'Read only',
        description: 'View activity and configuration.',
    },
    {
        value: 'owner',
        label: 'Owner',
        description: 'Full workspace administration.',
    },
];

export const apiKeyScopeOptions: {
    value: ApiKeyScope;
    label: string;
}[] = [
    { value: 'send', label: 'Send email' },
    { value: 'read:activity', label: 'Read activity' },
];

export function pageTitleForSection(section: string): string {
    return (
        {
            activity: 'Activity',
            sent: 'Sent',
            bounces: 'Bounces',
            complaints: 'Complaints',
            suppressions: 'Suppressions',
            setup: 'Sending source',
            identities: 'Domains',
            templates: 'Templates',
            webhooks: 'Webhooks',
            'api-keys': 'API keys',
            send: 'Send email',
            projects: 'Workspace',
        }[section] ?? section.replace('-', ' ')
    );
}

export function createInitialMutableState(input: {
    selectedEmail: ActivityProps['selectedEmail'];
    filters: ActivityProps['filters'];
    domains: ActivityProps['domains'];
    newApiKey: ActivityProps['newApiKey'];
    newWebhookEndpoint: ActivityProps['newWebhookEndpoint'];
    source: ActivityProps['source'];
    project: ActivityProps['project'];
}): MutableBag {
    const {
        selectedEmail,
        filters,
        domains,
        newApiKey,
        newWebhookEndpoint,
        source,
        project,
    } = input;

    return {
        selected: selectedEmail,
        activeTab: 'preview',
        selectedFilter: 'All',
        searchQuery: filters.q,
        selectedRange: filters.range || '14d',
        showProjectMenu: false,
        showMobileNav: false,
        showMobileSearch: false,
        showProjectForm: false,
        selectedIdentityDomain: domains[0]?.domain ?? '',
        showNewIdentity: false,
        showSourceSettings: false,
        revealedApiKey: newApiKey,
        apiKeyCopied: false,
        showWebhookForm: false,
        showWebhookDeliveries: true,
        editingWebhookId: null,
        revealedWebhookEndpoint: newWebhookEndpoint,
        webhookSecretCopied: false,
        checkingDomainId: null,
        deletingDomainId: null,
        copiedDnsKey: null,
        inspectorWidth: 600,
        isResizingInspector: false,
        editingProjectSlug: null,
        archivingProjectSlug: null,
        deletingProjectSlug: null,
        syncingQuota: false,
        attemptedAutoQuotaSync: false,
        showingArchivedProjects: false,
        restoringProjectSlug: null,
        confirmation: null,
        sourceForm: {
            name: source?.name ?? 'Production',
            environment: source?.environment ?? project.environment,
            ses_region: source?.ses_region ?? project.region,
            ses_configuration_set: source?.ses_configuration_set ?? '',
            default_from_name: source?.default_from_name ?? 'Azodik Relay',
            default_from_email: source?.default_from_email ?? '',
            aws_access_key_id: '',
            aws_secret_access_key: '',
            aws_session_token: '',
            retention_days: source?.retention_days ?? 90,
        },
        domainForm: { domain: '' },
        templateForm: {
            slug: '',
            name: '',
            subject: '',
            html: '<div><h1>Hello {{name}}</h1><p>Your email is ready.</p></div>',
            text: 'Hello {{name}}, your email is ready.',
            variables: 'name',
        },
        apiKeyForm: {
            name: 'Production key',
            scopes: ['send', 'read:activity'],
            expires_at: '',
        },
        webhookForm: {
            url: '',
            events: ['delivery', 'bounce', 'complaint', 'open', 'click'],
            status: 'active',
        },
        sendForm: {
            from: source?.default_from_email ?? '',
            to: '',
            cc: '',
            bcc: '',
            subject: '',
            html: '<div><h1>Hello</h1><p>This is an Azodik Relay test email.</p></div>',
            text: 'This is an Azodik Relay test email.',
            template_id: '',
        },
        projectForm: {
            name: '',
            slug: '',
        },
    };
}
