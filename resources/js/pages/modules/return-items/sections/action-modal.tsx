import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import SelectForm from '@/components/select-form';
import SwitchInputForm from '@/components/switch-input-form';
import TextareaForm from '@/components/textarea-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { printUserNameSoftDelete } from '@/lib/component-helpers';
import { calculateFine, formatCurrency, formatDate, getStatusLabel } from '@/lib/helpers';
import { Actions, Borrowing, ReturnItem, SelectItems } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { Calendar, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const statusConfig: Record<string, { color: string; bgColor: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    approved: { color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    rejected: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
    borrowed: { color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    returned: { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    good: { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    fair: { color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    damaged: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
};

export default function ActionModal({
    returnItem,
    action,
    isOpen,
    onClose,
}: {
    returnItem: ReturnItem | null;
    action: Actions;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { errors: pageErrors } = usePage().props;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState<{
        returnItem: ReturnItem | null;
        borrowing: Borrowing | null;
        return_item_id: number | null;
        return_date: string | undefined;
        condition: string | undefined;
        notes: string | undefined;
        fine_amount: number;
        fine_paid: boolean;
    }>({
        returnItem: null,
        borrowing: null,
        return_item_id: null,
        return_date: '',
        notes: '',
        condition: '',
        fine_amount: 0,
        fine_paid: false,
    });

    const conditions: SelectItems[] = [
        {
            id: 'good',
            name: 'Good',
        },
        {
            id: 'fair',
            name: 'Fair',
        },
        {
            id: 'damaged',
            name: 'Damaged',
        },
    ];

    useEffect(() => {
        if (returnItem) {
            setValues({
                returnItem: returnItem,
                borrowing: returnItem.borrowing ?? null,
                return_item_id: returnItem.id ?? null,
                return_date: returnItem.return_date ?? '',
                notes: returnItem.notes ?? '',
                condition: returnItem.condition,
                fine_amount: returnItem.fine_amount ?? 0,
                fine_paid: returnItem.fine_paid,
            });
        }
    }, [returnItem]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        if (name == 'return_date') {
            setValues((values) => ({
                ...values,
                return_date: value,
                fine_amount: calculateFine({
                    planned_return_date: values.borrowing?.planned_return_date ?? '',
                    actual_return_date: value,
                }),
            }));
        } else {
            setValues((values) => ({
                ...values,
                [name]: value,
            }));
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        router.patch(`/return-items/${returnItem?.id}`, values, {
            preserveScroll: true,
            preserveState: true,
            only: ['return_items'],
            onSuccess: () => {
                toast.success('Return item updated successfully');
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to update return item');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-xl xl:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Return Item Detail</DialogTitle>
                        <DialogDescription className="text-sm">Detail information about the returned item</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900">Borrowing Details</h3>
                            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                <div className="overflow-hidden rounded-md bg-white">
                                    <img src={values.borrowing?.item?.image_url ?? ''} alt="Item Preview" className="h-40 w-full object-contain" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Item Name</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">{values.borrowing?.item?.name ?? 'N/A'}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Quantity Borrowed</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">{values.borrowing?.quantity ?? 0} item(s)</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Item Code</p>
                                        <p className="mt-1 font-mono text-sm text-gray-700">{values.borrowing?.item?.code ?? 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Item Condition</p>
                                        <div className="mt-1">
                                            <Badge className={statusConfig[values.borrowing?.item?.status || 'fair']?.color}>
                                                {getStatusLabel(values.borrowing?.item?.status || 'fair')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">More Informations</p>
                                    <div className="mt-1 space-y-3 rounded-md bg-gray-100 p-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Borrower</p>
                                                {printUserNameSoftDelete({
                                                    className: 'text-sm text-gray-700',
                                                    user: values.borrowing?.borrower,
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Borrow Date</p>
                                                    <p className="text-sm text-gray-700">
                                                        {values.borrowing?.borrow_date ? formatDate(values.borrowing?.borrow_date) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Planned Return</p>
                                                    <p className="text-sm text-gray-700">
                                                        {values.borrowing?.planned_return_date
                                                            ? formatDate(values.borrowing?.planned_return_date)
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {action === Actions.DETAIL && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900">Return Details</h3>
                                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                    {values.returnItem?.image_url && (
                                        <div className="overflow-hidden rounded-md bg-white">
                                            <img src={values.returnItem?.image_url ?? ''} alt="Item Preview" className="h-40 w-full object-contain" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500">Return Date</p>
                                            <p className="text-sm text-gray-700">
                                                {values.returnItem?.return_date ? formatDate(values.returnItem.return_date) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Return Condition</p>
                                                <div className="mt-1">
                                                    <Badge className={statusConfig[values.returnItem?.condition || 'fair']?.color}>
                                                        {getStatusLabel(values.returnItem?.condition || 'fair')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Received By</p>
                                                {printUserNameSoftDelete({
                                                    className: 'text-sm text-gray-700',
                                                    user: values.returnItem?.received,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {values.fine_amount > 0 && (
                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Fine Amount</p>
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {values.returnItem?.fine_amount != null && Number(values.returnItem.fine_amount) > 0
                                                            ? formatCurrency(values.returnItem.fine_amount)
                                                            : 'No fine'}
                                                    </p>
                                                </div>
                                            </div>
                                            {values.returnItem?.fine_amount != null && Number(values.returnItem.fine_amount) > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-gray-500">Fine Status</p>
                                                        <div className="mt-1">
                                                            <Badge
                                                                className={
                                                                    values.returnItem.fine_paid
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }
                                                            >
                                                                {values.returnItem.fine_paid ? 'Paid' : 'Unpaid'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {values.returnItem?.fine_amount != null && Number(values.returnItem.fine_amount) > 0 && (
                                    <div className={`rounded-md p-4 ${values.returnItem.fine_paid ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <p className={`mt-1 text-sm ${values.returnItem.fine_paid ? 'text-green-700' : 'text-red-700'}`}>
                                            {values.returnItem.fine_paid
                                                ? `Fine of ${formatCurrency(values.returnItem.fine_amount)} has been paid.`
                                                : `This item was returned late. The fine amount is ${formatCurrency(values.returnItem.fine_amount)}.`}
                                        </p>
                                    </div>
                                )}

                                {(values.returnItem?.uploader || values.returnItem?.upload_at) && (
                                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Evidencded Info</p>

                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Upload By</p>
                                                    {printUserNameSoftDelete({
                                                        className: 'text-sm text-gray-700',
                                                        user: values.returnItem?.uploader,
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Upload At</p>
                                                    <p className="text-sm text-gray-700">
                                                        {values.returnItem?.upload_at ? formatDate(values.returnItem.upload_at) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {values.notes && (
                                    <div className="rounded-md bg-gray-50 p-4">
                                        <p className="text-xs font-medium text-gray-500">Notes</p>
                                        <p className="mt-1 text-sm text-gray-700">{values.notes}</p>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" onClick={onClose} className="flex-1">
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}

                        {action === Actions.UPDATE && (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900">Return Details</h3>

                                {values.returnItem?.image_url && (
                                    <div className="overflow-hidden rounded-md bg-white">
                                        <img src={values.returnItem?.image_url ?? ''} alt="Item Preview" className="h-40 w-full object-contain" />
                                    </div>
                                )}

                                <SelectForm
                                    name="condition"
                                    text="Select Current Item Condition"
                                    handleChange={(values: string) => handleChange({ target: { name: 'condition', values } } as any)}
                                    value={values.condition}
                                    items={conditions}
                                    isDisabled={true}
                                />

                                <InputForm
                                    name={'return_date'}
                                    text={'Actual Return Date'}
                                    type={'date'}
                                    value={values.return_date}
                                    handleChange={handleChange}
                                    isDisabled={false}
                                />

                                {values.fine_amount > 0 && (
                                    <div className="space-y-3">
                                        <SwitchInputForm
                                            name={'fine_paid'}
                                            text={'Fine Paid'}
                                            value={values.fine_paid}
                                            handleChange={(checked: boolean) => {
                                                setValues((valuess) => ({
                                                    ...valuess,
                                                    fine_paid: checked,
                                                }));
                                            }}
                                        />

                                        <div className="rounded-md bg-red-50 p-4">
                                            <p className="mt-1 text-sm text-red-700">
                                                This item is returned late. The fine amount is {formatCurrency(values.fine_amount ?? 0)}.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <TextareaForm
                                    name="notes"
                                    text="Return Notes"
                                    handleChange={(e) => {
                                        setValues((prev) => ({ ...prev, notes: e.target.value }));
                                    }}
                                    usePlaceholder={false}
                                    value={values.notes}
                                    error={errors.notes}
                                />

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" onClick={onClose} className="flex-1">
                                        Cancel
                                    </Button>
                                    <div className="flex-1">
                                        <LoadingButton text="Update Return" loading={loading} type="submit"></LoadingButton>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
