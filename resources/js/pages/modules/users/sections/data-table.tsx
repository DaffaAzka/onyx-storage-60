import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStatusLabel } from '@/lib/helpers';
import { Actions, SelectItems, User } from '@/lib/types';
import { HistoryIcon, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import ActionModal from './action-modal';

export default function DataTable({ users }: { users: User[] }) {
    const [actionModal, setActionModal] = useState<{
        user: User | null;
        isOpen: boolean;
        action: Actions | null;
    }>({
        user: null,
        isOpen: false,
        action: null,
    });

    const roles: SelectItems[] = [
        { id: 'admin', name: 'Admin' },
        { id: 'officer', name: 'Officer' },
        { id: 'user', name: 'User' },
    ];

    function handleCloseModal() {
        setActionModal({
            user: null,
            isOpen: false,
            action: null,
        });
    }

    return (
        <>
            <Card>
                <CardContent>
                    {users.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-25">No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{getStatusLabel(user.role)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontalIcon />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setActionModal({
                                                                user: user,
                                                                action: Actions.UPDATE,
                                                                isOpen: true,
                                                            });
                                                        }}
                                                    >
                                                        Update
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setActionModal({
                                                                user: user,
                                                                action: Actions.DETAIL,
                                                                isOpen: true,
                                                            });
                                                        }}
                                                    >
                                                        Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setActionModal({
                                                                user: user,
                                                                action: Actions.DELETE,
                                                                isOpen: true,
                                                            });
                                                        }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <>
                            <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-gray-400">
                                <HistoryIcon size={32} />
                                <p className="text-md font-medium lg:text-xl">No Users Found</p>
                            </div>
                        </>
                    )}

                    {actionModal.isOpen && actionModal.user && actionModal.action && (
                        <ActionModal
                            user={actionModal.user}
                            roles={roles}
                            isOpen={actionModal.isOpen}
                            action={actionModal.action}
                            onClose={handleCloseModal}
                        />
                    )}
                </CardContent>
            </Card>
        </>
    );
}
