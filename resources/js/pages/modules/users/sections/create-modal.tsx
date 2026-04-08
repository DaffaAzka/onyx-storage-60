import { SelectItems } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import SelectForm from '@/components/select-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function CreateModal({ roles }: { roles: SelectItems[] }) {
    const { errors } = usePage().props;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        retry_password: '',
        phone_number: '',
        is_activer: 1,
        role: null,
    } as {
        name: string;
        email: string;
        password: string;
        retry_password: string;
        phone_number: string;
        is_activer: number;
        role: string | null;
    });
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        router.post('/users', values, {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
            onSuccess: () => {
                setValues({
                    name: '',
                    email: '',
                    password: '',
                    retry_password: '',
                    phone_number: '',
                    is_activer: 1,
                    role: null,
                });
                setOpen(false);
                toast.success('User created successfully!');
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Create User</Button>
                </DialogTrigger>
                <DialogContent className="max-w-sx max-h-[90vh] overflow-x-hidden md:max-w-md lg:max-w-lg">
                    <DialogHeader className="flex flex-col gap-4">
                        <DialogTitle>Create new user</DialogTitle>
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

                            <SelectForm
                                name="role"
                                text="Select Role"
                                handleChange={(value: string) => {
                                    setValues((prev) => ({ ...prev, role: value }));
                                }}
                                error={errors.role}
                                usePlaceholder={true}
                                value={values.role}
                                items={roles}
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
