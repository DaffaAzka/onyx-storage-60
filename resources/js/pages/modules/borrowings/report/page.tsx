import InputForm from '@/components/input-form';
import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import SelectForm from '@/components/select-form';
import { Button } from '@/components/ui/button';
import { Borrowing, PaginatedData, SelectItems, User } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from './sections/data-table';

export default function BorrowingsReportPage({ borrowings, user }: { borrowings: PaginatedData<Borrowing>; user: User }) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);

    const [search, setSearch] = useState({
        start_date: urlParams.get('start_date') || '',
        end_date: urlParams.get('end_date') || '',
    });
    const [status, setStatus] = useState(urlParams.get('status') || 'all');

    const statusSelected: SelectItems[] = [
        { id: 'pending', name: 'Pending' },
        { id: 'rejected', name: 'Rejected' },
        { id: 'approved', name: 'Approved' },
        { id: 'borrowed', name: 'Borrowed' },
        { id: 'returned', name: 'Returned' },
        { id: 'late', name: 'Late' },
    ];

    function handlePageChange(page: number) {
        router.get('/borrowings', { page }, { preserveState: true, preserveScroll: true });
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch({
            ...search,
            [e.target.name]: e.target.value,
        });
        router.get('/borrowings/report', { ...search, [e.target.name]: e.target.value, status }, { preserveState: true, preserveScroll: true });
    }

    function handleSearchStatus(e: string) {
        setStatus(e);
        router.get('/borrowings/report', { status: e, ...search }, { preserveState: true, preserveScroll: true });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search.start_date) params.append('start_date', search.start_date);
        if (search.end_date) params.append('end_date', search.end_date);

        window.location.href = `/borrowings/report/export?${params.toString()}`;
    }

    return (
        <AuthLayout title="Report Borrowings" description="Generate and export detailed borrowing transaction reports">
            <div className="flex flex-col gap-4">
                <div className="hidden justify-end gap-2 lg:flex lg:flex-row">
                    <Button variant={status === 'all' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('all')}>
                        All
                    </Button>
                    <Button variant={status === 'pending' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('pending')}>
                        Pending
                    </Button>
                    <Button variant={status === 'rejected' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('rejected')}>
                        Rejected
                    </Button>
                    <Button variant={status === 'approved' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('approved')}>
                        Approved
                    </Button>
                    <Button variant={status === 'borrowed' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('borrowed')}>
                        Borrowed
                    </Button>
                    <Button variant={status === 'returned' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('returned')}>
                        Returned
                    </Button>
                    <Button variant={status === 'late' ? 'default' : 'outline'} size={'sm'} onClick={() => handleSearchStatus('late')}>
                        Late
                    </Button>
                </div>
                <div className="flex flex-row gap-4">
                    {/* <Input
                        onChange={handleSearch}
                        placeholder="Search Borrowings by Item Name, Item Category, Borrower Name..."
                        className="bg-white"
                        value={search}
                    /> */}

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
                        items={statusSelected}
                        name="search-by-status"
                        text="Filters by Status"
                        handleChange={handleSearchStatus}
                        value={status}
                        usePlaceholder={true}
                        withAll={true}
                    />
                </div>
                <DataTable borrowings={borrowings.data} userRole={user.role} />
                {borrowings.last_page > 1 && (
                    <PaginationComponent currentPage={borrowings.current_page} lastPage={borrowings.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AuthLayout>
    );
}
