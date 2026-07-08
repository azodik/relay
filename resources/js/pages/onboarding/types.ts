import type { InertiaFormProps } from '@inertiajs/react';

export type CredentialMode = 'instance_role' | 'aws_keys' | 'configure_later';

export type DnsRecord = {
    type: string;
    name: string;
    value: string;
    status: string;
};

export type ProgressStep = {
    key: string;
    label: string;
    complete: boolean;
};

export type WizardStep = {
    key: string;
    label: string;
    eyebrow: string;
    title: string;
    description: string;
};

export type OnboardingProps = {
    workspace: {
        name: string;
        onboarded_at: string | null;
        setup_started_at: string | null;
    };
    project: {
        name: string;
        slug: string;
        path: string;
        setup_path: string;
        send_path: string;
        is_complete: boolean;
        has_started_setup: boolean;
        resume_path: string;
        credential_mode: CredentialMode;
        next_step: ProgressStep | null;
    };
    source: {
        name: string;
        environment: string;
        ses_region: string;
        ses_configuration_set: string | null;
        default_from_name: string | null;
        default_from_email: string | null;
        has_aws_credentials: boolean;
        has_aws_session_token: boolean;
        webhook_url: string;
    } | null;
    domain: {
        domain: string;
        status: string;
        dns_records: DnsRecord[];
    } | null;
    progress: ProgressStep[];
    install: { compose: string; migrate: string; worker: string };
};

export type OnboardingFormData = {
    workspace_name: string;
    project_name: string;
    project_slug: string;
    credential_mode: CredentialMode;
    source_name: string;
    environment: string;
    ses_region: string;
    ses_configuration_set: string;
    default_from_name: string;
    default_from_email: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    aws_session_token: string;
    sending_domain: string;
    create_api_key: boolean;
    api_key_name: string;
    webhook_url: string;
};

export type OnboardingForm = InertiaFormProps<OnboardingFormData>;
