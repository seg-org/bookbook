"use client";
import { createContext, useContext } from "react";

import { Transaction } from "@/data/dto/transaction.dto";

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

export interface TransactionAdminFilter {
  startDate: Date;
  endDate: Date;
  isPacking: boolean;
  isDelivering: boolean;
  isHold: boolean;
  isComplete: boolean;
  isFail: boolean;
  setStartDate: (newDate: Date) => void;
  setEndDate: (newDate: Date) => void;
  setIsPacking: (val: boolean) => void;
  setIsDelivering: (val: boolean) => void;
  setIsHold: (val: boolean) => void;
  setIsComplete: (val: boolean) => void;
  setIsFail: (val: boolean) => void;
}

export interface TransactionAdminPaginator {
  selectingPage: number;
  transactionPerPage: number;
  setSelectingPage: (nextPage: number) => void;
}

interface TransactionAdminContext {
  userId: string;
  filter: TransactionAdminFilter;
  paginator: TransactionAdminPaginator;
  totalAmount: number;
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: Error | null;
  transactionCount: number;
  transactionCountLoading: boolean;
  transactionCountError: Error | null;
  transactionAmountLoading: boolean;
  transactionAmountError: Error | null;
  selectingTransaction: string;
  setSelectingTransaction: (val: string) => void;
}

export const TransactionAdminContext = createContext<TransactionAdminContext>({
  userId: "",
  filter: {
    startDate: beginningOfTime,
    endDate: endOfTime,
    isPacking: true,
    isDelivering: true,
    isHold: true,
    isComplete: true,
    isFail: true,
    setStartDate: () => {},
    setEndDate: () => {},
    setIsPacking: () => {},
    setIsDelivering: () => {},
    setIsHold: () => {},
    setIsComplete: () => {},
    setIsFail: () => {},
  },
  paginator: {
    selectingPage: 1,
    transactionPerPage: 20,
    setSelectingPage: () => {},
  },
  totalAmount: 0,
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionCount: 0,
  transactionCountLoading: false,
  transactionCountError: null,
  transactionAmountLoading: false,
  transactionAmountError: null,
  selectingTransaction: "",
  setSelectingTransaction: () => {},
});

export const useTransactionAdminContext = () => {
  return useContext(TransactionAdminContext);
};
