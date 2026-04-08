import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function PaginationComponent({ currentPage, lastPage, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (lastPage <= 5) {
            // Tampilkan semua halaman jika total <= 5
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            // Logika untuk pagination dengan ellipsis
            if (currentPage <= 3) {
                // Awal: 1, 2, 3, ..., last
                pages.push(1, 2, 3, 'ellipsis', lastPage);
            } else if (currentPage >= lastPage - 2) {
                // Akhir: 1, ..., last-2, last-1, last
                pages.push(1, 'ellipsis', lastPage - 2, lastPage - 1, lastPage);
            } else {
                // Tengah: 1, ..., current-1, current, current+1, ..., last
                pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', lastPage);
            }
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {typeof page === 'number' ? (
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < lastPage) onPageChange(currentPage + 1);
                        }}
                        className={currentPage === lastPage ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
