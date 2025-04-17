"use client";

import { Fragment } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useTransactionAdminContext } from "@/context/transactionAdminContext";
import { Transaction } from "@/data/dto/transaction.dto";

import LineSeparator from "./LineSeperator";
import TransactionBox from "./TransactionBox";

interface CategorizedTransactions {
  Today: Transaction[];
  Yesterday: Transaction[];
  "This Month": Transaction[];
  "This Year": Transaction[];
  "Previous Years": Record<number, Transaction[]>;
}

const TransactionList = () => {
  const { userId, filter, transactions, transactionsLoading, transactionsError } = useTransactionAdminContext();

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
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

  if (userId === "") {
    return (
      <div
        key="LoginNeeded"
        className="grid h-screen flex-1 place-items-center overflow-auto text-4xl font-bold text-gray-400"
      >
        กรุณาเข้าสู่ระบบ
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
        เกิดข้อผิดพลาด
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

  const sortTransactionsCreateDesc = (tsList: Transaction[]) =>
    tsList.sort((a, b) => -(a.createdAt.getTime() - b.createdAt.getTime()));
  const sortTransactionsUpdateAsc = (tsList: Transaction[]) =>
    tsList.sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());
  const categories: Array<keyof CategorizedTransactions> = ["Today", "Yesterday", "This Month", "This Year"];

  if (!filter.isHold) {
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

    return (
      <div className="5xl:grid-cols_5 3xl:grid-cols-4 grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3">
        {[...categories].reverse().map((category) => {
          const transactionsList = categorizedTransactions[category];

          if (Array.isArray(transactionsList) && transactionsList.length === 0) {
            return null;
          } else if (Array.isArray(transactionsList)) {
            return (
              <Fragment key={category}>
                <LineSeparator text={category.toString()} />
                {sortTransactionsCreateDesc(transactionsList).map((ts) => (
                  <TransactionBox key={ts.id} transaction={ts} />
                ))}
              </Fragment>
            );
          } else {
            return null;
          }
        })}

        {Object.entries(categorizedTransactions["Previous Years"])
          .reverse()
          .map(([year, transactionsList]) => (
            <Fragment key={year}>
              <LineSeparator text={year.toString()} />
              {sortTransactionsCreateDesc(transactionsList).map((ts) => (
                <TransactionBox key={ts.id} transaction={ts} />
              ))}
            </Fragment>
          ))}
      </div>
    );
  } else {
    transactions.forEach((ts) => {
      if (ts.updatedAt >= today) {
        categorizedTransactions.Today.push(ts);
      } else if (ts.updatedAt >= yesterday) {
        categorizedTransactions.Yesterday.push(ts);
      } else if (ts.updatedAt >= thisMonth) {
        categorizedTransactions["This Month"].push(ts);
      } else if (ts.updatedAt >= thisYear) {
        categorizedTransactions["This Year"].push(ts);
      } else {
        if (!categorizedTransactions["Previous Years"][ts.updatedAt.getFullYear()]) {
          categorizedTransactions["Previous Years"][ts.updatedAt.getFullYear()] = [];
        }
        categorizedTransactions["Previous Years"][ts.updatedAt.getFullYear()].push(ts);
      }
    });

    return (
      <div className="5xl:grid-cols_5 3xl:grid-cols-4 grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3">
        {Object.entries(categorizedTransactions["Previous Years"]).map(([year, transactionsList]) => (
          <Fragment key={year}>
            <LineSeparator text={year.toString()} />
            {sortTransactionsUpdateAsc(transactionsList).map((ts) => (
              <TransactionBox key={ts.id} transaction={ts} />
            ))}
          </Fragment>
        ))}
        {[...categories].reverse().map((category) => {
          const transactionsList = categorizedTransactions[category];

          if (Array.isArray(transactionsList) && transactionsList.length === 0) {
            return null;
          } else if (Array.isArray(transactionsList)) {
            return (
              <Fragment key={category}>
                <LineSeparator text={category.toString()} />
                {sortTransactionsUpdateAsc(transactionsList).map((ts) => (
                  <TransactionBox key={ts.id} transaction={ts} />
                ))}
              </Fragment>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
};

export default TransactionList;
