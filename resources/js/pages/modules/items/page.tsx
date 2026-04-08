import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import SelectForm from '@/components/select-form';
import { Input } from '@/components/ui/input';
import { Category, Item, PaginatedData } from '@/lib/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import CreateModal from './sections/create-modal';
import DataTable from './sections/data-table';

export default function ItemsPage({ items, categories }: { items: PaginatedData<Item>; categories: Category[] }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/items', { search: e.target.value }, { preserveState: true, preserveScroll: true });
    }

    function handleSearchByCategories(e: string) {
        setSelectedCategory(e);
        router.get('/items', { category_id: e, search: search }, { preserveState: true, preserveScroll: true });
    }

    function handlePageChange(page: number) {
        router.get('/items', { page, search, category_id: selectedCategory }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="Items" description="Manage and organize your inventory items">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                    <Input onChange={handleSearch} placeholder="Search Items..." className="bg-white" value={search} />
                    <div className="hidden rounded-lg bg-white lg:block">
                        <SelectForm
                            items={categories}
                            name="search-by-category"
                            text="Filters by Category"
                            handleChange={handleSearchByCategories}
                            value={selectedCategory}
                            usePlaceholder={true}
                            withAll={true}
                        />
                    </div>
                    <CreateModal categories={categories} />
                </div>

                <DataTable items={items.data} categories={categories} />

                {items.last_page > 1 && (
                    <PaginationComponent currentPage={items.current_page} lastPage={items.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AuthLayout>
    );
}
