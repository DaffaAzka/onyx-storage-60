import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import SelectForm from '@/components/select-form';
import { Input } from '@/components/ui/input';
import { PaginatedData, SelectItems, User } from '@/lib/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from './sections/data-table';
import CreateModal from './sections/create-modal';
export default function UsersPage({ users }: { users: PaginatedData<User> }) {
    const [selectedRole, setSelectedRole] = useState('');
    const [search, setSearch] = useState('');

    const roles: SelectItems[] = [
        { id: 'admin', name: 'Admin' },
        { id: 'officer', name: 'Officer' },
        { id: 'user', name: 'User' },
    ];

    function handlePageChange(page: number) {
        router.get('/users', { page }, { preserveState: true, preserveScroll: true });
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/users', { search: e.target.value, role: selectedRole }, { preserveState: true, preserveScroll: true });
    }

    function handleSearchByRoles(e: string) {
        setSelectedRole(e);
        router.get('/users', { search: search, role: e }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title={'Users'} description="Manage user accounts and their roles">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                    <Input onChange={handleSearch} placeholder="Search Users..." className="bg-white" value={search} />
                    <div className="hidden rounded-lg bg-white lg:block">
                        <SelectForm
                            items={roles}
                            name="search-by-role"
                            text="Filters by Role"
                            handleChange={handleSearchByRoles}
                            value={selectedRole}
                            usePlaceholder={true}
                            withAll={true}
                        />
                    </div>

                    <CreateModal roles={roles} />
                </div>

                <DataTable users={users.data} />
                {users.last_page > 1 && (
                    <PaginationComponent currentPage={users.current_page} lastPage={users.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AuthLayout>
    );
}
