import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    AlertTriangle,
    KeyRound,
    MailCheck,
    Power,
    Send,
} from 'lucide-react';
import type { TimeRangeOption } from '@/lib/time-range';
import { timeRangeOptions } from '@/lib/time-range';

export type PreviewRow = {
    id: string;
    recipient: string;
    email: string;
    subject: string;
    template: string;
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';
    opens: number;
    clicks: number;
    time: string;
};

export type NavItem = {
    label: string;
    icon: LucideIcon;
    count?: string;
};

export type PreviewMetric = {
    label: string;
    value: string;
    delta: string;
    tone: 'up' | 'down';
};

export type InspectorTab = 'timeline' | 'preview' | 'headers' | 'metrics';

export const rows: PreviewRow[] = [
    {
        id: 'email_hG1L04nAQf',
        recipient: 'Northwind Support',
        email: 'support@northwind.io',
        subject: 'Form submission received',
        template: 'custom',
        status: 'sent',
        opens: 0,
        clicks: 0,
        time: 'now',
    },
    {
        id: 'email_01HZK9XQ8',
        recipient: 'Maya Okafor',
        email: 'maya@northwind.io',
        subject: 'Your receipt from Northwind',
        template: 'tx.receipt.v3',
        status: 'clicked',
        opens: 3,
        clicks: 2,
        time: '13m',
    },
    {
        id: 'email_01HZK7R2M',
        recipient: 'Darren Lin',
        email: 'darren@level.io',
        subject: 'Reset your password',
        template: 'auth.password-reset',
        status: 'opened',
        opens: 1,
        clicks: 0,
        time: '16m',
    },
    {
        id: 'email_01HZK5E8V',
        recipient: 'Hexabrew Team',
        email: 'team@hexabrew.shop',
        subject: 'Weekly digest',
        template: 'digest.weekly.v1',
        status: 'delivered',
        opens: 0,
        clicks: 0,
        time: '20m',
    },
    {
        id: 'email_01HZK3L9C',
        recipient: 'Ana del Pino',
        email: 'ana.delpino@gmail.cm',
        subject: 'Welcome to Harborlight',
        template: 'onb.welcome.v6',
        status: 'bounced',
        opens: 0,
        clicks: 0,
        time: '42m',
    },
    {
        id: 'email_01HZK2P4Q',
        recipient: 'Oliver Brandt',
        email: 'oliver@tealgrid.dev',
        subject: 'Invoice #4821',
        template: 'tx.invoice.v4',
        status: 'opened',
        opens: 2,
        clicks: 0,
        time: '52m',
    },
];

export const earlierRows: PreviewRow[] = [
    {
        id: 'email_01HZJX2K7',
        recipient: 'Priya Raman',
        email: 'priya@atlaslabs.co',
        subject: 'Your export is ready',
        template: 'tx.export.v2',
        status: 'delivered',
        opens: 1,
        clicks: 0,
        time: '1h',
    },
    {
        id: 'email_01HZJT8M3',
        recipient: 'Jonas Weber',
        email: 'jonas@ferrogmbh.de',
        subject: 'Verify your email address',
        template: 'auth.verify.v2',
        status: 'clicked',
        opens: 2,
        clicks: 1,
        time: '2h',
    },
    {
        id: 'email_01HZJR5W9',
        recipient: 'Callie Mercer',
        email: 'callie@driftwoodco.com',
        subject: 'Payment failed — action needed',
        template: 'billing.dunning.v1',
        status: 'opened',
        opens: 4,
        clicks: 0,
        time: '2h',
    },
    {
        id: 'email_01HZJN1F5',
        recipient: 'Studio Nomad',
        email: 'hello@studionomad.works',
        subject: 'Your proposal was viewed',
        template: 'crm.notify.v1',
        status: 'delivered',
        opens: 0,
        clicks: 0,
        time: '3h',
    },
    {
        id: 'email_01HZJK9B2',
        recipient: 'Tomás Rivera',
        email: 'tomas@quintaverde.mx',
        subject: 'Shipping confirmation',
        template: 'tx.shipping.v2',
        status: 'clicked',
        opens: 3,
        clicks: 2,
        time: '4h',
    },
    {
        id: 'email_01HZJG4D8',
        recipient: 'June Park',
        email: 'june@luminaryapp.io',
        subject: 'Your trial ends in 3 days',
        template: 'lifecycle.trial.v3',
        status: 'opened',
        opens: 1,
        clicks: 0,
        time: '5h',
    },
];

export const navItems: NavItem[] = [
    { label: 'Activity', icon: Activity, count: '16' },
    { label: 'Sent', icon: Send, count: '16' },
    { label: 'Bounces', icon: Activity, count: '2' },
    { label: 'Complaints', icon: AlertTriangle, count: '1' },
    { label: 'Suppressions', icon: Power, count: '2' },
];

export const configItems: NavItem[] = [
    { label: 'Identities', icon: MailCheck },
    { label: 'Webhooks', icon: Activity },
    { label: 'API keys', icon: KeyRound },
];

export const rangeOptions: readonly TimeRangeOption[] = timeRangeOptions;
export const inspectorTabs: InspectorTab[] = [
    'timeline',
    'preview',
    'headers',
    'metrics',
];
export const timelineEvents = ['send', 'delivery', 'open', 'click'] as const;

export function statusClass(status: PreviewRow['status']): string {
    return (
        {
            sent: 'is-sent',
            delivered: 'is-delivered',
            opened: 'is-opened',
            clicked: 'is-clicked',
            bounced: 'is-bounced',
        }[status] ?? 'is-sent'
    );
}

export function timelineDescription(
    event: (typeof timelineEvents)[number],
): string {
    if (event === 'send') {
        return 'SES accepted message';
    }

    if (event === 'delivery') {
        return 'Recipient server returned 250 OK';
    }

    if (event === 'open') {
        return 'Opened in Apple Mail';
    }

    return 'Receipt link clicked';
}
