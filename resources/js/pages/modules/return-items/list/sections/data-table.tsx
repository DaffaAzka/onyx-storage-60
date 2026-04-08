import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { printItemSoftDelete } from '@/lib/component-helpers';
import { formatCurrency } from '@/lib/helpers';
import { Actions, ReturnItem } from '@/lib/types';
import { HistoryIcon, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import ActionModal from '../../sections/action-modal';

export default function DataTable({ return_items }: { return_items: ReturnItem[] }) {
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
