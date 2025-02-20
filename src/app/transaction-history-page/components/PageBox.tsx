import { TransactionContext } from "@/context/transactionContext";
import { useContext } from "react";

const PageBox = ({ pageNumber }: { pageNumber: number }) => {
  const { paginator } = useContext(TransactionContext);
  if (pageNumber == -1) {
    return (
      <div
        className="flex h-10 w-10 transform items-center justify-center rounded-lg border border-gray-300 bg-white text-black shadow transition-all duration-300 hover:scale-110"
        onClick={() => paginator.setSelectingPage(paginator.selectingPage - 1)}
      >
        {"<"}
      </div>
    );
  }
  if (pageNumber == -2) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-400 text-black shadow">
        {"<"}
      </div>
    );
  }
  if (pageNumber == -3) {
    return (
      <div
        className="flex h-10 w-10 transform items-center justify-center rounded-lg border border-gray-300 bg-white text-black shadow transition-all duration-300 hover:scale-110"
        onClick={() => paginator.setSelectingPage(paginator.selectingPage + 1)}
      >
        {">"}
      </div>
    );
  }
  if (pageNumber == -4) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-400 text-black shadow">
        {">"}
      </div>
    );
  }

  return (
    <div
      className={`${pageNumber === paginator.selectingPage ? "bg-blue-500" : "bg-white"} {}transform duration-300" flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-black shadow transition-all hover:scale-110`}
      onClick={() => paginator.setSelectingPage(pageNumber)}
    >
      {pageNumber}
    </div>
  );
};

export default PageBox;
