'use client';

import { usePage } from '@inertiajs/react';
import { Activity, ClipboardList, DatabaseBackupIcon, LayoutDashboard, Package, RefreshCw, Users } from 'lucide-react';
import * as React from 'react';

import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { authorizations } from '@/lib/helpers';
import { NavMain } from './nav-main';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        role: string;
    };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;

    const data = {
        navMain: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutDashboard,
                isActive: true,
                isShow: true,
            },

            {
                title: 'Borrowings',
                url: '#',
                icon: ClipboardList,
                isActive: true,
                isShow: true,
                items: [
                    {
                        title: 'Create Borrowing',
                        url: '/borrowings/create',
                        isActive: true,
                        isShow: true,
                    },
                    {
                        title: 'Manage Borrowings',
                        url: '/borrowings',
                        isActive: true,
                        isShow: true,
                    },
                    {
                        title: 'Borrowing Report',
                        url: '/borrowings/report',
                        isActive: true,
                        isShow: true,
                    },
                ],
            },

            {
                title: 'Returns',
                url: '#',
                icon: RefreshCw,
                isActive: true,
                isShow: true,
                items: [
                    {
                        title: 'Manage Returns',
                        url: '/return-items',
                        isActive: true,
                        isShow: true,
                    },
                    {
                        title: 'Return Report',
                        url: '/return-items/report',
                        isActive: true,
                        isShow: true,
                    },
                ],
            },

            {
                title: 'Master',
                url: '#',
                icon: Package,
                isActive: true,
                isShow: authorizations(auth.role, ['admin']),
                items: [
                    {
                        title: 'Manage Items',
                        url: '/items',
                        isActive: true,
                        isShow: true,
                    },
                    {
                        title: 'Manage Categories',
                        url: '/categories',
                        isActive: true,
                        isShow: true,
                    },
                    {
                        title: 'Manage Users',
                        url: '/users',
                        isActive: true,
                        isShow: authorizations(auth.role, ['admin']),
                    },
                ],
            },

            {
                title: 'Users',
                url: '/users',
                icon: Users,
                isActive: true,
                items: [
                    {
                        title: 'Manage Users',
                        url: '#',
                        isActive: true,
                        isShow: true,
                    },
                ],
            },

            {
                title: 'Activity Logs',
                url: '/activity-logs',
                icon: Activity,
                isActive: true,
                isShow: authorizations(auth.role, ['admin', 'officer']),
            },
        ],
    };

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex flex-row content-center items-center gap-2">
                                <DatabaseBackupIcon size={8} />
                                <span className="truncate font-medium"> Onyx Storage</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
