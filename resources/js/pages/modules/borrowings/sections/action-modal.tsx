import { Actions, Borrowing } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import TextareaForm from '@/components/textarea-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldDescription } from '@/components/ui/field';
import { printUserNameSoftDelete } from '@/lib/component-helpers';
import { formatDate, getStatusLabel } from '@/lib/helpers';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Box, Calendar, FileText, Package, User } from 'lucide-react';
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
    borrowing,
    action,
    isOpen,
    onClose,
}: {
    borrowing: Borrowing;
    action: Actions;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { errors: pageErrors } = usePage().props;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [values, setValues] = useState<{
        item_id: number | null;
        borrow_date: string;
        planned_return_date: string;
        quantity: number;
        notes: string;
    }>({
        item_id: 0,
        borrow_date: '',
        planned_return_date: '',
        quantity: 1,
        notes: '',
    });

    const [title, setTitle] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (borrowing) {
            setValues((values) => ({
                ...values,
                item_id: borrowing.item_id,
                borrow_date: borrowing.borrow_date,
                planned_return_date: borrowing.planned_return_date,
                quantity: borrowing.quantity,
                notes: borrowing.notes || '',
            }));
        }
    }, [borrowing.id]);

    useEffect(() => {
        setDisabled(action === Actions.DETAIL || action === Actions.DELETE);

        switch (action) {
            case Actions.DETAIL:
                setTitle('Detail borrowing');
                break;
            case Actions.DELETE:
                setTitle('Delete borrowing');
                break;
            case Actions.UPDATE:
                if (borrowing.status !== 'rejected') {
                    setTitle('Update borrowing');
                } else {
                    setTitle('Resubmit Borrowing');
                }
                break;
            default:
                break;
        }
    }, [action]);

    function handleChange(e: { target: { name: string; value: string } }) {
        const { name, value } = e.target;

        if (name === 'quantity') {
            const newQuantity = Number(value);

            if (newQuantity < 1 || newQuantity > borrowing.item!.available_quantity) {
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

    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        switch (action) {
            case Actions.DELETE:
                router.delete(`/borrowings/${borrowing.id}`, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['borrowings'],
                    onSuccess: () => {
                        setValues({
                            item_id: 0,
                            borrow_date: '',
                            planned_return_date: '',
                            quantity: 1,
                            notes: '',
                        });
                        onClose();
                        toast.success('Borrowing deleted successfully!');
                    },
                    onError(e) {
                        setErrors(e);
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                });
                break;
            case Actions.UPDATE:
                router.patch(`/borrowings/${borrowing.id}`, values, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['borrowings'],
                    onSuccess: () => {
                        setValues({
                            item_id: 0,
                            borrow_date: '',
                            planned_return_date: '',
                            quantity: 1,
                            notes: '',
                        });
                        onClose();
                        toast.success('Borrowing updated successfully!');
                    },
                    onError(e) {
                        setErrors(e);
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                });
                break;

            default:
                setLoading(false);
                break;
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {action === Actions.DETAIL ? (
                <>
                    <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-xl xl:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg">Borrowing Detail</DialogTitle>
                            <DialogDescription className="text-sm">Detail information about this borrowing</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900">Item Details</h3>
                                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                    <div className="overflow-hidden rounded-md bg-white">
                                        <img src={borrowing?.item?.image_url ?? ''} alt="Item Preview" className="h-40 w-full object-contain" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-gray-500">Item Name</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{borrowing?.item?.name ?? 'N/A'}</p>
                                    </div>

                                    {borrowing?.item?.description && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Description</p>
                                            <p className="mt-1 text-sm text-gray-700">{borrowing.item.description}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">{borrowing.code ? 'Borrowing Code' : 'Item Code'}</p>
                                            <p className="mt-1 font-mono text-sm text-gray-700">{borrowing.code ?? borrowing?.item?.code ?? 'N/A'}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Item Condition</p>
                                            <div className="mt-1">
                                                <Badge className={statusConfig[borrowing?.item?.status || 'fair']?.color}>
                                                    {getStatusLabel(borrowing?.item?.status || 'fair')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(borrowing?.approved_by || borrowing?.approved_at) && (
                                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Approval Info</p>

                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Approved By</p>
                                                    {printUserNameSoftDelete({
                                                        className: 'text-sm text-gray-700',
                                                        user: borrowing?.approver,
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Approved At</p>
                                                    <p className="text-sm text-gray-700">
                                                        {borrowing?.approved_at ? formatDate(borrowing.approved_at) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900">Borrowing Details</h3>

                                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                    {borrowing.image_url && (
                                        <div className="overflow-hidden rounded-md bg-white">
                                            <img src={borrowing?.image_url ?? ''} alt="Borrowing Preview" className="h-40 w-full object-contain" />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Quantity</p>
                                                <p className="text-sm text-gray-700">{borrowing?.quantity ?? 0} item(s)</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Borrower</p>
                                                {printUserNameSoftDelete({
                                                    className: 'text-sm text-gray-700',
                                                    user: borrowing?.borrower,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Borrow Date</p>
                                                <p className="text-sm text-gray-700">
                                                    {borrowing?.borrow_date ? formatDate(borrowing.borrow_date) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Planned Return</p>
                                                <p className="text-sm text-gray-700">
                                                    {borrowing?.planned_return_date ? formatDate(borrowing.planned_return_date) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {borrowing?.actual_return_date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Actual Return</p>
                                                <p className="text-sm text-gray-700">{formatDate(borrowing.actual_return_date)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {(borrowing?.uploader || borrowing?.upload_at) && (
                                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Evidencded Info</p>

                                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Upload By</p>
                                                    {printUserNameSoftDelete({
                                                        className: 'text-sm text-gray-700',
                                                        user: borrowing?.uploader,
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">Upload At</p>
                                                    <p className="text-sm text-gray-700">
                                                        {borrowing?.upload_at ? formatDate(borrowing.upload_at) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {borrowing?.status === 'rejected' && borrowing?.rejection_reason && (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <p className="text-xs font-medium text-red-500">Rejection Reason</p>
                                        <p className="mt-1 text-sm text-red-700">{borrowing.rejection_reason}</p>
                                    </div>
                                )}

                                {borrowing?.notes && (
                                    <div className="rounded-md bg-gray-50 p-4">
                                        <div className="flex items-start gap-2">
                                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500">Notes</p>
                                                <p className="mt-1 text-sm text-gray-700">{borrowing.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" onClick={onClose} className="flex-1">
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </>
            ) : (
                <>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                            <div className="relative overflow-hidden rounded-lg">
                                <img src={borrowing.item?.image_url ?? ''} alt={borrowing.item?.name} className="aspect-video w-full object-cover" />
                            </div>

                            {borrowing.rejection_reason && borrowing.status === 'rejected' ? (
                                <>
                                    <Alert variant="destructive">
                                        <AlertTitle>Rejected Reason</AlertTitle>
                                        <AlertDescription>{borrowing.rejection_reason}</AlertDescription>
                                    </Alert>
                                </>
                            ) : (
                                <></>
                            )}

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{borrowing.item?.name}</h3>

                                        <div className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-50 px-4 py-2 sm:self-auto dark:bg-blue-900/20">
                                            <Box className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                {borrowing.item?.available_quantity} Available
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">{borrowing.item?.description}</p>
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
                                        isDisabled={disabled}
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
                                            isDisabled={disabled}
                                        />
                                        <InputForm
                                            name="planned_return_date"
                                            text="Planned Return Date"
                                            value={values.planned_return_date}
                                            error={errors.planned_return_date}
                                            type="date"
                                            usePlaceholder={false}
                                            handleChange={handleChange}
                                            isDisabled={disabled}
                                        />
                                    </div>

                                    <TextareaForm
                                        name="notes"
                                        text="Borrowing Notes"
                                        handleChange={handleChange}
                                        usePlaceholder={false}
                                        value={values.notes}
                                        error={errors.notes}
                                        isDisabled={disabled}
                                    />

                                    {errors.status && <FieldDescription className="text-xs text-red-500">{errors.status}</FieldDescription>}

                                    <LoadingButton
                                        text={borrowing.status !== 'rejected' ? 'Submit' : 'Resubmit'}
                                        type="submit"
                                        variant={action === Actions.DELETE ? 'destructive' : 'default'}
                                        loading={loading}
                                    />
                                </form>
                            </div>
                        </div>
                    </DialogContent>
                </>
            )}
        </Dialog>
    );
}
