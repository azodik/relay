import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import AppLogo from '@/components/AppLogo';
import NavFooter from '@/components/NavFooter';
import NavMain from '@/components/NavMain';
import NavUser from '@/components/NavUser';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/azodik/relay',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://relay.azodik.com',
        icon: BookOpen,
    },
];

export default function AppSidebar({ children }: PropsWithChildren) {
    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()}>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <NavMain items={mainNavItems} />
                </SidebarContent>

                <SidebarFooter>
                    <NavFooter items={footerNavItems} />
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
            {children}
        </>
    );
}
