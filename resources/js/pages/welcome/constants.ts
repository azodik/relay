import { dashboard, register } from '@/routes';

type FeatureAccent = 'mint' | 'blue' | 'violet' | 'amber';

type FeatureCard = {
    title: string;
    body: string;
    accent: FeatureAccent;
};

export type PrimaryCta =
    | { kind: 'inertia'; href: ReturnType<typeof dashboard>; label: string }
    | { kind: 'anchor'; href: string; label: string };

export const featureCards: FeatureCard[] = [
    {
        title: 'Message forensics, not guesswork',
        body: 'Trace every transactional send from Laravel request to SES Message-ID, recipient state, opens, clicks, MIME, and HTML preview—without leaving your VPC.',
        accent: 'mint',
    },
    {
        title: 'SES identities that stay honest',
        body: 'Register domains, surface DKIM CNAMEs, re-validate DNS on demand, and see which records still fail before you ship password resets or invoices.',
        accent: 'blue',
    },
    {
        title: 'Keep Mail::to() — change one env',
        body: 'Point MAIL_MAILER=relay and reuse mailables, notifications, and queues. Relay adds hashed API keys, rate-aware failures, and activity capture under Amazon SES.',
        accent: 'violet',
    },
    {
        title: 'Signed webhook deliveries you can audit',
        body: 'Normalize bounce and complaint events, retry failing endpoints, and inspect latency plus payload history when compliance asks what left your account.',
        accent: 'amber',
    },
];

export const repoUrl = 'https://github.com/azodik/relay';

export const azodikUrl = 'https://azodik.com';

export const installCommand =
    'curl -fsSL https://raw.githubusercontent.com/azodik/relay/main/docker-compose.yml -o docker-compose.yml && docker compose up -d';

export const setupSteps: [string, string, string][] = [
    [
        '01',
        'Boot the Relay stack',
        'Drop the published Compose file on your host, set APP_URL and database secrets, then bring up Azodik Relay with a single docker compose up.',
    ],
    [
        '02',
        'Attach your SES region',
        'Add IAM credentials (or instance role) so Relay can send, read quotas, manage identities, and receive Amazon SES events.',
    ],
    [
        '03',
        'Prove the sending domain',
        'Publish DKIM, SPF, and DMARC records, then re-check from the dashboard until SES marks the identity ready for production traffic.',
    ],
    [
        '04',
        'Issue an application key',
        'Create a scoped API key, copy it once into your Laravel apps, and start routing mail through Relay on your own infrastructure.',
    ],
];

export const marqueeItems = [
    'Password resets',
    'OTP codes',
    'Order receipts',
    'Invoice delivery',
    'Lifecycle digests',
    'Webhook audits',
    'Bounce suppressions',
    'SES quota watch',
    'DKIM health',
    'Raw MIME export',
] as const;

export const codeSnippet = `MAIL_MAILER=relay
RELAY_API_KEY=lsk_live_...
RELAY_ENDPOINT=https://mail.yourcompany.com

Mail::to($user)->send(new ReceiptMail($order));

Relay::emails()->send([
    'from' => 'receipts@yourcompany.com',
    'to' => $user->email,
    'subject' => 'Your receipt',
    'html' => view('mail.receipt', compact('order')),
]);`;

export const pageTitle =
    'Azodik Relay — Self-hosted Amazon SES dashboard for Laravel';

export const pageDescription =
    'Open-source, self-hosted transactional email control plane for Laravel teams on Amazon SES. Delivery logs, domain verification, API keys, webhooks, and suppressions—on your infrastructure.';

export function resolvePrimaryCta(
    isSignedIn: boolean,
    canRegister: boolean,
): PrimaryCta {
    if (isSignedIn) {
        return {
            kind: 'inertia',
            href: dashboard(),
            label: 'Open dashboard',
        };
    }

    if (canRegister) {
        return { kind: 'inertia', href: register(), label: 'Deploy Relay' };
    }

    return { kind: 'anchor', href: '#setup', label: 'See deploy steps' };
}
