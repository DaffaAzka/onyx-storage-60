import LoadingButton from '@/components/button_loading';
import InputFileForm from '@/components/input-file-form';
import InputForm from '@/components/input-form';
import InputNumberForm from '@/components/input-number-form';
import SelectForm from '@/components/select-form';
import TextareaForm from '@/components/textarea-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Actions, Item, SelectItems } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ActionModal({
    item,
    categories,
    isOpen,
    action,
    onClose,
}: {
    item: Item;
    categories: SelectItems[];
    isOpen: boolean;
    action: Actions;
    onClose: () => void;
}) {
    const { errors: pageErrors } = usePage().props;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [values, setValues] = useState<{
        name: string;
        description: string;
        category_id: number | null;
        code: string;
        status: string;
        quantity: number;
        available_quantity: number;
    }>({
        name: '',
        description: '',
        category_id: 0,
        code: '',
        status: '',
        quantity: 0,
        available_quantity: 0,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [disabled, setDisabled] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [usedQuantity, setUsedQuantity] = useState(0);

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
        if (item) {
            setValues({
                name: item.name,
                description: item.description ?? '',
                category_id: item.category_id,
                code: item.code,
                status: item.status,
                quantity: item.quantity,
                available_quantity: item.available_quantity,
            });
            setUsedQuantity(item.quantity - item.available_quantity);
            setPreview(item.image_url ?? '');
            setImageFile(null);
        }
    }, [item.id]);

    useEffect(() => {
        setDisabled(action === Actions.DETAIL || action === Actions.DELETE);

        switch (action) {
            case Actions.DETAIL:
                setTitle('Detail item');
                break;
            case Actions.DELETE:
                setTitle('Delete item');

                break;
            case Actions.UPDATE:
                setTitle('Update item');

                break;
            default:
                break;
        }
    }, [action]);

    function handleChange(e: { target: { name: string; value: string } }) {
        const { name, value } = e.target;

        if (name === 'quantity') {
            const newQuantity = Number(value);

            if (newQuantity < usedQuantity) {
                toast.error(`Quantity cannot be less than ${usedQuantity} (used quantity)`);
                return;
            }

            setValues((values) => ({
                ...values,
                quantity: newQuantity,
                available_quantity: newQuantity - usedQuantity,
            }));
        } else {
            setValues((values) => ({
                ...values,
                [name]: value,
            }));
        }
    }

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
        setPreview(item.image_url ?? '');
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        switch (action) {
            case Actions.DELETE:
                router.delete(`/items/${item.id}`, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['items'],
                    onSuccess: () => {
                        setValues({
                            name: '',
                            description: '',
                            category_id: 0,
                            code: '',
                            status: '',
                            quantity: 0,
                            available_quantity: 0,
                        });
                        setImageFile(null);
                        setPreview('');
                        onClose();
                        toast.success('Item deleted successfully!');
                    },
                    onError: (e) => {
                        setErrors(e);
                        toast.success('Error to delete item!');
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                });
                break;

            case Actions.UPDATE:
                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                    formData.append(key, String((values as any)[key]));
                });
                if (imageFile) {
                    formData.append('image_path', imageFile);
                }

                router.patch(`/items/${item.id}`, formData, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['items'],
                    onSuccess: () => {
                        setValues({
                            name: '',
                            description: '',
                            category_id: 0,
                            code: '',
                            status: '',
                            quantity: 0,
                            available_quantity: 0,
                        });
                        setImageFile(null);
                        setPreview('');
                        onClose();
                        toast.success('Item updated successfully!');
                    },
                    onError: (e) => {
                        setErrors(e);
                        toast.success('Error to update item!');
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
            <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-lg">
                <DialogHeader className="flex flex-col gap-5">
                    <DialogTitle className="text-lg leading-none font-semibold">{title}</DialogTitle>
                    {errors.message && (
                        <Alert variant="destructive" className="bg-red-100">
                            <AlertDescription>{errors.message}</AlertDescription>
                        </Alert>
                    )}
                    <form className="flex flex-col gap-5 overflow-hidden" onSubmit={handleSubmit}>
                        <InputForm
                            name="code"
                            text="Code Item"
                            type="text"
                            handleChange={handleChange}
                            error={errors.code}
                            usePlaceholder={true}
                            value={values.code}
                            isDisabled={disabled}
                        />

                        <InputForm
                            name="name"
                            text="Name Item"
                            type="text"
                            handleChange={handleChange}
                            error={errors.name}
                            usePlaceholder={true}
                            value={values.name}
                            isDisabled={disabled}
                        />
                        <TextareaForm
                            name="description"
                            text="Description Item"
                            handleChange={handleChange}
                            usePlaceholder={true}
                            value={values.description}
                            error={errors.description}
                            isDisabled={disabled}
                        />

                        <SelectForm
                            name="category_id"
                            text="Select Category"
                            handleChange={(value: string) => handleChange({ target: { name: 'category_id', value } } as any)}
                            error={errors.category_id}
                            usePlaceholder={true}
                            isDisabled={disabled}
                            value={values.category_id?.toString()}
                            items={categories}
                        />

                        <SelectForm
                            name="status"
                            text="Select Condition"
                            handleChange={(value: string) => handleChange({ target: { name: 'status', value } } as any)}
                            error={errors.status}
                            usePlaceholder={true}
                            value={values.status}
                            isDisabled={disabled}
                            items={conditions}
                        />

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <InputNumberForm
                                name="quantity"
                                text="Quantity Item"
                                handleChange={handleChange}
                                error={errors.quantity}
                                usePlaceholder={false}
                                value={values.quantity.toString()}
                                min={values.quantity - values.available_quantity}
                                isDisabled={disabled}
                            />
                            <InputNumberForm
                                name="available_quantity"
                                text="Available Quantity Item"
                                handleChange={handleChange}
                                error={errors.available_quantity}
                                usePlaceholder={false}
                                value={values.available_quantity.toString()}
                                isDisabled={true}
                            />
                        </div>

                        <InputFileForm
                            name="image_path"
                            text="Upload Image"
                            handleChange={handleFileChange}
                            error={errors.image_path}
                            usePlaceholder={false}
                            isDisabled={disabled}
                            accept="image/*"
                            preview={preview}
                            existingImage={!imageFile ? (item.image_url ?? undefined) : undefined}
                            onRemoveImage={handleRemoveImage}
                        />

                        {(action === Actions.UPDATE || action === Actions.DELETE) && (
                            <LoadingButton
                                text="Submit"
                                type="submit"
                                variant={action === Actions.DELETE ? 'destructive' : 'default'}
                                loading={loading}
                            />
                        )}
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
