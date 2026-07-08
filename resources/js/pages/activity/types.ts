export type Metric = {
    label: string;
    value: string;
    delta: string | null;
    trend: 'up' | 'down' | 'neutral';
    tone: 'good' | 'bad' | 'neutral';
    spark: number[];
};

export type EmailRow = {
    id: string;
    recipient: string;
    recipientEmail: string;
    recipientEmails: string;
    recipientCount: number;
    subject: string;
    template: string | null;
    status: string;
    opens: number;
    clicks: number;
    time: string;
    createdAt: string;
};

export type EmailDetail = EmailRow & {
    from: string;
    to: string;
    cc: string;
    bcc: string;
    html: string | null;
    text: string | null;
    headers: Record<string, string> | null;
    sesMessageId: string | null;
    mimeSize: number | null;
    mimeUrl: string;
    previewUrl: string;
    events: { type: string; recipient: string | null; occurredAt: string }[];
};

export type BounceMetric = {
    label: string;
    value: string;
    meta: string;
    tone: 'neutral' | 'success' | 'danger';
};

export type BounceQueueRow = {
    id: string;
    type: 'Hard' | 'Soft';
    recipient: string | null;
    reason: string;
    smtp: string;
    mx: string;
    template: string | null;
    attempts: number;
    when: string;
};

export type WebhookEndpointRow = {
    id: string;
    url: string;
    events: string[];
    status: string;
    configured_status: string;
    secret_prefix: string;
    success_rate: string;
    last_delivered_at: string;
    created_at: string;
};

export type WebhookDeliveryRow = {
    id: string;
    status: string;
    event: string;
    endpoint: string | null;
    http: number | null;
    latency: number | null;
    when: string;
};

export type SuppressionRow = {
    id: number;
    email: string;
    reason: string;
    source: string;
    added: string;
    expires: string;
};

export type ProjectOption = {
    name: string;
    slug: string;
    environment: string;
    region: string;
    emails_count: number;
    domains_count: number;
    is_current: boolean;
    href: string;
    can_delete: boolean;
    delete_block_reason: string | null;
};

export type ArchivedProjectOption = Omit<
    ProjectOption,
    'is_current' | 'href' | 'can_delete' | 'delete_block_reason'
> & {
    archived_at: string | null;
};

export type HealthTone = 'success' | 'warning' | 'neutral';

export type NewWebhookEndpoint = {
    id: string;
    url: string;
    secret: string;
    events: string[];
};

export type WorkspaceMemberRole =
    | 'owner'
    | 'member'
    | 'sender'
    | 'api_keys'
    | 'domains'
    | 'read_only';

export type ApiKeyScope = 'send' | 'read:activity';

export type ConfirmationState = {
    title: string;
    body: string;
    actionLabel: string;
    tone: 'danger' | 'warning';
    onConfirm: () => void;
} | null;

export type ActivityProps = {
    project: {
        name: string;
        slug: string;
        environment: string;
        region: string;
        path: string;
        exportPath: string;
    };
    workspace: {
        name: string;
        slug: string;
        can_manage_members: boolean;
        can_manage_api_keys: boolean;
        can_manage_domains: boolean;
        can_send: boolean;
    };
    workspaceMembers: {
        id: number;
        name: string;
        email: string;
        role: WorkspaceMemberRole;
        is_owner: boolean;
    }[];
    projects: ProjectOption[];
    archivedProjects: ArchivedProjectOption[];
    section: string;
    filters: { q: string; range: string };
    metrics: Metric[];
    bounceMetrics: BounceMetric[];
    bounceQueue: BounceQueueRow[];
    emails: EmailRow[];
    selectedEmail: EmailDetail | null;
    sidebarCounts: Record<string, number>;
    quota: {
        sent: number;
        limit: number | null;
        rate: number | null;
        sentLast24Hours: number | null;
        checkedAt: string | null;
    };
    source: {
        name: string;
        environment: string;
        ses_region: string;
        ses_configuration_set: string | null;
        default_from_name: string | null;
        default_from_email: string | null;
        retention_days: number;
        has_aws_credentials: boolean;
        has_aws_session_token: boolean;
        uses_instance_role: boolean;
        can_send: boolean;
    } | null;
    domains: {
        id: number;
        domain: string;
        status: string;
        dns_records:
            | { type: string; name: string; value: string; status?: string }[]
            | null;
        verified_at: string | null;
    }[];
    templates: {
        slug: string;
        name: string;
        subject: string;
        html: string | null;
        text: string | null;
        variables: string[] | null;
        updated_at: string;
    }[];
    webhooks: WebhookEndpointRow[];
    webhookStats: BounceMetric[];
    webhookDeliveries: WebhookDeliveryRow[];
    suppressions: SuppressionRow[];
    newWebhookEndpoint: NewWebhookEndpoint | null;
    sesWebhookUrl: string | null;
    apiKeys: {
        id: number;
        name: string;
        prefix: string;
        scopes: ApiKeyScope[] | null;
        last_used_at: string | null;
        last_used_ip: string | null;
        last_used_user_agent: string | null;
        expires_at: string | null;
        created_at: string;
    }[];
    newApiKey: string | null;
    setup: {
        webhook_url: string | null;
        next_step: {
            key: string;
            label: string;
            description: string;
            complete: boolean;
            href: string;
            status?: string;
        } | null;
        steps: {
            key: string;
            label: string;
            description: string;
            complete: boolean;
            href: string;
            status?: string;
        }[];
    };
};

export type MutableBag = {
    selected: Partial<EmailDetail> | null;
    activeTab: 'timeline' | 'preview' | 'headers' | 'metrics';
    selectedFilter: string;
    searchQuery: string;
    selectedRange: string;
    showProjectMenu: boolean;
    showMobileNav: boolean;
    showMobileSearch: boolean;
    showProjectForm: boolean;
    selectedIdentityDomain: string;
    showNewIdentity: boolean;
    showSourceSettings: boolean;
    revealedApiKey: string | null;
    apiKeyCopied: boolean;
    showWebhookForm: boolean;
    showWebhookDeliveries: boolean;
    editingWebhookId: string | null;
    revealedWebhookEndpoint: NewWebhookEndpoint | null;
    webhookSecretCopied: boolean;
    checkingDomainId: number | null;
    deletingDomainId: number | null;
    copiedDnsKey: string | null;
    inspectorWidth: number;
    isResizingInspector: boolean;
    editingProjectSlug: string | null;
    archivingProjectSlug: string | null;
    deletingProjectSlug: string | null;
    syncingQuota: boolean;
    attemptedAutoQuotaSync: boolean;
    showingArchivedProjects: boolean;
    restoringProjectSlug: string | null;
    confirmation: ConfirmationState;
    sourceForm: {
        name: string;
        environment: string;
        ses_region: string;
        ses_configuration_set: string;
        default_from_name: string;
        default_from_email: string;
        aws_access_key_id: string;
        aws_secret_access_key: string;
        aws_session_token: string;
        retention_days: number;
    };
    domainForm: { domain: string };
    templateForm: {
        slug: string;
        name: string;
        subject: string;
        html: string;
        text: string;
        variables: string;
    };
    apiKeyForm: {
        name: string;
        scopes: ApiKeyScope[];
        expires_at: string;
    };
    webhookForm: {
        url: string;
        events: string[];
        status: string;
    };
    sendForm: {
        from: string;
        to: string;
        cc: string;
        bcc: string;
        subject: string;
        html: string;
        text: string;
        template_id: string;
    };
    projectForm: {
        name: string;
        slug: string;
    };
};
