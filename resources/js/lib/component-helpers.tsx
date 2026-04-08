import { Item, User } from './types';

export function printUserNameSoftDelete({ className, user }: { className: string; user: User | undefined }) {
    if (!user) return <p className={className}>N/A</p>;

    return user.deleted_at !== null ? <p className={`${className} text-red-600`}>{user.name}</p> : <p className={className}>{user.name}</p>;
}

export function printItemSoftDelete({ className, item }: { className: string; item: Item | undefined | null }) {
    if (!item) return <p className={className}>N/A</p>;

    return item.deleted_at !== null ? <p className={`${className} text-red-600`}>{item.name}</p> : <p className={className}>{item.name}</p>;
}
