interface Props {
  pageNumber: number;
  selectingPage: number;
  setSelectingPage: (selectingPage: number) => void;
}

const PageBox = ({ pageNumber, setSelectingPage, selectingPage }: Props) => {
  if (pageNumber == -1) {
    return (
      <div
        className="flex h-10 w-10 transform items-center justify-center rounded-lg border border-gray-300 bg-white text-black shadow transition-all duration-300 hover:scale-110"
        onClick={() => setSelectingPage(selectingPage - 1)}
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
        onClick={() => setSelectingPage(selectingPage + 1)}
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
      className={`${pageNumber === selectingPage ? "bg-blue-500" : "bg-white"} {}transform duration-300" flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-black shadow transition-all hover:scale-110`}
      onClick={() => setSelectingPage(pageNumber)}
    >
      {pageNumber}
    </div>
  );
};

export default PageBox;
