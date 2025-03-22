import { createContext, useContext } from "react";

import { Transaction } from "@/data/dto/transaction.dto";

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

export interface TransactionFilter {
  startDate: Date;
  endDate: Date;
  asBuyer: boolean;
  asSeller: boolean;
  isDelivering: boolean;
  isHold: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  setStartDate: (newDate: Date) => void;
  setEndDate: (newDate: Date) => void;
  setAsBuyer: (val: boolean) => void;
  setAsSeller: (val: boolean) => void;
  setIsDelivering: (val: boolean) => void;
  setIsHold: (val: boolean) => void;
  setIsCompleted: (val: boolean) => void;
  setIsFailed: (val: boolean) => void;
}

export interface TransactionPaginator {
  selectingPage: number;
  transactionPerPage: number;
  setSelectingPage: (nextPage: number) => void;
}

interface TransactionContext {
  userId: string;
  filter: TransactionFilter;
  paginator: TransactionPaginator;
  totalBuy: number;
  totalSell: number;
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: Error | null;
  selectingTransaction: string;
  setSelectingTransaction: (val: string) => void;
}

export const TransactionContext = createContext<TransactionContext>({
  userId: "",
  filter: {
    startDate: beginningOfTime,
    endDate: endOfTime,
    asBuyer: true,
    asSeller: true,
    isDelivering: true,
    isHold: true,
    isCompleted: true,
    isFailed: true,
    setStartDate: () => {},
    setEndDate: () => {},
    setAsBuyer: () => {},
    setAsSeller: () => {},
    setIsDelivering: () => {},
    setIsHold: () => {},
    setIsCompleted: () => {},
    setIsFailed: () => {},
  },
  paginator: {
    selectingPage: 1,
    transactionPerPage: 20,
    setSelectingPage: () => {},
  },
  totalBuy: 0,
  totalSell: 0,
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  selectingTransaction: "",
  setSelectingTransaction: () => {},
});

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};
