import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import { Input } from '@/components/ui/input';
import { Borrowing, PaginatedData, ReturnItem } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DataCards from './sections/data-cards';
import DataTable from './sections/data-table';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        role: string;
    };
};

export default function ItemReturnPage({ borrowings, return_items }: { borrowings: PaginatedData<Borrowing>; return_items: ReturnItem[] }) {
    const [search, setSearch] = useState('');
    const { auth } = usePage<PageProps>().props;

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/return-items', { search: e.target.value }, { preserveState: true, preserveScroll: true });
    }

    function handlePageChange(page: number) {
        router.get('return-items', { page }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title={'Return Items'} description="Manage and track item returns">
            <div className="flex flex-row gap-4">
                <Input placeholder="Search Items..." className="bg-white" onChange={handleSearch} />
            </div>
            <DataCards borrowings={borrowings.data} role={auth.role} />
            {borrowings.last_page > 1 && (
                <PaginationComponent currentPage={borrowings.current_page} lastPage={borrowings.last_page} onPageChange={handlePageChange} />
            )}

            <DataTable return_items={return_items} />
        </AuthLayout>
    );
}
