import { Transaction } from "@/data/dto/transaction.dto";
import { createContext, useContext } from "react";

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

export interface TransactionFilter {
  startDate: Date;
  endDate: Date;
  asBuyer: boolean;
  asSeller: boolean;
  setStartDate: (newDate: Date) => void;
  setEndDate: (newDate: Date) => void;
  setAsBuyer: (val: boolean) => void;
  setAsSeller: (val: boolean) => void;
}

export interface TransactionPaginator {
  selectingPage: string;
  transactionPerPage: number;
  setSelectingPage: (nextPage: string) => void;
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
    setStartDate: () => {},
    setEndDate: () => {},
    setAsBuyer: () => {},
    setAsSeller: () => {},
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
