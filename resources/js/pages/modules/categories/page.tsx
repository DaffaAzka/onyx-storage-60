import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import { Input } from '@/components/ui/input';
import type { Category, PaginatedData } from '@/lib/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import CreateModal from './sections/create-modal';
import DataTable from './sections/data-table';

export default function CategoriesPage({ categories }: { categories: PaginatedData<Category> }) {
    const [search, setSearch] = useState('');

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/categories', { search: e.target.value }, { preserveState: true, preserveScroll: true });
    }

    function handlePageChange(page: number) {
        router.get('/categories', { page }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="Categories" description="Manage item categories">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                    <Input onChange={handleSearch} placeholder="Search Categories..." className="bg-white" value={search} />
                    <CreateModal />
                </div>

                <DataTable categories={categories.data} />

                {categories.last_page > 1 && (
                    <PaginationComponent currentPage={categories.current_page} lastPage={categories.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AuthLayout>
    );
}
