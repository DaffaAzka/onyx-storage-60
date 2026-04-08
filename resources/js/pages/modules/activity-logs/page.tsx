import AuthLayout from '@/components/layouts/auth-layout';
import PaginationComponent from '@/components/pagination';
import { Input } from '@/components/ui/input';
import { ActivityLog, PaginatedData } from '@/lib/types';
import { router } from '@inertiajs/react';
import React, { useState } from 'react';
import DataTable from './sections/data-table';

export default function ActivityLogsPage({ activityLogs }: { activityLogs: PaginatedData<ActivityLog> }) {
    const [search, setSearch] = useState('');

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
        router.get('/activity-logs', { search: e.target.value }, { preserveState: true });
    }

    function handlePageChange(page: number) {
        router.get('/activity-logs', { page, search }, { preserveState: true, preserveScroll: true });
    }

    return (
        <AuthLayout title="Activity Logs" description="">
            <div className="flex flex-col gap-4">
                <Input onChange={handleSearch} placeholder="Search logs..." className="bg-white" value={search} />
            </div>
            <DataTable data={activityLogs.data} />

            {activityLogs.last_page > 1 && (
                <PaginationComponent currentPage={activityLogs.current_page} lastPage={activityLogs.last_page} onPageChange={handlePageChange} />
            )}
        </AuthLayout>
    );
}
