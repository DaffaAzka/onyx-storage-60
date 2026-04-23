import { Item, User } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import BorrowModal from './borrow-modal';
import { HistoryIcon } from 'lucide-react';

export default function DataCards({ items, users }: { items: Item[], users: User[] | null }) {
    const [borrowModal, setBorrowModal] = useState<{
        item: Item | null;
        isOpen: boolean;
    }>({
        item: null,
        isOpen: false,
    });

    function handleClick(item: Item, isOpen: boolean) {
        setBorrowModal({
            item: item,
            isOpen: isOpen,
        });
    }

    return (
        <>
            {items.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {items.map((item) => (
                            <Card key={item.id} className="relative mx-auto flex w-full flex-col pt-0">
                                <img
                                    src={item.image_url || '/images/default-event.jpg'}
                                    alt="Event cover"
                                    className="relative z-20 aspect-video w-full rounded-tl-xl rounded-tr-xl object-cover brightness-80 dark:brightness-80"
                                />
                                <div className="mx-6 grid grid-cols-2 items-center justify-between gap-4">
                                    <div className="rounded-md bg-green-200 py-2 text-center">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold">Total</p>
                                            <p className="text-xs font-semibold">{item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="rounded-md bg-yellow-200 py-2 text-center">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold">Available</p>
                                            <p className="text-xs font-semibold">{item.available_quantity}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="">
                                    <CardHeader className="flex items-center justify-between pb-3">
                                        <CardTitle className="text-lg">{item.name}</CardTitle>
                                        <CardAction>
                                            <Badge variant="secondary">{item.category?.name}</Badge>
                                        </CardAction>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                                    </CardContent>
                                </div>
                                <CardFooter className="mt-auto">
                                    <Button className="w-full" disabled={item.available_quantity === 0} onClick={() => handleClick(item, true)}>
                                        Borrow Item
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-gray-400">
                        <HistoryIcon size={32} />
                        <p className="text-md font-medium lg:text-xl">No Items Found</p>
                    </div>
                </>
            )}

            {borrowModal.item && (
                <BorrowModal users={users} item={borrowModal.item} isOpen={borrowModal.isOpen} onClose={() => handleClick(borrowModal.item!, false)} />
            )}
        </>
    );
}
