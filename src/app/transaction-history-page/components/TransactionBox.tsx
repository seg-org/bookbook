"use client";

import { TransactionStatus } from "@prisma/client";
import Image from "next/image";

import { useTransactionContext } from "@/context/transactionContext";
import { Transaction } from "@/data/dto/transaction.dto";

import BoughtIcon from "../pic/boughtIcon.png";
import SoldIcon from "../pic/soldIcon.png";

const cap_overflow_string = (str: string) => {
  if (str.length >= 30) return str.substring(0, 30) + "...";
  else return str;
};

const TransactionBox = ({ transaction }: { transaction: Transaction }) => {
  const { userId, setSelectingTransaction } = useTransactionContext();

  const statusMap: Record<TransactionStatus, { label: string; color: string }> = {
    [TransactionStatus.PACKING]: { label: "กำลังเตรียม", color: "text-gray-300" },
    [TransactionStatus.DELIVERING]: { label: "จัดส่ง", color: "text-gray-300" },
    [TransactionStatus.COMPLETE]: { label: "สำเร็จ", color: "text-green-500" },
    [TransactionStatus.HOLD]: { label: "ตรวจสอบ", color: "text-yellow-500" },
    [TransactionStatus.FAIL]: { label: "ยกเลิก", color: "text-red-500" },
  };

  return (
    <div
      className="flex transform flex-row items-center justify-start gap-x-0 rounded-lg border border-gray-300 bg-white p-2 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      onClick={() => {
        setSelectingTransaction(transaction.id);
      }}
    >
      <Image
        className="m-2.5 h-40 w-auto rounded-lg"
        src={transaction.post.book.coverImageUrl}
        alt="Book Cover"
        height={160}
        width={90}
      ></Image>
      <div className="flex h-full w-full flex-col p-3">
        <div className="flex h-full flex-row justify-between space-x-2.5">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col">
              <label className="text-xl font-semibold">{cap_overflow_string(transaction.post.book.title)}</label>
              <label className="text-md text-gray-400">
                {transaction.createdAt.toDateString()} {String(transaction.createdAt.getHours()).padStart(2, "0")}:
                {String(transaction.createdAt.getMinutes()).padStart(2, "0")}
              </label>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start text-xl font-bold">
            <label className={`text-xl ${statusMap[transaction.status]?.color} whitespace-nowrap`}>
              {statusMap[transaction.status]?.label}
            </label>
          </div>
        </div>
        <div className="flex flex-row justify-start">
          <label className="text-xl">{transaction.amount}.-</label>
        </div>
        <div className="absolute bottom-2.5 right-2.5 flex flex-row justify-end space-x-2.5">
          {(userId == transaction.buyerId && <Image src={BoughtIcon} alt="" width={25} height={25}></Image>) ||
            (userId == transaction.sellerId && <Image src={SoldIcon} alt="" width={25} height={25}></Image>)}
        </div>
      </div>
    </div>
  );
};

export default TransactionBox;
