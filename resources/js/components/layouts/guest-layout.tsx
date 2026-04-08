import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import Navbar from '../navbar';

export default function GuestLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <main className="bg-slate-100">
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
                    rel="stylesheet"
                />
            </Head>
            <Navbar />
            {children}
        </main>
    );
}
