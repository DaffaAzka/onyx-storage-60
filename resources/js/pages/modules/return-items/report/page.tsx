import InputForm from '@/components/input-form';
import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import SelectForm from '@/components/select-form';
import { Button } from '@/components/ui/button';
import { PaginatedData, ReturnItem, SelectItems, User } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from './sections/data-table';

export default function ReturnItemsReportPage({ return_items, user }: { return_items: PaginatedData<ReturnItem>; user: User }) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);

    const [search, setSearch] = useState({
        start_date: urlParams.get('start_date') || '',
        end_date: urlParams.get('end_date') || '',
    });
    const [condition, setCondition] = useState(urlParams.get('condition') || 'all');

    const conditionSelected: SelectItems[] = [
        { id: 'good', name: 'Good' },
        { id: 'fair', name: 'Fair' },
        { id: 'damaged', name: 'Damaged' },
    ];

    function handlePageChange(page: number) {
        router.get('/return-items/report', { page }, { preserveState: true, preserveScroll: true });
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch({
            ...search,
            [e.target.name]: e.target.value,
        });
        router.get('/return-items/report', { ...search, [e.target.name]: e.target.value, condition }, { preserveState: true, preserveScroll: true });
    }

    function handleSearchCondition(e: string) {
        setCondition(e);
        router.get('/return-items/report', { condition: e, ...search }, { preserveState: true, preserveScroll: true });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (condition) params.append('condition', condition);
        if (search.start_date) params.append('start_date', search.start_date);
        if (search.end_date) params.append('end_date', search.end_date);

        window.location.href = `/return-items/report/export?${params.toString()}`;
    }

    return (
        <AuthLayout title="Report Return Items" description="Generate and export detailed return item transaction reports">
            <div className="flex flex-col gap-4">
                <div className="hidden justify-end gap-2 lg:flex lg:flex-row">
                    <Button variant={condition === 'all' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchCondition('all')}>
                        All
                    </Button>
                    <Button variant={condition === 'good' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchCondition('good')}>
                        Good
                    </Button>
                    <Button variant={condition === 'fair' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchCondition('fair')}>
                        Fair
                    </Button>
                    <Button variant={condition === 'damaged' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchCondition('damaged')}>
                        Damaged
                    </Button>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="grid-cols grid w-full gap-4 lg:grid-cols-2">
                        <InputForm
                            name={'start_date'}
                            text={'Start Date'}
                            type={'date'}
                            usePlaceholder={false}
                            handleChange={handleSearch}
                            value={search.start_date}
                        />
                        <InputForm
                            name={'end_date'}
                            text={'End Date'}
                            type={'date'}
                            usePlaceholder={false}
                            handleChange={handleSearch}
                            value={search.end_date}
                        />
                    </div>
                </div>

                <form action="" onSubmit={handleSubmit}>
                    <Button type="submit"> Export</Button>
                </form>

                <div className="rounded-lg bg-white lg:hidden">
                    <SelectForm
                        items={conditionSelected}
                        name="search-by-condition"
                        text="Filters by Condition"
                        handleChange={handleSearchCondition}
                        value={condition}
                        usePlaceholder={true}
                        withAll={true}
                    />
                </div>

                <DataTable return_items={return_items.data} userRole={user.role} />
                {return_items.last_page > 1 && (
                    <PaginationComponent currentPage={return_items.current_page} lastPage={return_items.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AuthLayout>
    );
}
