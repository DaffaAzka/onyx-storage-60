import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import LoadingButton from './button_loading';
import InputForm from './input-form';
import { Alert, AlertDescription } from './ui/alert';

export default function EditProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { auth } = usePage<{
        auth: {
            user: {
                name: string;
                email: string;
                phone_number: string;
            };
        };
    }>().props;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [values, setValues] = useState({
        name: auth.user.name ?? '',
        email: auth.user.email ?? '',
        password: '',
        retry_password: '',
        phone_number: auth.user.phone_number ?? '',
    } as {
        name: string;
        email: string;
        password: string;
        retry_password: string;
        phone_number: string;
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        router.patch('/my-profile', values, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('User updated successfully');
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to update user');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-lg">
                    <DialogHeader className="flex flex-col gap-4">
                        <DialogTitle>Edit My Profile</DialogTitle>
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
                            />
                            <InputForm
                                name="email"
                                text="Email"
                                type="email"
                                handleChange={handleChange}
                                error={errors.email}
                                usePlaceholder={true}
                                value={values.email}
                            />
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <InputForm
                                    name="password"
                                    text="Password"
                                    type="password"
                                    handleChange={handleChange}
                                    error={errors.password}
                                    usePlaceholder={true}
                                    value={values.password}
                                />

                                <InputForm
                                    name="retry_password"
                                    text="Retry Password"
                                    type="password"
                                    handleChange={handleChange}
                                    error={errors.retry_password}
                                    usePlaceholder={true}
                                    value={values.retry_password}
                                />
                            </div>
                            <InputForm
                                name="phone_number"
                                text="Phone Number (Optional)"
                                type="text"
                                handleChange={handleChange}
                                error={errors.phone_number}
                                usePlaceholder={true}
                                value={values.phone_number}
                            />
                            <LoadingButton text="Submit" type="submit" loading={loading} />
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
