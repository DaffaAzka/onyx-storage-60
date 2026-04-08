import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import GuestLayout from '@/components/layouts/guest-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
    const { errors } = usePage().props;

    const [values, setValues] = useState({
        fullname: '',
        email: '',
        password: '',
        retry_password: '',
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e: { target: { name: string; value: string } }) {
        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);
        router.post('/register', values, {
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <>
            <GuestLayout title="Register">
                <div className="flex min-h-screen w-full items-center justify-center px-4 md:px-0">
                    <Card className="mb-12 w-full max-w-xl">
                        <CardHeader>
                            <CardTitle className="text-center text-xl">Sign Up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <InputForm
                                    name="fullname"
                                    text="Fullname"
                                    type="text"
                                    handleChange={handleChange}
                                    error={errors.fullname}
                                    value={values.fullname}
                                />

                                <InputForm
                                    name="email"
                                    text="Email Address"
                                    type="email"
                                    handleChange={handleChange}
                                    error={errors.email}
                                    value={values.email}
                                />

                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <InputForm
                                        name="password"
                                        text="Password"
                                        type="password"
                                        handleChange={handleChange}
                                        error={errors.password}
                                        value={values.password}
                                    />
                                    <InputForm
                                        name="retry_password"
                                        text="Retype Password"
                                        type="password"
                                        handleChange={handleChange}
                                        error={errors.retry_password}
                                        value={values.retry_password}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <LoadingButton text="Continue to Sign Up" type="submit" loading={loading} />
                                    <p className="text-center text-xs md:text-sm">
                                        Already have an account?{' '}
                                        <Link className="text-blue-400 underline" href={'/login'}>
                                            Sign in here!
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </GuestLayout>
        </>
    );
}
