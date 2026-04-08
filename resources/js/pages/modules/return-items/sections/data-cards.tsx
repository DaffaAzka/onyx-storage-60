import { Actions, Borrowing } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useState } from 'react';
import DetailModal from '../../borrowings/sections/action-modal';
import ReturnedModal from './returned-modal';

export default function DataCards({ borrowings, role }: { borrowings: Borrowing[]; role: string }) {
    const [returnedModal, setReturnedModal] = useState<{
        borrowing: Borrowing | null;
        isOpen: boolean;
        status: String | null;
        action: 'return' | 'approve';
    }>({
        borrowing: null,
        isOpen: false,
        status: null,
        action: 'return',
    });

    console.log(role);

    const [detailModal, setDetailModal] = useState<{
        borrowing: Borrowing | null;
        isOpen: boolean;
    }>({ borrowing: null, isOpen: false });

    function handleCloseModal() {
        setReturnedModal({
            borrowing: null,
            isOpen: false,
            status: null,
            action: 'return',
        });

        setDetailModal({
            borrowing: null,
            isOpen: false,
        });
    }

    function handleOpenModal(borrowing: Borrowing, action: 'return' | 'approve') {
        setReturnedModal({
            borrowing: borrowing,
            isOpen: true,
            status: 'returned',
            action: action,
        });
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {borrowings.map((borrowing) => (
                    <Card key={borrowing.id} className="relative mx-auto flex w-full flex-col pt-0">
                        <img
                            src={borrowing.image_url || borrowing.item?.image_url || ''}
                            alt="Event cover"
                            className="relative z-20 aspect-video w-full rounded-tl-xl rounded-tr-xl object-cover brightness-80 dark:brightness-80"
                        />

                        <div className="">
                            <CardHeader className="borrowings-center flex justify-between pb-3">
                                <CardTitle className="text-lg">{borrowing.item?.name}</CardTitle>
                                <CardAction>
                                    <Badge variant="secondary">{borrowing.item?.category?.name}</Badge>
                                </CardAction>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <CardDescription className="line-clamp-2">{borrowing.item?.description}</CardDescription>
                            </CardContent>
                        </div>
                        <CardFooter className="mt-auto flex gap-2">
                            {borrowing.return_item?.id ? (
                                <>
                                    <Button
                                        className="flex-1"
                                        onClick={() => {
                                            handleOpenModal(borrowing, 'approve');
                                        }}
                                        variant={role === 'user' ? 'default' : 'outline'}
                                        disabled={role === 'user' ? true : false}
                                    >
                                        {role === 'user' ? 'Waiting approval' : 'Approve'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        className="flex-1"
                                        onClick={() => {
                                            handleOpenModal(borrowing, 'return');
                                        }}
                                    >
                                        Returned
                                    </Button>
                                </>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => {
                                    setDetailModal({
                                        borrowing: borrowing,
                                        isOpen: true,
                                    });
                                }}
                            >
                                <Info />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {returnedModal.isOpen == true && returnedModal.borrowing != null && (
                <ReturnedModal
                    action={returnedModal.action}
                    borrowing={returnedModal.borrowing}
                    isOpen={returnedModal.isOpen}
                    onClose={handleCloseModal}
                />
            )}

            {detailModal.isOpen == true && detailModal.borrowing != null && (
                <DetailModal action={Actions.DETAIL} borrowing={detailModal.borrowing} isOpen={detailModal.isOpen} onClose={handleCloseModal} />
            )}
        </>
    );
}
