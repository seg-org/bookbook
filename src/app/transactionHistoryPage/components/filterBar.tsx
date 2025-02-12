// Note 1: Waiting for global font
// Note 2: The pop=up calendat can not be configured
const FilterBar = () => {
  return (
    <div className="flex flex-col items-center justify-between p-2.5 lg:flex-row">
      <div className="flex flex-row justify-start space-x-5">
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-gray-800">ตั้งแต่วันที่</label>
          <input className="rounded-lg border border-gray-300 p-1" type="date" />
          <label className="font-medium text-gray-800">ถึงวันที่</label>
          <input className="rounded-lg border border-gray-300 p-1" type="date" />
        </div>
        <div className="flex flex-row items-center space-x-2.5">
          <input className="h-5 w-5" type="checkbox" />
          <label className="font-medium text-gray-800">ซื้อ</label>
          <input className="h-5 w-5" type="checkbox" />
          <label className="font-medium text-gray-800">ขาย</label>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start space-x-10">
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-gray-800">ยอดซื้อ :</label>
          <label className="font-medium text-gray-800">30.0</label>
          <label className="font-medium text-gray-800">ยอดขาย :</label>
          <label className="font-medium text-gray-800">70.0</label>
        </div>
        <div className="flex flex-row items-center space-x-2.5">
          <label className="font-medium text-gray-800">ยอดรวม :</label>
          <label className="font-medium text-gray-800">40.0</label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
