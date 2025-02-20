"use client";

import Image from "next/image";

import { TransactionContext } from "@/context/transactionContext";
import { Transaction } from "@/data/dto/transaction.dto";
import { TransactionStatus } from "@prisma/client";
import { useContext } from "react";
import BoughtIcon from "../pic/boughtIcon.png";
import SoldIcon from "../pic/soldIcon.png";

const cap_overflow_string = (str: string) => {
  if (str.length >= 30) return str.substring(0, 30) + "...";
  else return str;
};

const TransactionBox = ({ transaction }: { transaction: Transaction }) => {
  const { userId, setSelectingTransaction } = useContext(TransactionContext);

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
        {(transaction.status == TransactionStatus.APPROVING && <label className="text-gray-300">Approving</label>) ||
          (transaction.status == TransactionStatus.PAYING && <label className="text-gray-300">Paying</label>) ||
          (transaction.status == TransactionStatus.PACKING && <label className="text-gray-300">Packing</label>) ||
          (transaction.status == TransactionStatus.DELIVERING && <label className="text-gray-300">Delivering</label>) ||
          (transaction.status == TransactionStatus.COMPLETE && <label className="text-green-500">Complete</label>) ||
          (transaction.status == TransactionStatus.HOLD && <label className="text-yellow-500">Hold</label>) ||
          (transaction.status == TransactionStatus.FAIL && <label className="text-red-500">Failed</label>)}
      </div>

      <div className="absolute bottom-2 right-2">
        {(userId == transaction.buyerId && <Image src={BoughtIcon} alt="" width={25} height={25}></Image>) ||
          (userId == transaction.sellerId && <Image src={SoldIcon} alt="" width={25} height={25}></Image>)}
      </div>
    </div>
  );
};

export default TransactionBox;
