import { useState } from "react";

type PaginationProps = {
  totalPages: number;
  setPage: (page: number) => void;
  cur_page: number;
};

export const Pagination = ({ totalPages, setPage, cur_page }: PaginationProps) => {
  const [currentPage, setCurrentpage] = useState(cur_page);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentpage(page);
      setPage(page);
    }
  };

  const getVisiblePages = (): (number | string)[] => {
    const maxVisible = 20;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, currentPage - Math.floor((maxVisible - 4) / 2));
    const end = Math.min(totalPages - 1, start + maxVisible - 5);

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      {currentPage > 1 && (
        <button className="p-2 text-blue-500" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
      )}

      {visiblePages.map((pageNumber, idx) =>
        typeof pageNumber === "number" ? (
          <button
            key={idx}
            className={`p-2 ${currentPage === pageNumber ? "bg-blue-500 text-white" : "text-blue-500"}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ) : (
          <span key={idx} className="select-none p-2 text-gray-500">
            ...
          </span>
        ),
      )}

      {currentPage < totalPages && (
        <button className="p-2 text-blue-500" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      )}
    </div>
  );
};
