import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import SelectForm from '@/components/select-form';
import TextareaForm from '@/components/textarea-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, SelectItems, User } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function BorrowModal({ item, users, isOpen, onClose }: { item: Item; isOpen: boolean; users: User[] | null; onClose: () => void }) {
    const { errors } = usePage().props;
    const [values, setValues] = useState({
        item_id: 0,
        borrow_date: '',
        planned_return_date: '',
        quantity: 1,
        notes: '',
        user_id: null,
    });

    const [loading, setLoading] = useState(false);
    const setSelectedItems: SelectItems[] | null = users
        ? users.map((e) => ({
              id: e.id,
              name: e.name,
          }))
        : null;

    useEffect(() => {
        if (item) {
            setValues((values) => ({
                ...values,
                item_id: item.id,
                borrow_date: '',
                planned_return_date: '',
                quantity: 1,
                notes: '',
                user_id: null,
            }));
        }
    }, [item.id]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        router.post(
            '/borrowings',
            {
                ...values,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['items'],
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    onClose();
                    setValues({
                        item_id: 0,
                        borrow_date: '',
                        planned_return_date: '',
                        quantity: 1,
                        notes: '',
                        user_id: null,
                    });
                    toast.success('Item borrowed successfully');
                },
            },
        );
    }

    function handleChange(e: { target: { name: string; value: string } }) {
        const { name, value } = e.target;

        if (name === 'quantity') {
            const newQuantity = Number(value);

            if (newQuantity < 1 || newQuantity > item.available_quantity) {
                return;
            }

            setValues((values) => ({
                ...values,
                quantity: newQuantity,
            }));
        } else {
            setValues((values) => ({
                ...values,
                [name]: value,
            }));
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Borrow Item</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <img src={item.image_url ?? ''} alt={item.name} className="aspect-video w-full object-cover" />
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.name}</h3>

                                    <div className="inline-flex min-w-34 items-center gap-2 self-start rounded-lg bg-blue-50 px-4 py-2 sm:self-auto dark:bg-blue-900/20">
                                        <Box className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                            {item.available_quantity} Available
                                        </span>
                                    </div>
                                </div>

                                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <InputForm
                                    name="quantity"
                                    text="Quantity"
                                    value={values.quantity.toString()}
                                    type="number"
                                    error={errors.quantity}
                                    usePlaceholder={false}
                                    handleChange={handleChange}
                                />

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <InputForm
                                        name="borrow_date"
                                        text="Borrow Date"
                                        value={values.borrow_date}
                                        type="date"
                                        error={errors.borrow_date}
                                        usePlaceholder={false}
                                        handleChange={handleChange}
                                    />
                                    <InputForm
                                        name="planned_return_date"
                                        text="Planned Return Date"
                                        value={values.planned_return_date}
                                        error={errors.planned_return_date}
                                        type="date"
                                        usePlaceholder={false}
                                        handleChange={handleChange}
                                    />
                                </div>

                                {setSelectedItems && (
                                    <SelectForm
                                        name="user_id"
                                        text="Select Borrower"
                                        handleChange={(value: string) => handleChange({ target: { name: 'user_id', value } } as any)}
                                        error={errors.user_id}
                                        value={values.user_id + ""}
                                        items={setSelectedItems}
                                    />
                                )}

                                <TextareaForm
                                    name="notes"
                                    text="Borrowing Notes"
                                    handleChange={handleChange}
                                    usePlaceholder={false}
                                    value={values.notes}
                                    error={errors.notes}
                                />

                                <LoadingButton text="Submit" type="submit" variant="default" loading={loading} />
                            </form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
