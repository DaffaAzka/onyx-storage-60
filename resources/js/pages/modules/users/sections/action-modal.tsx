import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import SelectForm from '@/components/select-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Actions, SelectItems, User } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ActionModal({
    user,
    roles,
    isOpen,
    action,
    onClose,
}: {
    user: User;
    roles: SelectItems[];
    isOpen: boolean;
    action: Actions;
    onClose: () => void;
}) {
    const { errors: pageErrors } = usePage().props;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        retry_password: '',
        phone_number: '',
        is_active: 1,
        role: null,
    } as {
        name: string;
        email: string;
        password: string;
        retry_password: string;
        phone_number: string;
        is_active: number | boolean;
        role: string | null;
    });

    const [disabled, setDisabled] = useState(false);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setErrors({});
        if (user) {
            setValues({
                name: user.name,
                email: user.email,
                password: '',
                retry_password: '',
                phone_number: user.phone_number ?? '',
                is_active: user.is_active,
                role: user.role,
            });
        }
    }, [user.id]);

    useEffect(() => {
        setDisabled(action === Actions.DETAIL || action === Actions.DELETE);

        switch (action) {
            case Actions.DETAIL:
                setTitle('Detail user');
                break;
            case Actions.DELETE:
                setTitle('Delete user');
                break;
            case Actions.UPDATE:
                setTitle('Update user');
                break;
            default:
                break;
        }
    }, [action]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        switch (action) {
            case Actions.UPDATE:
                router.patch(`/users/${user.id}`, values, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['users'],
                    onSuccess: () => {
                        toast.success('User created successfully');
                        onClose();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        toast.error('Failed to create user');
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                });
                break;

            case Actions.DELETE:
                router.delete(`/users/${user.id}`, {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['users'],
                    onSuccess: () => {
                        toast.success('User created successfully');
                        onClose();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        toast.error('Failed to create user');
                    },
                    onFinish: () => {
                        setLoading(false);
                    },
                });
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-lg">
                    <DialogHeader className="flex flex-col gap-4">
                        <DialogTitle>{title}</DialogTitle>
                        {errors.message && (
                            <Alert variant="destructive" className="bg-red-100">
                                <AlertDescription>{errors.message}</AlertDescription>
                            </Alert>
                        )}
                        <form className="flex flex-col gap-4 overflow-hidden" onSubmit={handleSubmit}>
                            <InputForm
                                name="name"
                                text="Name"
                                type="text"
                                handleChange={handleChange}
                                error={errors.name}
                                usePlaceholder={true}
                                value={values.name}
                                isDisabled={disabled}
                            />
                            <InputForm
                                name="email"
                                text="Email"
                                type="email"
                                handleChange={handleChange}
                                error={errors.email}
                                usePlaceholder={true}
                                value={values.email}
                                isDisabled={disabled}
                            />
                            <SelectForm
                                name="role"
                                text="Select Role"
                                handleChange={(value: string) => {
                                    setValues((prev) => ({ ...prev, role: value }));
                                }}
                                error={errors.role}
                                usePlaceholder={true}
                                value={values.role}
                                isDisabled={disabled}
                                items={roles}
                            />
                            {action === Actions.UPDATE && (
                                <>
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <InputForm
                                            name="password"
                                            text="Password"
                                            type="password"
                                            handleChange={handleChange}
                                            error={errors.password}
                                            usePlaceholder={true}
                                            isDisabled={disabled}
                                            value={values.password}
                                        />

                                        <InputForm
                                            name="retry_password"
                                            text="Retry Password"
                                            type="password"
                                            handleChange={handleChange}
                                            error={errors.retry_password}
                                            usePlaceholder={true}
                                            isDisabled={disabled}
                                            value={values.retry_password}
                                        />
                                    </div>
                                </>
                            )}
                            <InputForm
                                name="phone_number"
                                text="Phone Number (Optional)"
                                type="text"
                                handleChange={handleChange}
                                error={errors.phone_number}
                                isDisabled={disabled}
                                usePlaceholder={true}
                                value={values.phone_number}
                            />
                            {(action === Actions.UPDATE || action === Actions.DELETE) && (
                                <LoadingButton
                                    text="Submit"
                                    type="submit"
                                    variant={action === Actions.DELETE ? 'destructive' : 'default'}
                                    loading={loading}
                                />
                            )}{' '}
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
