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
const transactionPerPage = 20;

export const TransactionProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [startDate, setStartDate] = useState<Date>(beginningOfTime);
  const [endDate, setEndDate] = useState<Date>(endOfTime);
  const [asBuyer, setAsBuyer] = useState(true);
  const [asSeller, setAsSeller] = useState(true);
  const [isPacking, setIsPacking] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const filter = useMemo(
    () => ({
      startDate,
      endDate,
      asBuyer,
      asSeller,
      isPacking,
      isDelivering,
      isHold,
      isComplete,
      isFail,
      setStartDate,
      setEndDate,
      setAsBuyer,
      setAsSeller,
      setIsPacking,
      setIsDelivering,
      setIsHold,
      setIsComplete,
      setIsFail,
    }),
    [startDate, endDate, asBuyer, asSeller, isPacking, isDelivering, isHold, isComplete, isFail]
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
