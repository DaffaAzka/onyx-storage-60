export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'admin' | 'officer' | 'user';
    phone_number: string | null;
    is_active: number | boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id: number;
    name: string;
    description: string;
    user?: User;
    created_at: string;
    updated_at: string;

    items?: Item[];
};

export type Item = {
    id: number;
    category_id: number | null;
    user_id: number | null;
    name: string;
    code: string;
    description: string | null;
    status: 'fair' | 'damaged' | 'good';
    quantity: number;
    available_quantity: number;
    image_path: string | null;
    image_url: string | null;
    category?: Category;
    user?: User;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
};

export type SelectItems = {
    id: string | number;
    name: string;
};

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export enum Actions {
    UPDATE = 'UPDATE',
    DETAIL = 'DETAIL',
    DELETE = 'DELETE',
}

export enum ItemStatuses {
    GOOD = 'good',
    FAIR = 'fair',
    DAMAGED = 'damaged',
}

export type BorrowingStatus = 'pending' | 'approved' | 'rejected' | 'borrowed' | 'returned' | 'canceled';

export type Borrowing = {
    id: number;
    borrower_id: number | null;
    item_id: number | null;
    quantity: number;
    borrow_date: string;
    planned_return_date: string;
    actual_return_date: string | null;
    status: BorrowingStatus;
    notes: string | null;
    approved_by: number | null;
    approved_at: string | null;
    upload_at: string | null;
    rejection_reason: string | null;
    image_path?: string | null;
    image_url?: string | null;
    code?: string | null;

    item?: Item;
    borrower?: User;
    approver?: User;
    uploader?: User;
    return_item?: ReturnItem;
};

export type ReturnItem = {
    id: number;
    borrowing_id: number | null;
    received_by: number | null;
    return_date: string | null;
    verified_at: string | null;
    condition: ItemStatuses;
    fine_amount: number | null;
    fine_paid: boolean;
    notes: string | null;
    upload_at: string | null;
    image_path?: string | null;
    image_url?: string | null;

    borrowing?: Borrowing;
    received?: User;
    uploader?: User;
};

export type ActivityLog = {
    id: number;
    user_id: number | null;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DETAIL';
    description: string;
    created_at: string;

    user?: User;
};

export type DashboardData = {
    admin: {
        total_users: number;
        active_users: number;
        inactive_users: number;
        total_items: number;
        items_good: number;
        items_fair: number;
        items_damaged: number;
        total_categories: number;
        total_borrowings: number;
        borrowings_approved: number;
        borrowings_rejected: number;
        borrowings_returned: number;
    } | null;
    officer: {
        total_pending: number;
        total_borrows: number;
        total_approved_today: number;
        total_rejected_today: number;
        total_lates_today: number;
        total_returns_today: number;
        pending_verifications: number;
        fines_pending_collection: number;
    } | null;
    user: {
        total_borrowings: number;
        total_borrows: number;
        total_pending: number;
        total_rejected: number;
        total_fines: number;
        unpaid_fines_count: number;
        upcoming_returns: Array<{
            id: number;
            item_name: string;
            return_date: string;
            quantity: number;
        }>;
        recent_borrowings: Array<{
            id: number;
            item_name: string;
            status: string;
            created_at: string;
        }>;
    } | null;
};
