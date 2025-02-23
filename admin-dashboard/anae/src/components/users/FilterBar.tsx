import React from "react";

interface FilterBarProps {
    keyword: string;
    setKeyword: (value: string) => void;
    dateFrom: string;
    setDateFrom: (value: string) => void;
    dateTo: string;
    setDateTo: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    onSearch: () => void;
}

export default function FilterBar({
    keyword,
    setKeyword,
    dateFrom,
    setDateFrom,
    category,
    setCategory,
    onSearch,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap gap-4 mb-4 dark:bg-white/[0.03]">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by keyword..."
                className="px-3 py-2 border rounded focus:border-success-300 focus:outline-none focus:ring focus:ring-success-500/10 dark:bg-white/[0.03]"
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border rounded focus:border-success-300 focus:outline-none focus:ring focus:ring-success-500/10 dark:bg-white/[0.03] text-gray-500  dark:text-gray-400"
            >
                <option value="">All Categories</option>
                <option value="Category1">Category1</option>
                <option value="Category2">Category2</option>
                <option value="Category3">Category3</option>
            </select>
            <button
                onClick={onSearch}
                className="px-4 py-2 text-white rounded bg-success-500"
            >
                Search
            </button>
        </div>
    );
}
