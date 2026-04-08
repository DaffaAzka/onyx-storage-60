import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import SelectForm from '@/components/select-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Borrowing, PaginatedData, SelectItems, User } from '@/lib/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from './sections/data-table';

export default function BorrowingsPage({ borrowings, user }: { borrowings: PaginatedData<Borrowing>; user: User }) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);

    const [search, setSearch] = useState('');
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
        setSearch(e.target.value);
        router.get('/borrowings', { search: e.target.value, status: status }, { preserveState: true, preserveScroll: true });
    }

    function handleSearchStatus(e: string) {
        setStatus(e);
        router.get('/borrowings', { status: e, search: search }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="Borrowings" description="Manage and track all borrowing transactions">
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
                <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                    <Input
                        onChange={handleSearch}
                        placeholder="Search Borrowings..."
                        className="bg-white"
                        value={search}
                    />
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
                </div>
                <DataTable borrowings={borrowings.data} userRole={user.role} />
                {borrowings.last_page > 1 && (
                    <PaginationComponent currentPage={borrowings.current_page} lastPage={borrowings.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AuthLayout>
    );
}
