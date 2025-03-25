import { useTransactionContext } from "@/context/transactionContext";

const PageBox = ({ pageNumber }: { pageNumber: number }) => {
  const {
    paginator,
    paginator: { selectingPage },
  } = useTransactionContext();
  if (pageNumber == -1) {
    return (
      <div
        className="flex h-10 w-10 transform items-center justify-center rounded-lg border border-gray-300 bg-white text-blue-950 shadow transition-all duration-300 hover:scale-110"
        onClick={() => paginator.setSelectingPage(selectingPage - 1)}
      >
        {"<"}
      </div>
    );
  }
  if (pageNumber == -2) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-300 text-blue-950 shadow">
        {"<"}
      </div>
    );
  }
  if (pageNumber == -3) {
    return (
      <div
        className="flex h-10 w-10 transform items-center justify-center rounded-lg border border-gray-300 bg-white text-blue-950 shadow transition-all duration-300 hover:scale-110"
        onClick={() => paginator.setSelectingPage(selectingPage + 1)}
      >
        {">"}
      </div>
    );
  }
  if (pageNumber == -4) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-300 text-blue-950 shadow">
        {">"}
      </div>
    );
  }

  return (
    <div
      className={`${pageNumber === selectingPage ? "bg-indigo-500" : "bg-white"} {}transform duration-300" flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-blue-950 shadow transition-all hover:scale-110`}
      onClick={() => paginator.setSelectingPage(pageNumber)}
    >
      {pageNumber}
    </div>
  );
};

export default PageBox;
