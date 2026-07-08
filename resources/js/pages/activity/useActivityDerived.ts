import {
    Activity as ActivityIcon,
    AlertTriangle,
    Cloud,
    FileText,
    KeyRound,
    MailCheck,
    Power,
    Send,
    SlidersHorizontal,
} from 'lucide-react';
import {
    dateGroupLabel,
    pageTitleForSection,
    relativeTime,
    statusFilters,
} from './helpers';
import type { ActivityProps, EmailRow, MutableBag } from './types';

export function useActivityDerived(props: ActivityProps, s: MutableBag) {
    const {
        project,
        workspace,
        section,
        bounceQueue,
        emails,
        sidebarCounts,
        quota,
        source,
        domains,
        templates,
        webhooks,
        suppressions,
        sesWebhookUrl,
        apiKeys,
        setup,
    } = props;

    const filteredEmails = (() => {
        if (s.selectedFilter === 'All') {
            return emails;
        }

        return emails.filter(
            (email) => email.status === s.selectedFilter.toLowerCase(),
        );
    })();

    const statusFilterCounts = (() => {
        const counts: Record<string, number> = { All: emails.length };

        for (const filter of statusFilters.slice(1)) {
            counts[filter] = emails.filter(
                (email) => email.status === filter.toLowerCase(),
            ).length;
        }

        return counts;
    })();

    const groupedEmails = (() => {
        const groups: Record<string, EmailRow[]> = {};

        for (const email of filteredEmails) {
            const label = dateGroupLabel(new Date(email.createdAt));

            groups[label] = [...(groups[label] ?? []), email];
        }

        return Object.entries(groups).map(([label, rows]) => ({ label, rows }));
    })();

    const complaintRows = emails.filter((email) => email.status === 'complained');

    const suppressionRows = suppressions;
    const bounceSuppressionCount = suppressionRows.filter(
        (row) => row.reason === 'hard_bounce',
    ).length;
    const complaintSuppressionCount = suppressionRows.filter(
        (row) => row.reason === 'complaint',
    ).length;
    const lastComplaintTime = complaintRows[0]?.time ?? 'Never';

    const canSendEmail = Boolean(source?.can_send) && workspace.can_send;

    const apiKeyStats = (() => {
        const total = apiKeys.length;
        const used = apiKeys.filter((key) => key.last_used_at).length;

        return [
            { label: 'Total keys', value: total.toLocaleString(), meta: 'issued' },
            {
                label: 'Used keys',
                value: used.toLocaleString(),
                meta: 'have activity',
            },
            {
                label: 'Project sends (30d)',
                value: quota.sent.toLocaleString(),
                meta: 'stored',
            },
        ];
    })();

    const templateStats = [
        {
            label: 'Templates',
            value: templates.length.toLocaleString(),
            meta: 'saved',
        },
        {
            label: 'Template sends',
            value: emails
                .filter((email) => email.template)
                .length.toLocaleString(),
            meta: '30d',
        },
        {
            label: 'Open coverage',
            value: `${Math.round((emails.filter((email) => email.opens > 0).length / Math.max(emails.length, 1)) * 100)}%`,
            meta: 'observed',
        },
        {
            label: 'Click coverage',
            value: `${Math.round((emails.filter((email) => email.clicks > 0).length / Math.max(emails.length, 1)) * 100)}%`,
            meta: 'observed',
        },
    ];

    const quotaPercent = quota.limit
        ? Math.min(100, Math.round((quota.sent / quota.limit) * 100))
        : 0;
    const hasProviderQuota = Boolean(quota.limit);
    const quotaTitle = hasProviderQuota ? 'SES 24h quota' : 'Stored sends';
    const quotaStatus = (() => {
        if (!source) {
            return 'source missing';
        }

        if (quota.checkedAt) {
            return `last synced ${relativeTime(quota.checkedAt)}`;
        }

        return 'sync required';
    })();
    const quotaDetail = (() => {
        if (!quota.limit) {
            return 'Provider quota not synced yet.';
        }

        const used = quota.sentLast24Hours ?? 0;
        const rate = quota.rate ? `${quota.rate}/s` : 'rate unknown';

        return `${used.toLocaleString()} used in the last 24h · ${rate}`;
    })();
    const quotaIsStale = (() => {
        if (!source) {
            return false;
        }

        if (!quota.checkedAt) {
            return true;
        }

        const checkedAt = new Date(quota.checkedAt).getTime();

        return Number.isNaN(checkedAt)
            ? true
            : Date.now() - checkedAt > 6 * 60 * 60 * 1000;
    })();
    const verifiedDomain = domains.find((domain) =>
        ['verified', 'local'].includes(domain.status),
    );
    const activeWebhookCount = webhooks.filter(
        (webhook) => webhook.configured_status !== 'paused',
    ).length;
    const credentialMode = (() => {
        if (!source) {
            return 'Not configured';
        }

        if (source.uses_instance_role) {
            return 'EC2 instance role';
        }

        if (source.has_aws_credentials) {
            return source.has_aws_session_token
                ? 'STS credentials'
                : 'Stored IAM keys';
        }

        return 'Missing credentials';
    })();
    const setupWebhookStep = setup.steps.find((step) => step.key === 'webhook');
    const setupHealthCards = [
        {
            label: 'Credentials',
            value: credentialMode,
            meta: source?.default_from_email
                ? source.default_from_email
                : 'Default sender missing',
            tone:
                source?.has_aws_credentials || source?.uses_instance_role
                    ? 'success'
                    : 'warning',
        },
        {
            label: 'Domain',
            value: verifiedDomain?.domain ?? 'Not verified',
            meta: verifiedDomain
                ? `${project.region} verified`
                : `${domains.length.toLocaleString()} configured`,
            tone: verifiedDomain ? 'success' : 'warning',
        },
        {
            label: 'Quota',
            value: quota.limit
                ? `${quota.limit.toLocaleString()} / 24h`
                : s.syncingQuota
                  ? 'Syncing'
                  : 'Needs sync',
            meta: quota.rate ? `${quota.rate}/s send rate` : quotaStatus,
            tone: quota.limit ? 'success' : 'warning',
        },
        {
            label: 'Events',
            value: setupWebhookStep?.complete
                ? 'Events received'
                : sesWebhookUrl
                  ? 'Webhook URL ready'
                  : 'Source missing',
            meta: activeWebhookCount
                ? `${activeWebhookCount.toLocaleString()} outbound active`
                : (setupWebhookStep?.status ?? 'Waiting for SES event'),
            tone: setupWebhookStep?.complete
                ? 'success'
                : sesWebhookUrl
                  ? 'warning'
                  : 'neutral',
        },
        {
            label: 'API keys',
            value: apiKeys.length ? apiKeys.length.toLocaleString() : 'None',
            meta: apiKeys.some((key) => key.last_used_at)
                ? 'Has recent usage'
                : 'No usage yet',
            tone: apiKeys.length ? 'success' : 'neutral',
        },
    ];
    const complaintRate = `${((complaintRows.length / Math.max(emails.length, 1)) * 100).toFixed(3)}%`;
    const projectBasePath = `/projects/${project.slug}`;
    const sectionPath = sectionHref(section);
    const exportHref = (() => {
        const params = new URLSearchParams({
            section: section,
            range: s.selectedRange,
        });

        if (s.searchQuery) {
            params.set('q', s.searchQuery);
        }

        return `${project.exportPath}?${params.toString()}`;
    })();

    function sectionHref(nextSection: string): string {
        return `${projectBasePath}/${nextSection}`;
    }

    function projectAction(path: string): string {
        return `${projectBasePath}${path}`;
    }

    const navItems = [
        {
            label: 'Activity',
            section: 'activity',
            href: sectionHref('activity'),
            icon: ActivityIcon,
            count: sidebarCounts.activity,
        },
        {
            label: 'Sent',
            section: 'sent',
            href: sectionHref('sent'),
            icon: Send,
            count: sidebarCounts.sent,
        },
        {
            label: 'Bounces',
            section: 'bounces',
            href: sectionHref('bounces'),
            icon: ActivityIcon,
            count: sidebarCounts.bounces,
        },
        {
            label: 'Complaints',
            section: 'complaints',
            href: sectionHref('complaints'),
            icon: AlertTriangle,
            count: sidebarCounts.complaints,
        },
        {
            label: 'Suppressions',
            section: 'suppressions',
            href: sectionHref('suppressions'),
            icon: Power,
            count: sidebarCounts.suppressions,
        },
    ];

    const configItems = [
        {
            label: 'Workspace',
            section: 'projects',
            href: sectionHref('projects'),
            icon: Cloud,
        },
        {
            label: 'Sending source',
            section: 'setup',
            href: sectionHref('setup'),
            icon: SlidersHorizontal,
        },
        {
            label: 'Domains',
            section: 'identities',
            href: sectionHref('identities'),
            icon: MailCheck,
        },
        {
            label: 'Templates',
            section: 'templates',
            href: sectionHref('templates'),
            icon: FileText,
        },
        {
            label: 'Webhooks',
            section: 'webhooks',
            href: sectionHref('webhooks'),
            icon: Cloud,
        },
        {
            label: 'API keys',
            section: 'api-keys',
            href: sectionHref('api-keys'),
            icon: KeyRound,
        },
    ];

    const isMailSection = [
        'activity',
        'sent',
        'bounces',
        'complaints',
    ].includes(section);

    const showMetrics = ['activity', 'sent'].includes(section);
    const softBounceCount = bounceQueue.filter(
        (bounce) => bounce.type === 'Soft',
    ).length;
    const hardBounceCount = bounceQueue.filter(
        (bounce) => bounce.type === 'Hard',
    ).length;
    const selectedIdentity =
        domains.find((domain) => domain.domain === s.selectedIdentityDomain) ??
        domains[0] ??
        null;
    const selectedIdentityRecords = selectedIdentity?.dns_records ?? [];
    const identityStats = (() => {
        const sent = emails.length;
        const delivered = emails.filter((email) =>
            ['delivered', 'opened', 'clicked'].includes(email.status),
        ).length;
        const bounced = emails.filter(
            (email) => email.status === 'bounced',
        ).length;
        const complained = emails.filter(
            (email) => email.status === 'complained',
        ).length;
        const total = Math.max(sent, 1);

        return [
            { label: 'Sends (30d)', value: sent.toLocaleString() },
            {
                label: 'Delivery',
                value: `${((delivered / total) * 100).toFixed(2)}%`,
            },
            { label: 'Bounce', value: `${((bounced / total) * 100).toFixed(2)}%` },
            {
                label: 'Complaint',
                value: `${((complained / total) * 100).toFixed(2)}%`,
            },
        ];
    })();
    const pageTitle = pageTitleForSection(section);

    return {
        filteredEmails,
        statusFilterCounts,
        groupedEmails,
        complaintRows,
        suppressionRows,
        bounceSuppressionCount,
        complaintSuppressionCount,
        lastComplaintTime,
        canSendEmail,
        apiKeyStats,
        templateStats,
        quotaPercent,
        hasProviderQuota,
        quotaTitle,
        quotaStatus,
        quotaDetail,
        quotaIsStale,
        verifiedDomain,
        activeWebhookCount,
        credentialMode,
        setupWebhookStep,
        setupHealthCards,
        complaintRate,
        projectBasePath,
        sectionPath,
        exportHref,
        sectionHref,
        projectAction,
        navItems,
        configItems,
        isMailSection,
        showMetrics,
        softBounceCount,
        hardBounceCount,
        selectedIdentity,
        selectedIdentityRecords,
        identityStats,
        pageTitle,
    };
}

export type ActivityDerived = ReturnType<typeof useActivityDerived>;
