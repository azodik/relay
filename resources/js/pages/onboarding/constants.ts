import type { WizardStep } from './types';

export const wizardSteps: WizardStep[] = [
    {
        key: 'basics',
        label: 'Basics',
        eyebrow: 'Step 1',
        title: 'Name the workspace and first project',
        description:
            'This creates the shared workspace and the first project that will own sources, domains, API keys, and email activity.',
    },
    {
        key: 'credentials',
        label: 'Source',
        eyebrow: 'Step 2',
        title: 'Choose how Azodik Relay will reach SES',
        description:
            'Self-hosters can paste IAM keys, AWS deployments can use an attached role, and evaluators can configure credentials later.',
    },
    {
        key: 'sender',
        label: 'Sender',
        eyebrow: 'Step 3',
        title: 'Set the default sender and optional domain',
        description:
            'When credentials are available, Azodik Relay creates the SES identity and returns DKIM records. Otherwise the domain is saved for setup.',
    },
    {
        key: 'api-key',
        label: 'API key',
        eyebrow: 'Step 4',
        title: 'Create the first application key',
        description:
            'The key is shown once after save. Use it from a Laravel app through the Azodik Relay mail transport or HTTP API.',
    },
    {
        key: 'finish',
        label: 'Finish',
        eyebrow: 'Step 5',
        title: 'Continue in the setup guide',
        description:
            'After this save, the setup page becomes the operational checklist for DNS, quota, SES events, and the first real test send.',
    },
];
