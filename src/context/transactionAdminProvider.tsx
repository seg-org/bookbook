"use client";

import { useSession } from "next-auth/react";
import { FC, PropsWithChildren, useMemo, useState } from "react";

import {
  useGetQueryTransaction,
  useGetTransactionAmount,
  useGetTransactionCount,
} from "@/hooks/useGetTransactionsAdmin";
import { TransactionAdminContext } from "./transactionAdminContext";

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");
const transactionPerPage = 20;

export const TransactionAdminProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const [startDate, setStartDate] = useState<Date>(beginningOfTime);
  const [endDate, setEndDate] = useState<Date>(endOfTime);
  const [isPacking, setIsPacking] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isHold, setIsHold] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const filter = useMemo(
    () => ({
      startDate,
      endDate,
      isPacking,
      isDelivering,
      isHold,
      isComplete,
      isFail,
      setStartDate,
      setEndDate,
      setIsPacking,
      setIsDelivering,
      setIsHold,
      setIsComplete,
      setIsFail,
    }),
    [startDate, endDate, isPacking, isDelivering, isHold, isComplete, isFail]
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
  } = useGetQueryTransaction(filter, paginator);
  const {
    transactionCount,
    loading: transactionCountLoading,
    error: transactionCountError,
  } = useGetTransactionCount(filter);
  const {
    transactionAmount,
    loading: transactionAmountBuyLoading,
    error: transactionAmountBuyError,
  } = useGetTransactionAmount(filter);

  const [selectingTransaction, setSelectingTransaction] = useState("");

  return (
    <TransactionAdminContext.Provider
      value={{
        userId,
        filter,
        paginator,
        totalAmount: transactionAmount,
        transactions,
        transactionsLoading: transactionLoading,
        transactionsError: transactionError,
        transactionCount: transactionCount,
        transactionCountLoading: transactionCountLoading,
        transactionCountError: transactionCountError,
        transactionAmountLoading: transactionAmountBuyLoading,
        transactionAmountError: transactionAmountBuyError,
        selectingTransaction,
        setSelectingTransaction,
      }}
    >
      {children}
    </TransactionAdminContext.Provider>
  );
};
