import { Card, CardContent } from '@/components/ui/card';
import { ActivityLog } from '@/lib/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { printUserNameSoftDelete } from '@/lib/component-helpers';
import { HistoryIcon } from 'lucide-react';

export default function DataTable({ data }: { data: ActivityLog[] }) {
    return (
        <Card>
            <CardContent>
                {data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-25">No</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>User</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((e, index) => (
                                <TableRow>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{e.action}</TableCell>
                                    <TableCell>{e.description}</TableCell>
                                    <TableCell>
                                        {printUserNameSoftDelete({
                                            className: '',
                                            user: e.user,
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <>
                        <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-gray-400">
                            <HistoryIcon size={32} />
                            <p className="text-md font-medium lg:text-xl">No Users Found</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
