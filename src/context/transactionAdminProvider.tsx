"use client";

import { useSession } from "next-auth/react";
import { FC, PropsWithChildren, useMemo, useState } from "react";

import {
  useGetQueryTransaction,
  useGetTransactionAmount,
  useGetTransactionCount,
} from "@/hooks/useGetTransactionsAdmin";
import { TransactionAdminContext } from "./transactionAdminContext";
import { beginningOfTime, endOfTime } from "@/constants/date";

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
    [startDate, endDate, isPacking, isDelivering, isHold, isComplete, isFail],
  );

  const [selectingPage, setSelectingPage] = useState(1);
  const paginator = useMemo(
    () => ({
      selectingPage,
      transactionPerPage,
      setSelectingPage,
    }),
    [selectingPage],
  );

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useGetQueryTransaction(filter, paginator);
  const {
    transactionCount,
    loading: transactionCountLoading,
    error: transactionCountError,
  } = useGetTransactionCount(filter);
  const {
    transactionAmount: totalAmount,
    loading: transactionAmountLoading,
    error: transactionAmountError,
  } = useGetTransactionAmount(filter);

  const [selectingTransaction, setSelectingTransaction] = useState("");

  return (
    <TransactionAdminContext.Provider
      value={{
        userId,
        filter,
        paginator,
        totalAmount,
        transactions,
        transactionsLoading,
        transactionsError,
        transactionCount,
        transactionCountLoading,
        transactionCountError,
        transactionAmountLoading,
        transactionAmountError,
        selectingTransaction,
        setSelectingTransaction,
      }}
    >
      {children}
    </TransactionAdminContext.Provider>
  );
};
