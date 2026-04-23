import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import { Input } from '@/components/ui/input';
import { PaginatedData, ReturnItem } from '@/lib/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from './sections/data-table';

export default function Page({ return_items }: { return_items: PaginatedData<ReturnItem> }) {
    function handlePageChange(page: number) {
        router.get('/return-items/list', { page }, { preserveState: true, preserveScroll: true });
    }

    const [search, setSearch] = useState('');

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/return-items/list', { search: e.target.value }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="List Return Items" description="Manage item returns">
            <div className="flex flex-row gap-4">
                <Input placeholder="Search Items..." className="bg-white" onChange={handleSearch} />
            </div>
            <DataTable return_items={return_items.data} />
            {return_items.last_page > 1 && (
                <PaginationComponent currentPage={return_items.current_page} lastPage={return_items.last_page} onPageChange={handlePageChange} />
            )}
        </AuthLayout>
    );
}
