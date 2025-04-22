import { usePostContext } from "@/context/postContext";

export const Pagination = () => {
  const { pagination, setPostsFilters } = usePostContext();
  if (!pagination) return null;

  const { page, totalPages } = pagination;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPostsFilters((prev) => ({ ...prev, page }));
    }
  };

  const getVisiblePages = () => {
    const maxVisible = 20;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, page - Math.floor((maxVisible - 4) / 2));
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
      {page > 1 && (
        <button className="p-2 text-blue-500" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
      )}

      {visiblePages.map((pageNumber, idx) =>
        typeof pageNumber === "number" ? (
          <button
            key={idx}
            className={`p-2 ${page === pageNumber ? "bg-blue-500 text-white" : "text-blue-500"}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ) : (
          <span key={idx} className="p-2 text-gray-500">
            ...
          </span>
        ),
      )}

      {page < totalPages && (
        <button className="p-2 text-blue-500" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      )}
    </div>
  );
};
