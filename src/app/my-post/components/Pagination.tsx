import { useState } from "react";

type PaginationProps = {
  totalPages: number;
  setPage: (page: number) => void;
  page: number;
};

export const Pagination = ({ totalPages, setPage, page }: PaginationProps) => {
  const [currentPage, setCurrentpage] = useState(page);

  const handlePageChange = (page: number) => {
    setCurrentpage(page);
    setPage(page);
  };

  return (
    <div className="mt-4 flex items-center justify-center space-x-2 pb-2">
      {currentPage > 1 && (
        <button
          className="p-2 text-blue-500"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          className={`p-2 ${currentPage === pageNumber ? "bg-blue-500 text-white" : "text-blue-500"}`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className="p-2 text-blue-500"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      )}
    </div>
  );
};
