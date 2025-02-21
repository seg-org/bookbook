"use client";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useTransactionContext } from "@/context/transactionContext";
import { Transaction } from "@/data/dto/transaction.dto";
import { Fragment } from "react";
import LineSeparator from "./LineSperator";
import TransactionBox from "./TransactionBox";

interface CategorizedTransactions {
  Today: Transaction[];
  Yesterday: Transaction[];
  "This Month": Transaction[];
  "This Year": Transaction[];
  "Previous Years": Record<number, Transaction[]>;
}

const TransactionList = () => {
  const { userId, transactions, transactionsLoading, transactionsError } = useTransactionContext();

  const categorizedTransactions: CategorizedTransactions = {
    Today: [],
    Yesterday: [],
    "This Month": [],
    "This Year": [],
    "Previous Years": {},
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisMonth = new Date(today);
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  const thisYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

  transactions.forEach((ts) => {
    if (ts.createdAt >= today) {
      categorizedTransactions.Today.push(ts);
    } else if (ts.createdAt >= yesterday) {
      categorizedTransactions.Yesterday.push(ts);
    } else if (ts.createdAt >= thisMonth) {
      categorizedTransactions["This Month"].push(ts);
    } else if (ts.createdAt >= thisYear) {
      categorizedTransactions["This Year"].push(ts);
    } else {
      if (!categorizedTransactions["Previous Years"][ts.createdAt.getFullYear()]) {
        categorizedTransactions["Previous Years"][ts.createdAt.getFullYear()] = [];
      }
      categorizedTransactions["Previous Years"][ts.createdAt.getFullYear()].push(ts);
    }
  });

  if (userId === "") {
    return (
      <div
        key="LoginNeeded"
        className="grid h-screen flex-1 place-items-center overflow-auto text-4xl font-bold text-gray-400"
      >
        Please login to see transactions
      </div>
    );
  }
  if (transactionsLoading) {
    return <LoadingAnimation key="loading" />;
  }
  if (transactionsError) {
    return (
      <div
        key="Fail"
        className="grid h-screen flex-1 place-items-center overflow-auto text-4xl font-bold text-gray-400"
      >
        Failed to get transactions
      </div>
    );
  }
  if (transactions.length == 0) {
    return (
      <div
        key="NoFound"
        className="grid h-screen flex-1 place-items-center overflow-auto text-4xl font-bold text-gray-400"
      >
        No transaction found
      </div>
    );
  }

  const sortTransactions = (tsList: Transaction[]) =>
    tsList.sort((a, b) => -(a.createdAt.getTime() - b.createdAt.getTime()));
  const categories: Array<keyof CategorizedTransactions> = ["Today", "Yesterday", "This Month", "This Year"];

  return (
    <div className="5xl:grid-cols_5 3xl:grid-cols-4 grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const transactionsList = categorizedTransactions[category];

        if (Array.isArray(transactionsList) && transactionsList.length === 0) {
          return null;
        } else if (Array.isArray(transactionsList)) {
          return (
            <Fragment key={category}>
              <LineSeparator text={category.toString()} />
              {sortTransactions(transactionsList).map((ts) => (
                <TransactionBox key={ts.id} transaction={ts} />
              ))}
            </Fragment>
          );
        } else {
          return null;
        }
      })}

      {Object.entries(categorizedTransactions["Previous Years"]).map(([year, transactionsList]) => (
        <Fragment key={year}>
          <LineSeparator text={year.toString()} />
          {sortTransactions(transactionsList).map((ts) => (
            <TransactionBox key={ts.id} transaction={ts} />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default TransactionList;
