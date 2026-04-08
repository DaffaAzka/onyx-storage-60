import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import SelectForm from '@/components/select-form';
import { Input } from '@/components/ui/input';
import { Category, Item, PaginatedData } from '@/lib/types';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import DataCards from './sections/data-cards';

export default function CreatePage({ items, categories }: { items: PaginatedData<Item>; categories: Category[] }) {
    const [categoryId, setCategoryId] = useState('');
    const [search, setSearch] = useState('');

    function handleSearchByCategories(e: string) {
        setCategoryId(e);
        router.get('/borrowing/create', { category_id: e, search: search }, { preserveState: true, preserveScroll: true });
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/borrowing/create', { search: e.target.value, category_id: categoryId }, { preserveState: true, preserveScroll: true });
    }

    function handlePageChange(page: number) {
        router.get('/borrowing/create', { page, category_id: categoryId, search: search }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="Create Borrowing" description="Browse and borrow available items">
            <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                <Input placeholder="Search Items..." className="bg-white" onChange={handleSearch} />
                <div className="rounded-lg bg-white">
                    <SelectForm
                        items={categories}
                        name="search-by-category"
                        text="Filters by Category"
                        handleChange={handleSearchByCategories}
                        value={categoryId}
                        usePlaceholder={true}
                        withAll={true}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="flex flex-col gap-4 lg:col-span-4">
                    <DataCards items={items.data} />
                </div>

                {/* <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>
                </div> */}
            </div>
            {items.last_page > 1 && (
                <PaginationComponent currentPage={items.current_page} lastPage={items.last_page} onPageChange={handlePageChange} />
            )}
        </AuthLayout>
    );
}
