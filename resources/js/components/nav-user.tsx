import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, Sparkles } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';
import EditProfileModal from './edit-profile-modal';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    auth: {
        user: User;
    };
};

export function NavUser() {
    const { isMobile } = useSidebar();
    const { auth } = usePage<PageProps>().props;

    const [myProfile, setMyProfile] = useState(false);
    function onClose() {
        setMyProfile(false);
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg bg-slate-300">{auth.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{auth.user.name}</span>
                                    <span className="truncate text-xs">{auth.user.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? 'bottom' : 'right'}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        setMyProfile(true);
                                    }}
                                >
                                    <Sparkles />
                                    Edit your profile
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                <BellIcon />
                                Notifications
                            </DropdownMenuItem> */}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger className="w-full">
                                    <DropdownMenuItem
                                        className="w-full"
                                        onSelect={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <LogOut />
                                        Log out
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure want to log out?</AlertDialogTitle>
                                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction variant={'destructive'}>
                                            <Link href={'/logout'}>Continue</Link>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            {myProfile && <EditProfileModal isOpen={myProfile} onClose={onClose} />}
        </>
    );
}
