import type { SharedPageProps } from '@inertiajs/core';
import { Form, Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/DeleteUser';
import Heading from '@/components/Heading';
import InputError from '@/components/InputError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { User } from '@/types';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
};

export default function Profile({ mustVerifyEmail, status }: Props) {
    const { auth } = usePage<SharedPageProps & { auth: { user: User } }>()
        .props;
    const user = auth.user;

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Profile settings',
                href: edit(),
            },
        ],
    });

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="flex flex-col space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    name="name"
                                    defaultValue={user.name}
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    name="email"
                                    defaultValue={user.email}
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {mustVerifyEmail && !user.email_verified_at ? (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' ? (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been
                                            sent to your email address.
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}
