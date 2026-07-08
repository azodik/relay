import type { SharedPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserMenuContent from '@/components/UserMenuContent';
import { getInitials } from '@/hooks/useInitials';
import { cn } from '@/lib/utils';

type UserAvatarMenuProps = {
    className?: string;
};

export default function UserAvatarMenu({ className }: UserAvatarMenuProps) {
    const { auth } = usePage<SharedPageProps>().props;
    const initials = getInitials(auth.user.name) || 'U';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    title={`${auth.user.name} · ${auth.user.email}`}
                    data-test="user-menu-button"
                    className={cn(
                        'grid size-[26px] place-items-center rounded-full bg-gradient-to-br from-signal/80 to-signal font-mono text-[11px] font-semibold text-signal-foreground outline-none ring-offset-background transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-signal',
                        className,
                    )}
                >
                    {initials}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56 rounded-lg">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
