import { useTransactionContext } from "@/context/transactionContext";

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

const FilterBar = () => {
  const { filter, totalBuy, totalSell } = useTransactionContext();

  return (
    <div className="flex flex-col items-center justify-between bg-blue-400 p-2.5 shadow-xl lg:flex-row">
      <div className="flex flex-row justify-start space-x-5">
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-white">ตั้งแต่วันที่</label>
          <input
            className="transform rounded-lg border border-gray-300 p-1 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            type="date"
            onChange={(e) => filter.setStartDate(e.target.value ? new Date(e.target.value) : beginningOfTime)}
          />
          <label className="font-medium text-white">ถึงวันที่</label>
          <input
            className="transform rounded-lg border border-gray-300 p-1 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            type="date"
            onChange={(e) => filter.setEndDate(e.target.value ? new Date(e.target.value) : endOfTime)}
          />
        </div>
        <div className="h-auto border-l-2 border-blue-300"></div>
        <div className="flex flex-row items-center space-x-2.5">
          <button
            className={`h-10 w-20 rounded-lg ${filter.asBuyer ? "bg-indigo-500 text-white" : "bg-blue-200 text-gray-600"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
            onClick={() => filter.setAsBuyer(!filter.asBuyer)}
          >
            ซื้อ
          </button>
          <button
            className={`h-10 w-20 rounded-lg ${filter.asSeller ? "bg-indigo-500 text-white" : "bg-blue-200 text-gray-600"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
            onClick={() => filter.setAsSeller(!filter.asSeller)}
          >
            ขาย
          </button>
        </div>
        <div className="h-auto border-l-2 border-blue-300"></div>
        <div className="flex flex-row items-center space-x-2.5">
          <button
            className={`h-10 w-20 rounded-lg ${filter.asSeller ? "bg-indigo-500 text-white" : "bg-blue-200 text-gray-600"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
            onClick={() => filter.setAsSeller(!filter.asSeller)}
          >
            ขาย
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start space-x-10">
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-white">ยอดซื้อ :</label>
          <label className="font-medium text-white">{totalBuy.toFixed(2).toString()}</label>
          <label className="font-medium text-white">ยอดขาย :</label>
          <label className="font-medium text-white">{totalSell.toFixed(2).toString()}</label>
        </div>
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-white">ยอดรวม :</label>
          <label className="font-medium text-white">{(totalSell - totalBuy).toFixed(2).toString()}</label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
