import LoadingButton from '@/components/button_loading';
import InputForm from '@/components/input-form';
import GuestLayout from '@/components/layouts/guest-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
export default function LoginPage() {
    const { errors } = usePage().props;

    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    function handleChange(e: { target: { name: string; value: string } }) {
        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value,
        }));
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        router.post('/login', values, {
            onFinish: () => {
                setLoading(false);
            },
        });
    }

    return (
        <GuestLayout title="Login">
            <div className="flex min-h-screen w-full items-center justify-center px-4 md:px-0">
                <Card className="mb-12 w-full max-w-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Sign In</CardTitle>
                        <CardDescription className="text-center">Enter your email below to login to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <InputForm
                                handleChange={handleChange}
                                name="email"
                                text="Email Address"
                                type="email"
                                error={errors.email}
                                value={values.email}
                            />
                            <InputForm
                                handleChange={handleChange}
                                name="password"
                                text="Password"
                                type="password"
                                error={errors.password}
                                value={values.password}
                            />

                            <div className="flex flex-col gap-3">
                                <LoadingButton text="Continue to Sign In" type="submit" loading={loading} />
                                <p className="text-center text-xs md:text-sm">
                                    Didn't have an account?{' '}
                                    <Link className="text-blue-400 underline" href={'/register'}>
                                        Sign up here!
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
