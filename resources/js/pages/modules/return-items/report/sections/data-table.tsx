import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { printItemSoftDelete } from '@/lib/component-helpers';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/helpers';
import { Actions, ReturnItem } from '@/lib/types';
import { HistoryIcon, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import ActionModal from '../../sections/action-modal';

const conditionConfig: Record<string, { color: string; bgColor: string }> = {
    good: { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    fair: { color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    damaged: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
};

export default function DataTable({ return_items, userRole }: { return_items: ReturnItem[]; userRole: string }) {
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
                    {return_items.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Return Date</TableHead>
                                    <TableHead className="hidden lg:table-cell">Condition</TableHead>
                                    <TableHead className="hidden lg:table-cell">Fine</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {return_items.map((data, index) => (
                                    <TableRow key={data.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>
                                            <img
                                                className="h-10 w-10 object-cover"
                                                src={data.image_url ?? data.borrowing?.image_url ?? data.borrowing?.item?.image_url ?? ''}
                                                alt={data.borrowing?.item?.name}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {printItemSoftDelete({
                                                className: '',
                                                item: data.borrowing?.item,
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-20 truncate lg:w-fit">
                                                {data.borrowing?.borrower?.name ?? 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(data.return_date ?? '')}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <Badge className={`${conditionConfig[data.condition || 'fair']?.color}`}>
                                                {getStatusLabel(data.condition)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {data.fine_paid ? (
                                                <Badge variant={'secondary'}>{formatCurrency(data.fine_amount ?? 0)}</Badge>
                                            ) : (
                                                <Badge variant={'destructive'}>{formatCurrency(data.fine_amount ?? 0)}</Badge>
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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setDetailModal({
                                                                returnItem: data,
                                                                action: Actions.DETAIL,
                                                                isOpen: true,
                                                            });
                                                        }}
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
                    ) : (
                        <>
                            <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-gray-400">
                                <HistoryIcon size={32} />
                                <p className="text-md font-medium lg:text-xl">No Return Records Found</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {detailModal.returnItem && detailModal.isOpen && detailModal.action ? (
                <ActionModal action={detailModal.action} returnItem={detailModal.returnItem} isOpen={detailModal.isOpen} onClose={handleCloseModal} />
            ) : (
                <></>
            )}
        </>
    );
}
