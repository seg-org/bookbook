"use client";

import Image from "next/image";

import { useTransactionContext } from "@/context/transactionContext";
import { Transaction } from "@/data/dto/transaction.dto";
import { TransactionStatus } from "@prisma/client";
import BoughtIcon from "../pic/boughtIcon.png";
import SoldIcon from "../pic/soldIcon.png";

const cap_overflow_string = (str: string) => {
  if (str.length >= 30) return str.substring(0, 30) + "...";
  else return str;
};

const TransactionBox = ({ transaction }: { transaction: Transaction }) => {
  const { userId, setSelectingTransaction } = useTransactionContext();

  const statusMap: Record<TransactionStatus, { label: string; color: string }> = {
    [TransactionStatus.APPROVING]: { label: "Approving", color: "text-gray-300" },
    [TransactionStatus.PAYING]: { label: "Paying", color: "text-gray-300" },
    [TransactionStatus.PACKING]: { label: "Packing", color: "text-gray-300" },
    [TransactionStatus.DELIVERING]: { label: "Delivering", color: "text-gray-300" },
    [TransactionStatus.COMPLETE]: { label: "Complete", color: "text-green-500" },
    [TransactionStatus.HOLD]: { label: "Hold", color: "text-yellow-500" },
    [TransactionStatus.FAIL]: { label: "Failed", color: "text-red-500" },
  };

  return (
    <div
      className="relative flex transform flex-row items-center justify-between gap-x-5 rounded-lg border border-gray-300 bg-white p-4 transition-transform duration-200 hover:scale-105 hover:shadow-xl"
      onClick={() => {
        setSelectingTransaction(transaction.id);
      }}
    >
      <div className="flex flex-row items-center justify-start gap-5">
        <Image
          className="m-2.5 h-40 w-auto rounded-lg"
          src={transaction.post.book.coverImageUrl}
          alt="Book Cover"
          height={160}
          width={90}
        ></Image>
        <div className="flex flex-col">
          <label className="text-lg font-semibold">{cap_overflow_string(transaction.post.book.title)}</label>
          <label className="text-lg text-gray-400">
            {transaction.createdAt.toDateString()} {transaction.createdAt.getHours()}:
            {transaction.createdAt.getMinutes()}
          </label>
          <label className="text-xl">{transaction.amount}.-</label>
        </div>
      </div>

      <div className="flex flex-col items-center justify-end text-xl font-bold">
        <label className={`text-lg ${statusMap[transaction.status]?.color}`}>
          {statusMap[transaction.status]?.label}
        </label>
      </div>

      <div className="absolute bottom-2 right-2">
        {(userId == transaction.buyerId && <Image src={BoughtIcon} alt="" width={25} height={25}></Image>) ||
          (userId == transaction.sellerId && <Image src={SoldIcon} alt="" width={25} height={25}></Image>)}
      </div>
    </div>
  );
};

export default TransactionBox;
