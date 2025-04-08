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

  return (
    <div className="mt-4 flex items-center justify-center space-x-2">
      {page > 1 && (
        <button className="p-2 text-blue-500" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          className={`p-2 ${page === pageNumber ? "bg-blue-500 text-white" : "text-blue-500"}`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {page < totalPages && (
        <button className="p-2 text-blue-500" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      )}
    </div>
  );
};
