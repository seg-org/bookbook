"use client";

import { useSession } from "next-auth/react";
import { FC, PropsWithChildren, useMemo, useState } from "react";

import {
  useGetQueryTransaction,
  useGetTransactionBuyAmount,
  useGetTransactionCount,
  useGetTransactionSellAmount,
} from "@/hooks/useGetTransactions";

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
  const [isDelivering, setIsDelivering] = useState(true);
  const [isHold, setIsHold] = useState(true);
  const [isCompleted, setIsCompleted] = useState(true);
  const [isFailed, setIsFailed] = useState(true);
  const filter = useMemo(
    () => ({
      startDate,
      endDate,
      asBuyer,
      asSeller,
      isDelivering,
      isHold,
      isCompleted,
      isFailed,
      setStartDate,
      setEndDate,
      setAsBuyer,
      setAsSeller,
      setIsDelivering,
      setIsHold,
      setIsCompleted,
      setIsFailed,
    }),
    [startDate, endDate, asBuyer, asSeller, isDelivering, isHold, isCompleted, isFailed]
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

  const {
    transactions,
    loading: transactionLoading,
    error: transactionError,
  } = useGetQueryTransaction(userId, filter, paginator);
  const {
    transactionCount,
    loading: transactionCountLoading,
    error: transactionCountError,
  } = useGetTransactionCount(userId, filter);
  const {
    transactionBuyAmount,
    loading: transactionAmountBuyLoading,
    error: transactionAmountBuyError,
  } = useGetTransactionBuyAmount(userId, filter);
  const {
    transactionSellAmount,
    loading: transactionAmountSellLoading,
    error: transactionAmountSellError,
  } = useGetTransactionSellAmount(userId, filter);

  const [selectingTransaction, setSelectingTransaction] = useState("");

  return (
    <TransactionContext.Provider
      value={{
        userId,
        filter,
        paginator,
        totalBuy: transactionBuyAmount,
        totalSell: transactionSellAmount,
        transactions,
        transactionsLoading: transactionLoading,
        transactionsError: transactionError,
        transactionCount: transactionCount,
        transactionCountLoading: transactionCountLoading,
        transactionCountError: transactionCountError,
        transactionAmountLoading: transactionAmountBuyLoading || transactionAmountSellLoading,
        transactionAmountError: transactionAmountBuyError || transactionAmountSellError,
        selectingTransaction,
        setSelectingTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
