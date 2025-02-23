import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center gap-2 mt-4 dark:bg-white/[0.03]">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-500 border rounded disabled:opacity-50 text-start text-theme-xs dark:text-gray-400"
            >
                Prev
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 border rounded ${page === currentPage ? "bg-success-500 text-white" : "text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-500 border rounded disabled:opacity-50 text-start text-theme-xs dark:text-gray-400"
            >
                Next
            </button>
        </div>
    );
}
