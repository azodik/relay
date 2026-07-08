import ActivityShell from './activity/ActivityShell';
import ActivityFeedSection from './activity/sections/ActivityFeedSection';
import ApiKeysSection from './activity/sections/ApiKeysSection';
import BouncesSection from './activity/sections/BouncesSection';
import ComplaintsSection from './activity/sections/ComplaintsSection';
import IdentitiesSection from './activity/sections/IdentitiesSection';
import ProjectsSection from './activity/sections/ProjectsSection';
import SendSection from './activity/sections/SendSection';
import SetupSection from './activity/sections/SetupSection';
import SuppressionsSection from './activity/sections/SuppressionsSection';
import TemplatesSection from './activity/sections/TemplatesSection';
import WebhooksSection from './activity/sections/WebhooksSection';
import type { ActivityProps } from './activity/types';
import { useActivityController } from './activity/useActivityController';

export type { ActivityProps };

export default function Activity(props: ActivityProps) {
    const ctx = useActivityController(props);
    const { section, isMailSection } = ctx;

    let content = null;

    if (section === 'bounces') {
        content = <BouncesSection ctx={ctx} />;
    } else if (section === 'complaints') {
        content = <ComplaintsSection ctx={ctx} />;
    } else if (isMailSection) {
        content = <ActivityFeedSection ctx={ctx} />;
    } else {
        let configContent = null;

        if (section === 'projects') {
            configContent = <ProjectsSection ctx={ctx} />;
        } else if (section === 'setup') {
            configContent = <SetupSection ctx={ctx} />;
        } else if (section === 'send') {
            configContent = <SendSection ctx={ctx} />;
        } else if (section === 'identities') {
            configContent = <IdentitiesSection ctx={ctx} />;
        } else if (section === 'templates') {
            configContent = <TemplatesSection ctx={ctx} />;
        } else if (section === 'webhooks') {
            configContent = <WebhooksSection ctx={ctx} />;
        } else if (section === 'api-keys') {
            configContent = <ApiKeysSection ctx={ctx} />;
        } else {
            configContent = <SuppressionsSection ctx={ctx} />;
        }

        content = (
            <section className="relay-config-scroll bg-transparent p-3 sm:p-4">
                {configContent}
            </section>
        );
    }

    return <ActivityShell ctx={ctx}>{content}</ActivityShell>;
}
