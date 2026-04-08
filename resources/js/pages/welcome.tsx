import GuestLayout from '@/components/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Activity, ArrowRight, ClipboardList, DatabaseBackupIcon, Package } from 'lucide-react';

export default function Welcome() {
    return (
        <GuestLayout title="Welcome to Onyx Storage">
            <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-slate-50 dark:bg-slate-950">
                <header className="relative overflow-hidden pt-32 pb-24 sm:pt-32 sm:pb-32 lg:pt-56 lg:pb-40">
                    <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-50 px-7 py-2 ring-1 ring-blue-500/20 dark:bg-blue-900/30">
                            <DatabaseBackupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Introducing Onyx Storage 1.0</p>
                        </div>
                        <h1 className="font-display mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
                            Streamline your <span className="text-blue-600 dark:text-blue-500">storage</span> management
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-300">
                            A comprehensive solution for tracking items, managing borrowings, and monitoring stock levels in real-time. Designed
                            specifically for efficiency and ease of use.
                        </p>
                        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:gap-x-6">
                            <Button asChild size="lg" className="group h-12 w-full px-8 text-base font-semibold sm:w-auto">
                                <Link href="/register">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </header>

                <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Everything you need to manage assets
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                Powerful features to help you keep track of every item, borrowing, and return.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50">
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-xl">Master Data</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                                        Easily manage items, categories, and users with full administrative control. Keep your catalog organized and
                                        up-to-date.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50">
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                                        <ClipboardList className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <CardTitle className="text-xl">Borrowing & Returns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                                        Track item loans and returns seamlessly with complete logging and accountability. Never lose track of your
                                        assets again.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50">
                                <CardHeader>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                        <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-xl">Activity Logs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                                        Keep a detailed history of all transactions, providing full transparency and data integrity across your entire
                                        organization.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row lg:px-8">
                        <div className="flex items-center space-x-2">
                            <DatabaseBackupIcon className="h-5 w-5 text-slate-900 dark:text-white" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white">Onyx Storage</span>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 md:mt-0 dark:text-slate-400">
                            &copy; {new Date().getFullYear()} Onyx Storage. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </GuestLayout>
    );
}
