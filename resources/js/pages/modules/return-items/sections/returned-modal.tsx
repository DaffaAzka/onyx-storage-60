import LoadingButton from '@/components/button_loading';
import InputFileForm from '@/components/input-file-form';
import InputForm from '@/components/input-form';
import SelectForm from '@/components/select-form';
import SwitchInputForm from '@/components/switch-input-form';
import TextareaForm from '@/components/textarea-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { printUserNameSoftDelete } from '@/lib/component-helpers';
import { calculateFine, formatCurrency, formatDate, getStatusLabel } from '@/lib/helpers';
import { Borrowing, SelectItems } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const statusConfig: Record<string, { color: string; bgColor: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    approved: { color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    rejected: { color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
    borrowed: { color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    returned: { color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
};

export default function ReturnedModal({
    borrowing,
    action = 'return',
    isOpen,
    onClose,
}: {
    borrowing: Borrowing | null;
    action: 'return' | 'approve';
    isOpen: boolean;
    onClose: () => void;
}) {
    const { errors: pageErrors } = usePage().props;
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const [value, setValue] = useState<{
        borrowing: Borrowing | null;
        borrowing_id: string;
        return_date: string;
        condition: string;
        notes: string;
        fine_amount: number;
        fine_paid: boolean;
    }>({
        borrowing: null,
        borrowing_id: '',
        return_date: '',
        notes: '',
        condition: '',
        fine_amount: 0,
        fine_paid: false,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

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
        setErrors({});
        if (borrowing) {
            setValue({
                borrowing: borrowing,
                borrowing_id: borrowing.id.toString(),
                return_date: '',
                condition: borrowing.item?.status || '',
                fine_amount: 0,
                fine_paid: false,
                notes: '',
            });
        }
    }, [borrowing]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleRemoveImage() {
        setImageFile(null);
        setPreview('');
    }

    function handleChange(e: { target: { name: string; value: string } }) {
        const { name, value } = e.target;
        if (name == 'return_date') {
            setValue((values) => ({
                ...values,
                return_date: value,
                fine_amount: calculateFine({
                    planned_return_date: borrowing?.planned_return_date ?? '',
                    actual_return_date: value,
                }),
            }));
        } else {
            setValue((values) => ({
                ...values,
                [name]: value,
            }));
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        switch (action) {
            case 'return':
                router.post(
                    `/return-items`,
                    {
                        borrowing_id: value.borrowing_id,
                        return_date: value.return_date,
                        condition: value.condition,
                        fine_amount: value.fine_amount,
                        fine_paid: value.fine_paid,
                        notes: value.notes,
                        image_path: imageFile,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        only: ['borrowings', 'return_items'],
                        onFinish: () => setLoading(false),
                        onSuccess: () => {
                            toast.success('Successfully returned item');
                            onClose();
                        },
                        onError: (e) => {
                            setErrors(e);
                            toast.error('Error to return item');
                        },
                    },
                );
                break;

            case 'approve':
                router.post(
                    `/return-items/${borrowing?.return_item?.id}/verify`,
                    {
                        borrowing_id: value.borrowing_id,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        only: ['borrowings', 'return_items'],
                        onFinish: () => setLoading(false),
                        onSuccess: () => {
                            toast.success('Successfully approve returned item');
                            onClose();
                        },
                        onError: (e) => {
                            setErrors(e);
                            toast.error('Error to approve return item');
                        },
                    },
                );
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-xl xl:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg">{action === 'return' ? 'Confirm Returned Item' : 'Verifying Returned Item'}</DialogTitle>
                        <DialogDescription className="text-sm">Please review the details before confirming the return</DialogDescription>
                    </DialogHeader>

                    <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900">Borrowing Details</h3>
                            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                <div className="overflow-hidden rounded-md bg-white">
                                    <img
                                        src={value.borrowing?.image_url ?? value.borrowing?.item?.image_url ?? ''}
                                        alt="Item Preview"
                                        className="h-40 w-full object-contain"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Item Name</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">{value.borrowing?.item?.name ?? 'N/A'}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Item Condition</p>
                                    <div className="mt-1">
                                        <Badge className={statusConfig[value.borrowing?.item?.status || 'fair']?.color}>
                                            {getStatusLabel(value.borrowing?.item?.status || 'fair')}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Quantity Borrowed</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">{value.borrowing?.quantity ?? 0} item(s)</p>
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
                                                    user: value.borrowing?.borrower,
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Borrow Date</p>
                                                <p className="text-sm text-gray-700">
                                                    {value.borrowing?.borrow_date ? formatDate(value.borrowing?.borrow_date) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Planned Return</p>
                                                <p className="text-sm text-gray-700">
                                                    {value.borrowing?.planned_return_date ? formatDate(value.borrowing?.planned_return_date) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {action === 'return' ? (
                            <>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900">Return Details</h3>

                                    <SelectForm
                                        name="condition"
                                        text="Select Current Item Condition"
                                        handleChange={(value: string) => handleChange({ target: { name: 'condition', value } } as any)}
                                        value={value.condition}
                                        items={conditions}
                                    />

                                    <InputForm
                                        name={'return_date'}
                                        text={'Actual Return Date'}
                                        type={'date'}
                                        value={value.return_date}
                                        handleChange={handleChange}
                                    />

                                    {value.fine_amount > 0 && (
                                        <div className="space-y-3">
                                            <SwitchInputForm
                                                name={'fine_paid'}
                                                text={'Fine Paid'}
                                                value={value.fine_paid}
                                                handleChange={(checked: boolean) => {
                                                    setValue((values) => ({
                                                        ...values,
                                                        fine_paid: checked,
                                                    }));
                                                }}
                                            />

                                            <div className="rounded-md bg-red-50 p-4">
                                                <p className="mt-1 text-sm text-red-700">
                                                    This item is returned late. The fine amount is {formatCurrency(value.fine_amount ?? 0)}.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <InputFileForm
                                        name="image_path"
                                        text="Upload Evidence"
                                        handleChange={handleFileChange}
                                        error={errors.image_path}
                                        usePlaceholder={false}
                                        accept="image/*"
                                        preview={preview}
                                        onRemoveImage={handleRemoveImage}
                                    />

                                    <TextareaForm
                                        name="notes"
                                        text="Return Notes"
                                        handleChange={handleChange}
                                        usePlaceholder={false}
                                        value={value.notes}
                                        error={errors.notes}
                                    />

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" onClick={onClose} className="flex-1">
                                            Cancel
                                        </Button>
                                        <div className="flex-1">
                                            <LoadingButton text="Confirm Return" loading={loading} type="submit"></LoadingButton>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900">Return Details</h3>

                                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                        <div className="overflow-hidden rounded-md bg-white">
                                            <img
                                                src={value.borrowing?.return_item?.image_url ?? value.borrowing?.item?.image_url ?? ''}
                                                alt="Item Preview"
                                                className="h-40 w-full object-contain"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Return Date</p>
                                                <p className="text-sm text-gray-700">
                                                    {borrowing?.return_item?.return_date ? formatDate(borrowing?.return_item.return_date) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Condition on Return</p>
                                                <div className="mt-1">
                                                    <Badge className={statusConfig[borrowing?.return_item?.condition || 'fair']?.color}>
                                                        {getStatusLabel(borrowing?.return_item?.condition || 'fair')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Received By</p>
                                                {printUserNameSoftDelete({
                                                    className: 'text-sm text-gray-700',
                                                    user: borrowing?.return_item?.received,
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Fine Amount</p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {borrowing?.return_item?.fine_amount && borrowing?.return_item.fine_amount > 0
                                                        ? formatCurrency(borrowing?.return_item.fine_amount)
                                                        : 'No fine'}
                                                </p>
                                            </div>
                                        </div>

                                        {borrowing?.return_item?.fine_amount != null && Number(borrowing?.return_item?.fine_amount) > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Fine Status</p>
                                                    <div className="mt-1">
                                                        <Badge
                                                            className={
                                                                borrowing?.return_item.fine_paid
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }
                                                        >
                                                            {borrowing?.return_item.fine_paid ? 'Paid' : 'Unpaid'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {borrowing?.return_item?.fine_amount != null && Number(borrowing?.return_item?.fine_amount) > 0 && (
                                        <div className={`rounded-md p-4 ${borrowing?.return_item.fine_paid ? 'bg-green-50' : 'bg-red-50'}`}>
                                            <p className={`mt-1 text-sm ${borrowing?.return_item.fine_paid ? 'text-green-700' : 'text-red-700'}`}>
                                                {borrowing?.return_item.fine_paid
                                                    ? `Fine of ${formatCurrency(borrowing?.return_item?.fine_amount ?? 0)} has been paid.`
                                                    : `This item was returned late. The fine amount is ${formatCurrency(borrowing?.return_item?.fine_amount ?? 0)}.`}
                                            </p>
                                        </div>
                                    )}

                                    {borrowing?.return_item?.notes && (
                                        <div className="rounded-md bg-gray-50 p-4">
                                            <p className="text-xs font-medium text-gray-500">Notes</p>
                                            <p className="mt-1 text-sm text-gray-700">{borrowing?.return_item?.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" onClick={onClose} className="flex-1">
                                            Cancel
                                        </Button>
                                        <div className="flex-1">
                                            <LoadingButton text="Approve Return" loading={loading} type="submit"></LoadingButton>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
