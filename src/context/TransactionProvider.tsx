"use client";

import { useSession } from "next-auth/react";
import { FC, PropsWithChildren, useMemo, useState } from "react";

import { useGetQueryTransaction } from "@/hooks/useGetTransactions";

import { TransactionContext } from "./transactionContext";

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");
const transactionPerPage = 6;

export const TransactionProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [startDate, setStartDate] = useState<Date>(beginningOfTime);
  const [endDate, setEndDate] = useState<Date>(endOfTime);
  const [asBuyer, setAsBuyer] = useState(true);
  const [asSeller, setAsSeller] = useState(true);
  const filter = useMemo(
    () => ({
      startDate,
      endDate,
      asBuyer,
      asSeller,
      setStartDate,
      setEndDate,
      setAsBuyer,
      setAsSeller,
    }),
    [startDate, endDate, asBuyer, asSeller]
  );

  const [selectingPage, setSelectingPage] = useState(1);
  const paginator = useMemo(
    () => ({
      selectingPage,
      transactionPerPage,
      setSelectingPage,
    }),
    [selectingPage]
  );

  const { transactions, loading, error } = useGetQueryTransaction(userId, filter, paginator);
  const [totalBuy, totalSell] = useMemo(() => {
    let newTotalBuy = 0;
    let newTotalSell = 0;
    transactions.map((ts) => {
      if (ts.buyerId == userId) newTotalBuy += ts.amount;
      if (ts.sellerId == userId) newTotalSell += ts.amount;
    });
    return [newTotalBuy, newTotalSell];
  }, [userId, transactions]);

  const [selectingTransaction, setSelectingTransaction] = useState("");

  return (
    <TransactionContext.Provider
      value={{
        userId,
        filter,
        paginator,
        totalBuy,
        totalSell,
        transactions,
        transactionsLoading: loading,
        transactionsError: error,
        selectingTransaction,
        setSelectingTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
