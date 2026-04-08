import { User } from './types';

export function authorizations(role: string, requiredRole: string[]): boolean {
    return requiredRole.includes(role);
}

export function formatDate(dateString: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error('Undifined date format');
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export function getStatusLabel(statusKey: string): string {
    return statusKey.charAt(0).toUpperCase() + statusKey.slice(1);
}

export function calculateFine({
    planned_return_date,
    actual_return_date,
}: {
    planned_return_date: string;
    actual_return_date: string | null;
}): number {
    if (!actual_return_date) {
        return 0;
    }

    const plannedDate = new Date(planned_return_date);
    const actualDate = new Date(actual_return_date);

    const diffTime = actualDate.getTime() - plannedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays * 5000 : 0;
}

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}
