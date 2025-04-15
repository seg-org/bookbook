"use client";

import { TransactionStatus } from "@prisma/client";
import Image from "next/image";

import { useTransactionAdminContext } from "@/context/transactionAdminContext";
import { Transaction } from "@/data/dto/transaction.dto";

const cap_overflow_string = (str: string) => {
  if (str.length >= 30) return str.substring(0, 30) + "...";
  else return str;
};

const TransactionBox = ({ transaction }: { transaction: Transaction }) => {
  const { setSelectingTransaction } = useTransactionAdminContext();

  const statusMap: Record<TransactionStatus, { label: string; color: string }> = {
    [TransactionStatus.PACKING]: { label: "กำลังเตรียม", color: "text-gray-300" },
    [TransactionStatus.DELIVERING]: { label: "จัดส่ง", color: "text-gray-300" },
    [TransactionStatus.COMPLETE]: { label: "สำเร็จ", color: "text-green-500" },
    [TransactionStatus.HOLD]: { label: "ตรวจสอบ", color: "text-yellow-500" },
    [TransactionStatus.FAIL]: { label: "ยกเลิก", color: "text-red-500" },
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details for transaction: ${cap_overflow_string(transaction.post.book.title)}`}
      className="flex transform flex-row items-center justify-start gap-x-0 rounded-lg border border-gray-300 bg-white p-2 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      onClick={() => {
        setSelectingTransaction(transaction.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setSelectingTransaction(transaction.id);
        }
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
                {"แก้ไขล่าสุด : "}
                {transaction.updatedAt.toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {transaction.updatedAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
              </label>
              <label className="text-md text-gray-400">
                {"สร้าง : "}
                {transaction.createdAt.toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {transaction.createdAt.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
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
      </div>
    </div>
  );
};

export default TransactionBox;
