import { Head, setLayoutProps } from '@inertiajs/react';
import AppearanceTabs from '@/components/AppearanceTabs';
import Heading from '@/components/Heading';
import { edit } from '@/routes/appearance';

export default function Appearance() {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Appearance settings',
                href: edit(),
            },
        ],
    });

    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update your account's appearance settings"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}
