import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import { PaginatedData, ReturnItem } from '@/lib/types';
import { router } from '@inertiajs/react';
import DataTable from './sections/data-table';

export default function Page({ return_items }: { return_items: PaginatedData<ReturnItem> }) {
    function handlePageChange(page: number) {
        router.get('/return-items/list', { page }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="List Return Items" description="Manage item returns">
            <DataTable return_items={return_items.data} />
            {return_items.last_page > 1 && (
                <PaginationComponent currentPage={return_items.current_page} lastPage={return_items.last_page} onPageChange={handlePageChange} />
            )}
        </AuthLayout>
    );
}
