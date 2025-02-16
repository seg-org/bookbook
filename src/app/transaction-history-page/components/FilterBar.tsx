"use client";

export interface FilterType {
  startDate: Date | null;
  endDate: Date | null;
  asBuyer: boolean;
  asSeller: boolean;
}

interface setStateProps {
  filter: FilterType;
  setFilter: (newdata: FilterType) => void;
  totalBuy: number;
  totalSell: number;
}

// Note 2: The pop=up calendar can not be configured
const FilterBar = ({ filter, setFilter, totalBuy, totalSell }: setStateProps) => {
  return (
    <div className="flex flex-col items-center justify-between p-2.5 lg:flex-row">
      <div className="flex flex-row justify-start space-x-5">
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-gray-800">ตั้งแต่วันที่</label>
          <input
            className="transform rounded-lg border border-gray-300 p-1 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            type="date"
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value ? new Date(e.target.value) : null })}
          />
          <label className="font-medium text-gray-800">ถึงวันที่</label>
          <input
            className="transform rounded-lg border border-gray-300 p-1 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            type="date"
            onChange={(e) =>
              setFilter({
                ...filter,
                endDate: e.target.value
                  ? new Date(new Date(e.target.value).setDate(new Date(e.target.value).getDate() + 1))
                  : null,
              })
            }
          />
        </div>
        <div className="flex flex-row items-center space-x-2.5">
          <input
            className="h-5 w-5 transition-transform duration-200"
            type="checkbox"
            checked={filter.asBuyer}
            onChange={(e) => setFilter({ ...filter, asBuyer: e.target.checked })}
          />
          <label className="font-medium text-gray-800">ซื้อ</label>
          <input
            className="h-5 w-5 transition-transform duration-200"
            type="checkbox"
            checked={filter.asSeller}
            onChange={(e) => setFilter({ ...filter, asSeller: e.target.checked })}
          />
          <label className="font-medium text-gray-800">ขาย</label>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start space-x-10">
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-gray-800">ยอดซื้อ :</label>
          <label className="font-medium text-gray-800">{totalBuy.toFixed(2).toString()}</label>
          <label className="font-medium text-gray-800">ยอดขาย :</label>
          <label className="font-medium text-gray-800">{totalSell.toFixed(2).toString()}</label>
        </div>
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-gray-800">ยอดรวม :</label>
          <label className="font-medium text-gray-800">{(totalSell - totalBuy).toFixed(2).toString()}</label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
