"use client";
import Image from "next/image";

import { beginningOfTime, endOfTime } from "@/constants/date";
import { useTransactionAdminContext } from "@/context/transactionAdminContext";

import SoldIcon from "../pic/soldIcon.png";

const FilterBar = () => {
  const context = useTransactionAdminContext();

  if (!context) {
    return <div>Error: Transaction context not available</div>;
  }

  const { filter, paginator, totalAmount } = context;

  return (
    <div className="flex flex-col items-center justify-between space-y-2.5 bg-blue-400 p-2.5 pl-6 pr-6 shadow-xl 2xl:flex-row 2xl:space-y-0">
      <div className="flex flex-col justify-start space-x-0 space-y-1.5 xl:flex-row xl:space-x-2.5 xl:space-y-0">
        <div className="flex flex-row items-center justify-start space-x-2.5 pl-12 xl:justify-center xl:space-x-2.5 xl:pl-0">
          <label className="font-medium text-white">ตั้งแต่วันที่</label>
          <input
            className="transform rounded-lg border border-gray-300 p-1 text-blue-950 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            type="date"
            aria-label="Start date filter"
            onChange={(e) => filter.setStartDate(e.target.value ? new Date(e.target.value) : beginningOfTime)}
          />
          <label className="font-medium text-white">ถึงวันที่</label>
          <input
            className="transform rounded-lg border border-gray-300 p-1 text-blue-950 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            type="date"
            aria-label="End date filter"
            onChange={(e) => filter.setEndDate(e.target.value ? new Date(e.target.value) : endOfTime)}
          />
        </div>
        <div className="h-auto border-l-2 border-blue-300 lg:block"></div>
        <div className="item-center flex flex-row justify-center space-x-2.5 lg:space-y-0">
          <div className="flex flex-row items-center space-x-2.5">
            <button
              className={`h-10 w-28 rounded-lg ${filter.isPacking ? "bg-indigo-500 text-white" : "bg-gray-200 text-sky-950"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
              onClick={() => {
                filter.setIsPacking(!filter.isPacking);
                filter.setIsHold(false);
                paginator.setSelectingPage(1);
              }}
            >
              กำลังเตรียม
            </button>
            <button
              className={`h-10 w-20 rounded-lg ${filter.isDelivering ? "bg-indigo-500 text-white" : "bg-gray-200 text-sky-950"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
              onClick={() => {
                filter.setIsDelivering(!filter.isDelivering);
                filter.setIsHold(false);
                paginator.setSelectingPage(1);
              }}
            >
              จัดส่ง
            </button>
            <button
              className={`h-10 w-20 rounded-lg ${filter.isComplete ? "bg-indigo-500 text-white" : "bg-gray-200 text-sky-950"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
              onClick={() => {
                filter.setIsComplete(!filter.isComplete);
                filter.setIsHold(false);
                paginator.setSelectingPage(1);
              }}
            >
              สำเร็จ
            </button>
            <button
              className={`h-10 w-20 rounded-lg ${filter.isFail ? "bg-indigo-500 text-white" : "bg-gray-200 text-sky-950"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
              onClick={() => {
                filter.setIsFail(!filter.isFail);
                filter.setIsHold(false);
                paginator.setSelectingPage(1);
              }}
            >
              ยกเลิก
            </button>
          </div>
          <div className="h-auto border-l-2 border-blue-300 lg:block"></div>
          <button
            className={`h-10 w-20 rounded-lg ${filter.isHold ? "bg-indigo-500 text-white" : "bg-gray-200 text-sky-950"} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
            onClick={() => {
              if (!filter.isHold) {
                filter.setIsPacking(false);
                filter.setIsDelivering(false);
                filter.setIsComplete(false);
                filter.setIsFail(false);
              }
              filter.setIsHold(!filter.isHold);
              paginator.setSelectingPage(1);
            }}
          >
            ตรวจสอบ
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-center space-x-5">
        <div className="flex h-10 flex-row items-center space-x-2.5 rounded-lg bg-white p-2">
          <Image src={SoldIcon} alt="" width={30} height={30}></Image>
          <label className="font-medium text-blue-950">{totalAmount.toFixed(2).toString()}</label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
