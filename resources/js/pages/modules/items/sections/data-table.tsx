import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Actions, Item, SelectItems } from '@/lib/types';
import { HistoryIcon, MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';
import ActionModal from './action-modal';

export default function DataTable({ items, categories }: { items: Item[]; categories: SelectItems[] }) {
    const [actionModal, setActionModal] = useState<{
        item: Item | null;
        categories: SelectItems[];
        isOpen: boolean;
        action: Actions | null;
    }>({
        item: null,
        categories: [],
        isOpen: false,
        action: null,
    });

    function handleClick(item: Item, categories: SelectItems[], isOpen: boolean, action: Actions) {
        setActionModal({
            item: item,
            categories: categories,
            isOpen: isOpen,
            action: action,
        });
    }

    function handleCloseModal() {
        setActionModal({
            item: null,
            categories: [],
            isOpen: false,
            action: null,
        });
    }

    return (
        <>
            <Card>
                <CardContent>
                    {items.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Item Image</TableHead>
                                    <TableHead>Item Code</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Available Quantity</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="">
                                            <img className="h-10 w-10 object-cover" src={item.image_url ?? ''} alt={item.name ?? 'N/A'} />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.code}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.available_quantity}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.category?.name ?? 'N/A'}</TableCell>
                                        <TableCell className="flex flex-row justify-end gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontalIcon />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleClick(item, categories, true, Actions.UPDATE)}>
                                                        Update
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleClick(item, categories, true, Actions.DETAIL)}>
                                                        Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => handleClick(item, categories, true, Actions.DELETE)}
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
                                <p className="text-md font-medium lg:text-xl">No Items Found</p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {actionModal.item && actionModal.isOpen && actionModal.action ? (
                <ActionModal
                    item={actionModal.item}
                    categories={actionModal.categories}
                    action={actionModal.action}
                    isOpen={actionModal.isOpen}
                    onClose={handleCloseModal}
                />
            ) : (
                <></>
            )}
        </>
    );
}
