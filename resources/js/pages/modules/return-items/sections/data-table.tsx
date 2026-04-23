import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { printItemSoftDelete } from '@/lib/component-helpers';
import { formatCurrency } from '@/lib/helpers';
import { Actions, ReturnItem } from '@/lib/types';
import { Link, usePage } from '@inertiajs/react';
import { HistoryIcon, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import ActionModal from './action-modal';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        role: string;
    };
};

export default function DataTable({ return_items }: { return_items: ReturnItem[] }) {
    const { auth } = usePage<PageProps>().props;

    const [detailModal, setDetailModal] = useState<{
        returnItem: ReturnItem | null;
        action: Actions | null;
        isOpen: boolean;
    }>({ returnItem: null, action: null, isOpen: false });

    function handleCloseModal() {
        setDetailModal({
            returnItem: null,
            action: null,
            isOpen: false,
        });
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>List of unpaid fine returns</CardTitle>
                    <CardAction>
                        <Link href={'/return-items/list'}>
                            <Button size={'sm'}>
                                <HistoryIcon />
                            </Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {return_items.length >= 1 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-25">No</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Borrower By</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Fine</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {return_items.map((data, index) => (
                                        <TableRow key={data.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="">
                                                <img
                                                    className="h-10 w-10 object-cover"
                                                    src={data.image_url ?? data.borrowing?.image_url ?? data.borrowing?.item?.image_url ?? ''}
                                                    alt={data.borrowing?.item?.name}
                                                />
                                            </TableCell>
                                            <TableCell className="">{printItemSoftDelete({ className: '', item: data.borrowing?.item })}</TableCell>
                                            <TableCell className="">{data.borrowing?.borrower?.name ?? 'N/A'}</TableCell>
                                            <TableCell className="">{data.borrowing?.quantity}</TableCell>
                                            <TableCell className="">
                                                {data.fine_paid ? (
                                                    <Badge variant={'secondary'}>{formatCurrency(data.fine_amount ?? 0)}</Badge>
                                                ) : (
                                                    <Badge variant={'destructive'}>{formatCurrency(data.fine_amount ?? 0)}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8">
                                                            <MoreHorizontalIcon />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {auth.role !== 'user' && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setDetailModal({
                                                                        returnItem: data,
                                                                        isOpen: true,
                                                                        action: Actions.UPDATE,
                                                                    })
                                                                }
                                                            >
                                                                Update
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setDetailModal({
                                                                    returnItem: data,
                                                                    isOpen: true,
                                                                    action: Actions.DETAIL,
                                                                })
                                                            }
                                                        >
                                                            Detail
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>
                    ) : (
                        <>
                            <div className="flex h-[20vh] flex-col items-center justify-center gap-2 text-gray-400">
                                <HistoryIcon size={32} />
                                <p className="text-md font-medium lg:text-xl">No Return Records Found</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {detailModal.returnItem && detailModal.isOpen && detailModal.action && (
                <ActionModal action={detailModal.action} returnItem={detailModal.returnItem} isOpen={detailModal.isOpen} onClose={handleCloseModal} />
            )}
        </>
    );
}
