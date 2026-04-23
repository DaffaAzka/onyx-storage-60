import SelectForm from '@/components/select-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { printItemSoftDelete, printUserNameSoftDelete } from '@/lib/component-helpers';
import { authorizations, formatDate, getStatusLabel } from '@/lib/helpers';
import { Actions, Borrowing, SelectItems } from '@/lib/types';
import { HistoryIcon, Info, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import ActionModal from './action-modal';
import StatusModal from './status-modal';

const statusConfig: Record<string, { color: string; bgColor: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    approved: { color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    rejected: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
    borrowed: { color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    returned: { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    late: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
};

export default function DataTable({ borrowings, userRole }: { borrowings: Borrowing[]; userRole: string }) {
    const [statusModal, setStatusModal] = useState<{
        borrowing: Borrowing | null;
        isOpen: boolean;
        status: String | null;
    }>({
        borrowing: null,
        isOpen: false,
        status: null,
    });

    const [actionModal, setActionModal] = useState<{
        borrowing: Borrowing | null;
        action: Actions | null;
        isOpen: boolean;
    }>({
        borrowing: null,
        action: null,
        isOpen: false,
    });

    function getStatusOptions(currentStatus: string): SelectItems[] {
        switch (currentStatus) {
            case 'pending':
                return [
                    { id: 'pending', name: 'Pending' },
                    { id: 'approved', name: 'Approved' },
                    { id: 'rejected', name: 'Rejected' },
                ];

            case 'approved':
                return [
                    { id: 'approved', name: 'Approved' },
                    { id: 'borrowed', name: 'Borrowed' },
                ];

            case 'rejected':
                return [
                    { id: 'rejected', name: 'Rejected' },
                    { id: 'pending', name: 'Resubmit' },
                ];
            case 'borrowed':
            default:
                return [{ id: currentStatus, name: getStatusLabel(currentStatus) }];
        }
    }

    function isStatusDisabled(currentStatus: string): boolean {
        const isAdminOrOfficer = authorizations(userRole, ['admin', 'officer']);

        if (!isAdminOrOfficer && currentStatus == 'approved') {
            return false;
        }

        if (currentStatus == 'borrowed' || currentStatus == 'returned' || currentStatus == 'late' || currentStatus == 'rejected') {
            return true;
        }

        return !isAdminOrOfficer;
    }

    function handleChange(borrowing: Borrowing, value: string) {
        if (value == 'pending' && borrowing.status == 'rejected') {
            setStatusModal({
                borrowing: borrowing,
                isOpen: true,
                status: value,
            });
        } else if (value !== 'pending') {
            setStatusModal({
                borrowing: borrowing,
                isOpen: true,
                status: value,
            });
        }
    }

    function handleCloseModal() {
        setStatusModal({
            borrowing: null,
            isOpen: false,
            status: null,
        });

        setActionModal({
            borrowing: null,
            action: null,
            isOpen: false,
        });
    }

    return (
        <>
            <Card>
                <CardContent>
                    {borrowings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    {userRole === 'admin' || userRole === 'officer' ? (
                                        <TableHead>Borrowed By</TableHead>
                                    ) : (
                                        <TableHead>Approved By</TableHead>
                                    )}
                                    <TableHead>Borrow Date</TableHead>
                                    <TableHead className="hidden lg:table-cell">Planned Return Date</TableHead>
                                    <TableHead className="w-8">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {borrowings.map((borrowing, index) => (
                                    <TableRow key={borrowing.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <img
                                                className="h-10 w-10 object-cover"
                                                src={(borrowing.image_path ? borrowing.image_url : borrowing.item?.image_url) ?? ''}
                                                alt={borrowing.item?.name}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {printItemSoftDelete({
                                                className: '',
                                                item: borrowing.item,
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-20 truncate lg:w-fit">
                                                {userRole == 'user'
                                                    ? printUserNameSoftDelete({
                                                          className: '',
                                                          user: borrowing.approver,
                                                      })
                                                    : printUserNameSoftDelete({
                                                          className: '',
                                                          user: borrowing.borrower,
                                                      })}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(borrowing.borrow_date) ?? 'N/A'}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{formatDate(borrowing.planned_return_date) ?? 'N/A'}</TableCell>
                                        <TableCell>
                                            {isStatusDisabled(borrowing.status) ? (
                                                <div className="flex items-center">
                                                    <Badge className={`w-full ${statusConfig[borrowing.status || 'fair']?.color}`}>
                                                        {getStatusLabel(borrowing.status)}
                                                    </Badge>

                                                    {borrowing.status === 'rejected' && borrowing.rejection_reason && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="ms-2 flex cursor-pointer items-center text-red-500 hover:text-red-700">
                                                                    <Info size={16} />
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{borrowing.rejection_reason}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            ) : (
                                                <SelectForm
                                                    items={getStatusOptions(borrowing.status)}
                                                    handleChange={(value) => {
                                                        handleChange(borrowing, value);
                                                    }}
                                                    name="status"
                                                    text="Select Status"
                                                    value={borrowing.status}
                                                    usePlaceholder={true}
                                                    isDisabled={isStatusDisabled(borrowing.status)}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="flex flex-row justify-end gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontalIcon />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {borrowing.status === 'pending' || borrowing.status === 'rejected' ? (
                                                        <>
                                                            {userRole === 'user' ? (
                                                                <>
                                                                    {borrowing.status === 'rejected' && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => {
                                                                                setActionModal({
                                                                                    borrowing: borrowing,
                                                                                    action: Actions.UPDATE,
                                                                                    isOpen: true,
                                                                                });
                                                                            }}
                                                                        >
                                                                            Resubmit
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActionModal({
                                                                                borrowing: borrowing,
                                                                                action: Actions.DETAIL,
                                                                                isOpen: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        Detail
                                                                    </DropdownMenuItem>

                                                                    {borrowing.status === 'rejected' && (
                                                                        <>
                                                                            <DropdownMenuSeparator />

                                                                            <DropdownMenuItem
                                                                                variant="destructive"
                                                                                onClick={() => {
                                                                                    setActionModal({
                                                                                        borrowing: borrowing,
                                                                                        action: Actions.DELETE,
                                                                                        isOpen: true,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActionModal({
                                                                                borrowing: borrowing,
                                                                                action: Actions.UPDATE,
                                                                                isOpen: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        {borrowing.status !== 'rejected' ? 'Update' : 'Resubmit'}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setActionModal({
                                                                                borrowing: borrowing,
                                                                                action: Actions.DETAIL,
                                                                                isOpen: true,
                                                                            });
                                                                        }}
                                                                    >
                                                                        Detail
                                                                    </DropdownMenuItem>
                                                                    {borrowing.status === 'rejected' && (
                                                                        <>
                                                                            <DropdownMenuSeparator />

                                                                            <DropdownMenuItem
                                                                                variant="destructive"
                                                                                onClick={() => {
                                                                                    setActionModal({
                                                                                        borrowing: borrowing,
                                                                                        action: Actions.DELETE,
                                                                                        isOpen: true,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setActionModal({
                                                                        borrowing: borrowing,
                                                                        action: Actions.DETAIL,
                                                                        isOpen: true,
                                                                    });
                                                                }}
                                                            >
                                                                Detail
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
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
                                <p className="text-md font-medium lg:text-xl">No Borrowing Records Found</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {statusModal.isOpen == true && statusModal.borrowing ? (
                <StatusModal isOpen={true} borrowing={statusModal.borrowing} status={statusModal.status ?? ''} onClose={handleCloseModal} />
            ) : (
                <></>
            )}

            {actionModal.isOpen == true && actionModal.borrowing && actionModal.action ? (
                <ActionModal borrowing={actionModal.borrowing} action={actionModal.action} isOpen={actionModal.isOpen} onClose={handleCloseModal} />
            ) : (
                <></>
            )}
        </>
    );
}
