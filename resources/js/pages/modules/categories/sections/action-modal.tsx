import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import TextareaForm from '@/components/textarea-form';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Actions, Category } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ActionModal({
    category,
    isOpen,
    action,
    onClose,
}: {
    category: Category;
    isOpen: boolean;
    action: Actions;
    onClose: () => void;
}) {
    const { errors } = usePage().props;

    const [values, setValues] = useState({
        name: '',
        description: '',
    });

    const [disabled, setDisabled] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setValues({
                name: category.name,
                description: category.description,
            });
        }
    }, [category.id]);

    useEffect(() => {
        setDisabled(action === Actions.DETAIL || action === Actions.DELETE);

        switch (action) {
            case Actions.DETAIL:
                setTitle('Detail category');
                break;
            case Actions.DELETE:
                setTitle('Delete category');
                break;
            case Actions.UPDATE:
                setTitle('Update category');
                break;
            default:
                break;
        }
    }, [action]);

    function handleChange(e: { target: { name: string; value: string } }) {
        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        switch (action) {
            case Actions.DELETE:
                router.delete(`/categories/${category.id}`, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['categories'],
                    onSuccess: () => {
                        setValues({
                            name: '',
                            description: '',
                        });
                        onClose();
                        toast.success('Category deleted successfully!');
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                });
                break;

            case Actions.UPDATE:
                router.patch(`/categories/${category.id}`, values, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['categories'],
                    onSuccess: () => {
                        setValues({
                            name: '',
                            description: '',
                        });
                        onClose();
                        toast.success('Category updated successfully!');
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
                <DialogHeader className="flex flex-col gap-4">
                    <DialogTitle className="text-lg leading-none font-semibold">{title}</DialogTitle>
                    <form className="flex flex-col gap-4 overflow-hidden" onSubmit={handleSubmit}>
                        <InputForm
                            name="name"
                            text="Name Category"
                            type="text"
                            handleChange={handleChange}
                            error={errors.name}
                            usePlaceholder={true}
                            value={values.name}
                            isDisabled={disabled}
                        />
                        <TextareaForm
                            name="description"
                            text="Description Category"
                            handleChange={handleChange}
                            usePlaceholder={true}
                            value={values.description}
                            error={errors.description}
                            isDisabled={disabled}
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
