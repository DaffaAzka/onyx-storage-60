import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import LoadingButton from '@/components/button_loading';
import InputFileForm from '@/components/input-file-form';
import InputForm from '@/components/input-form';
import SelectForm from '@/components/select-form';
import TextareaForm from '@/components/textarea-form';
import { Button } from '@/components/ui/button';
import { SelectItems } from '@/lib/types';

export default function CreateModal({ categories }: { categories: SelectItems[] }) {
    const { errors } = usePage().props;
    const [open, setOpen] = useState(false);

    const [values, setValues] = useState({
        name: '',
        description: '',
        category_id: '',
        code: '',
        status: '',
        quantity: 0,
        available_quantity: 0,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
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

    function handleChange(e: { target: { name: string; value: string } }) {
        const { name, value } = e.target;

        if (name === 'quantity') {
            const newQuantity = Number(value);
            setValues((values) => ({
                ...values,
                quantity: newQuantity,
                available_quantity: newQuantity,
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
        setPreview('');
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, String((values as any)[key]));
        });
        if (imageFile) {
            formData.append('image_path', imageFile);
        }

        router.post('/items', formData, {
            preserveState: true,
            preserveScroll: true,
            only: ['items'],
            onSuccess: () => {
                setValues({
                    name: '',
                    description: '',
                    category_id: '',
                    code: '',
                    status: '',
                    quantity: 0,
                    available_quantity: 0,
                });
                setImageFile(null);
                setPreview('');
                setOpen(false);
                toast.success('Item created successfully!');
            },
            onFinish: () => {
                setLoading(false);
            },
            onError: () => {
                toast.error('Failed to create item. Please check the form for errors.');
                console.log(errors);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-lg">
                <DialogHeader className="flex flex-col gap-4">
                    <DialogTitle>Create new item</DialogTitle>
                    <form className="flex flex-col gap-4 overflow-hidden" onSubmit={handleSubmit}>
                        <InputForm
                            name="code"
                            text="Code Item"
                            type="text"
                            handleChange={handleChange}
                            error={errors.code}
                            usePlaceholder={true}
                            value={values.code}
                        />

                        <InputForm
                            name="name"
                            text="Name Item"
                            type="text"
                            handleChange={handleChange}
                            error={errors.name}
                            usePlaceholder={true}
                            value={values.name}
                        />
                        <TextareaForm
                            name="description"
                            text="Description Item"
                            handleChange={handleChange}
                            usePlaceholder={true}
                            value={values.description}
                            error={errors.description}
                        />

                        <SelectForm
                            name="category_id"
                            text="Select Category"
                            handleChange={(value: string) => handleChange({ target: { name: 'category_id', value } } as any)}
                            error={errors.category_id}
                            usePlaceholder={true}
                            value={values.category_id}
                            items={categories}
                        />

                        <SelectForm
                            name="status"
                            text="Select Condition"
                            handleChange={(value: string) => handleChange({ target: { name: 'status', value } } as any)}
                            error={errors.status}
                            usePlaceholder={true}
                            value={values.status}
                            items={conditions}
                        />

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <InputForm
                                name="quantity"
                                text="Quantity Item"
                                type="number"
                                handleChange={handleChange}
                                error={errors.quantity}
                                usePlaceholder={false}
                                value={values.quantity.toString()}
                            />
                            <InputForm
                                name="available_quantity"
                                text="Available Quantity Item"
                                type="number"
                                handleChange={handleChange}
                                error={errors.available_quantity}
                                usePlaceholder={false}
                                isDisabled={true}
                                value={values.quantity.toString()}
                            />
                        </div>
                        <InputFileForm
                            name="image_path"
                            text="Upload Image"
                            handleChange={handleFileChange}
                            error={errors.image_path}
                            usePlaceholder={false}
                            accept="image/*"
                            preview={preview}
                            onRemoveImage={handleRemoveImage}
                        />
                        <LoadingButton text="Submit" type="submit" loading={loading} />
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
