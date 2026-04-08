import { Toaster } from '@/components/ui/sonner';
import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { AppSidebar } from '../sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { TooltipProvider } from '../ui/tooltip';

export default function AuthLayout({ children, title, description = '' }: { children: ReactNode; title: string; description: string }) {
    return (
        <>
            <main>
                <Toaster position="top-right" />
                <Head title={`${title}`}>
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link
                        href="https://fonts.bunny.net/css?family=inter:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
                        rel="stylesheet"
                    />
                </Head>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset className="bg-slate-100">
                        <header className="flex items-center justify-between gap-2 px-4 py-4 lg:py-5">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                                <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                            <SidebarTrigger />
                        </header>
                        <TooltipProvider>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
                        </TooltipProvider>
                    </SidebarInset>
                </SidebarProvider>
            </main>
        </>
    );
}
