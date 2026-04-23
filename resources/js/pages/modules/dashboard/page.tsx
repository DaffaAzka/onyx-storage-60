import AuthLayout from '@/components/layouts/auth-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/helpers';
import { DashboardData } from '@/lib/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    BookOpen,
    CalendarCheck,
    ClipboardList,
    Clock,
    DollarSign,
    FileText,
    Package,
    Plus,
    RefreshCw,
    Tags,
    TrendingUp,
    Users,
    XCircle,
} from 'lucide-react';

// Stat box using shadcn Card
function StatBox({
    icon,
    label,
    value,
    subtext,
    bgGradient,
    iconBg,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    subtext?: string;
    bgGradient: string;
    iconBg: string;
}) {
    return (
        <Card className={`overflow-hidden ${bgGradient}`}>
            <CardContent className="flex items-start justify-between p-6">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
                    {subtext && <p className="mt-2 text-xs text-gray-500">{subtext}</p>}
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${iconBg}`}>{icon}</div>
            </CardContent>
        </Card>
    );
}

// Distribution using shadcn Progress
function DistributionBreakdown({ items }: { items: Array<{ label: string; value: number; color: string; badge: string }> }) {
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card>
            <CardContent className="space-y-4 p-6">
                {items.map((item, idx) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                        <div key={idx}>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                <Badge className={item.badge}>{item.value}</Badge>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <p className="mt-1 text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

// Quick Actions for all roles
function QuickActions({ role }: { role: 'admin' | 'officer' | 'user' }) {
    const actions = {
        admin: [
            { label: 'Manage Users', icon: Users, url: '/users' },
            { label: 'Manage Items', icon: Package, url: '/items' },
            { label: 'View Reports', icon: FileText, url: '/borrowings/report' },
            { label: 'Manage Categories', icon: Tags, url: '/categories' },
        ],
        officer: [
            { label: 'Process Returns', icon: BookOpen, url: '/return-items' },
            { label: 'View Borrowings', icon: ClipboardList, url: '/borrowings' },
            { label: 'Borrowing Report', icon: FileText, url: '/borrowings/report' },
            { label: 'Activity Logs', icon: Activity, url: '/activity-logs' },
        ],
        user: [
            { label: 'Request Borrowing', icon: Plus, url: '/borrowings/create' },
            { label: 'My Borrowings', icon: BookOpen, url: '/borrowings' },
            { label: 'Return Item', icon: FileText, url: '/return-items' },
            { label: 'Returns Report', icon: RefreshCw, url: '/return-items/report' },
        ],
    };

    const actionList = actions[role];

    return (
        <div>
            <h3 className="mb-6 text-lg font-bold text-gray-900">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {actionList.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.label} href={action.url}>
                            <Button variant="outline" className="h-auto w-full flex-col gap-2 p-4">
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{action.label}</span>
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function AdminDashboard({ data }: { data: NonNullable<DashboardData['admin']> }) {
    return (
        <div className="space-y-8">
            {/* Key Stats Grid */}
            <div>
                <h3 className="mb-6 text-2xl font-bold text-gray-900">System Overview</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatBox
                        icon={<Users className="h-6 w-6" />}
                        label="Total Users"
                        value={data.total_users}
                        bgGradient="bg-linear-to-br from-blue-50 to-blue-100"
                        iconBg="bg-blue-600"
                    />
                    <StatBox
                        icon={<Package className="h-6 w-6" />}
                        label="Total Items"
                        value={data.total_items}
                        bgGradient="bg-linear-to-br from-green-50 to-green-100"
                        iconBg="bg-green-600"
                    />
                    <StatBox
                        icon={<Tags className="h-6 w-6" />}
                        label="Categories"
                        value={data.total_categories}
                        bgGradient="bg-linear-to-br from-purple-50 to-purple-100"
                        iconBg="bg-purple-600"
                    />
                    <StatBox
                        icon={<BookOpen className="h-6 w-6" />}
                        label="Borrowings"
                        value={data.total_borrowings}
                        bgGradient="bg-linear-to-br from-orange-50 to-orange-100"
                        iconBg="bg-orange-600"
                    />
                </div>
            </div>

            {/* Item Status and Borrowing Status side by side */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Item Condition Distribution */}
                <div>
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Item Conditions</h3>
                    <DistributionBreakdown
                        items={[
                            {
                                label: 'Good Condition',
                                value: data.items_good,
                                color: 'bg-linear-to-br from-green-50 to-green-100',
                                badge: 'bg-green-100 text-green-800',
                            },
                            {
                                label: 'Fair Condition',
                                value: data.items_fair,
                                color: 'bg-linear-to-br from-yellow-50 to-yellow-100',
                                badge: 'bg-yellow-100 text-yellow-800',
                            },
                            {
                                label: 'Damaged',
                                value: data.items_damaged,
                                color: 'bg-linear-to-br from-red-50 to-red-100',
                                badge: 'bg-red-100 text-red-800',
                            },
                        ]}
                    />
                </div>

                {/* Borrowing Status Distribution */}
                <div>
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Borrowing Status</h3>
                    <DistributionBreakdown
                        items={[
                            {
                                label: 'Approved',
                                value: data.borrowings_approved,
                                color: 'bg-linear-to-br from-blue-50 to-blue-100',
                                badge: 'bg-blue-100 text-blue-800',
                            },
                            {
                                label: 'Rejected',
                                value: data.borrowings_rejected,
                                color: 'bg-linear-to-br from-red-50 to-red-100',
                                badge: 'bg-red-100 text-red-800',
                            },
                            {
                                label: 'Returned',
                                value: data.borrowings_returned,
                                color: 'bg-linear-to-br from-green-50 to-green-100',
                                badge: 'bg-green-100 text-green-800',
                            },
                        ]}
                    />
                </div>
            </div>

            {/* User Status Table */}
            <QuickActions role="admin" />
        </div>
    );
}

function OfficerDashboard({ data }: { data: NonNullable<DashboardData['officer']> }) {
    return (
        <div className="space-y-8">
            {/* Priority Stats */}
            <div>
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Today's Operations</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatBox
                        icon={<Clock className="h-6 w-6" />}
                        label="Pending Requests"
                        value={data.total_pending}
                        bgGradient="bg-linear-to-br from-orange-50 to-orange-100"
                        iconBg="bg-orange-600"
                    />
                    <StatBox
                        icon={<BookOpen className="h-6 w-6" />}
                        label="Active Borrowings"
                        value={data.total_borrows}
                        bgGradient="bg-linear-to-br from-blue-50 to-blue-100"
                        iconBg="bg-blue-600"
                    />
                    <StatBox
                        icon={<AlertCircle className="h-6 w-6" />}
                        label="Late Returns"
                        value={data.total_lates_today}
                        bgGradient="bg-linear-to-br from-red-50 to-red-100"
                        iconBg="bg-red-600"
                    />
                    <StatBox
                        icon={<CalendarCheck className="h-6 w-6" />}
                        label="Returned Today"
                        value={data.total_returns_today}
                        bgGradient="bg-linear-to-br from-green-50 to-green-100"
                        iconBg="bg-green-600"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <QuickActions role="officer" />

            {/* Today's Activity and Pending Work side by side */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Today's Activity Summary */}
                <div>
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Today's Actions</h3>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Badge className="bg-green-100 text-green-800">✓ Approved</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">{data.total_approved_today}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Badge className="bg-red-100 text-red-800">✗ Rejected</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">{data.total_rejected_today}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Badge className="bg-blue-100 text-blue-800">✓ Processed</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">{data.total_returns_today}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Pending Tasks</h3>
                    <div className="space-y-4">
                        <Card className="bg-linear-to-br from-orange-50 to-orange-100">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Verifications Pending</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{data.pending_verifications}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white">
                                    <Clock className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-linear-to-br from-red-50 to-red-100">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Fines to Collect</p>
                                    <p className="mt-2 text-3xl font-bold text-red-600">{formatCurrency(data.fines_pending_collection ?? 0)}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserDashboard({ data }: { data: NonNullable<DashboardData['user']> }) {
    const calculateDaysUntilDue = (dueDate: string): number => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div>
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Your Summary</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatBox
                        icon={<BookOpen className="h-6 w-6" />}
                        label="Total Borrowings"
                        value={data.total_borrowings}
                        bgGradient="bg-linear-to-br from-purple-50 to-purple-100"
                        iconBg="bg-purple-600"
                    />
                    <StatBox
                        icon={<TrendingUp className="h-6 w-6" />}
                        label="Active"
                        value={data.total_borrows}
                        bgGradient="bg-linear-to-br from-blue-50 to-blue-100"
                        iconBg="bg-blue-600"
                    />
                    <StatBox
                        icon={<Clock className="h-6 w-6" />}
                        label="Pending"
                        value={data.total_pending}
                        bgGradient="bg-linear-to-br from-orange-50 to-orange-100"
                        iconBg="bg-orange-600"
                    />
                    <StatBox
                        icon={<XCircle className="h-6 w-6" />}
                        label="Rejected"
                        value={data.total_rejected}
                        bgGradient="bg-linear-to-br from-gray-50 to-gray-100"
                        iconBg="bg-gray-600"
                    />
                </div>
            </div>

            {/* Fines Alert if any */}
            {data.total_fines > 0 && (
                <div>
                    <Alert className="border-2 border-red-300 bg-red-50">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <AlertTitle className="text-red-800">Unpaid Fines Alert</AlertTitle>
                        <AlertDescription className="text-red-700">
                            You have <strong>{formatCurrency(data.total_fines ?? 0)} </strong> in unpaid fines ({data.unpaid_fines_count} fine
                            {data.unpaid_fines_count !== 1 ? 's' : ''} pending)
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Upcoming Returns Table */}
            {data.upcoming_returns && data.upcoming_returns.length > 0 && (
                <div>
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Upcoming Returns</h3>
                    <Card>
                        <CardContent>
                            <Table>
                                <colgroup>
                                    <col className="w-[60%]" />
                                    <col className="w-[25%]" />
                                    <col className="w-[15%]" />
                                </colgroup>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.upcoming_returns.map((item) => {
                                        const daysLeft = calculateDaysUntilDue(item.return_date);
                                        const isOverdue = daysLeft < 0;
                                        const isDueSoon = daysLeft >= 0 && daysLeft <= 3;

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-semibold">{item.item_name}</TableCell>
                                                <TableCell>
                                                    {new Date(item.return_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            isOverdue
                                                                ? 'bg-red-200 text-red-800'
                                                                : isDueSoon
                                                                  ? 'bg-orange-200 text-orange-800'
                                                                  : 'bg-blue-200 text-blue-800'
                                                        }
                                                    >
                                                        {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Recent Borrowings Table */}
            {data.recent_borrowings && data.recent_borrowings.length > 0 && (
                <div>
                    <h3 className="mb-6 text-lg font-bold text-gray-900">Recent Borrowings</h3>
                    <Card>
                        <CardContent>
                            <Table>
                                <colgroup>
                                    <col className="w-[60%]" />
                                    <col className="w-[25%]" />
                                    <col className="w-[15%]" />
                                </colgroup>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.recent_borrowings.map((borrowing) => (
                                        <TableRow key={borrowing.id}>
                                            <TableCell>{borrowing.item_name}</TableCell>
                                            <TableCell>
                                                {new Date(borrowing.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        borrowing.status === 'borrowed'
                                                            ? 'bg-blue-200 text-blue-800'
                                                            : borrowing.status === 'pending'
                                                              ? 'bg-yellow-200 text-yellow-800'
                                                              : borrowing.status === 'returned'
                                                                ? 'bg-green-200 text-green-800'
                                                                : borrowing.status === 'rejected'
                                                                  ? 'bg-red-200 text-red-800'
                                                                  : 'bg-gray-200 text-gray-800'
                                                    }
                                                >
                                                    {borrowing.status === 'borrowed'}
                                                    {borrowing.status === 'pending'}
                                                    {borrowing.status === 'returned'}
                                                    {borrowing.status === 'rejected'}
                                                    {borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Quick Actions */}
            <QuickActions role="user" />
        </div>
    );
}

export default function DashboardPage({ data }: { data: DashboardData }) {
    return (
        <AuthLayout title="Dashboard" description="Overview of your current activities and statistics">
            <div>
                {data.admin && <AdminDashboard data={data.admin} />}
                {data.officer && <OfficerDashboard data={data.officer} />}
                {data.user && <UserDashboard data={data.user} />}
            </div>
        </AuthLayout>
    );
}
