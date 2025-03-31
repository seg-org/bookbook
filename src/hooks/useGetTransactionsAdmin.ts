"use client";

import { useEffect, useState } from "react";

import { TransactionAdminFilter, TransactionAdminPaginator } from "@/context/transactionAdminContext";
import { Transaction } from "@/data/dto/transaction.dto";
import { getQueryTransaction, getTransaction, getTransactionAmount, getTransactionCount } from "@/data/transaction";

export const useGetQueryTransaction = (filter: TransactionAdminFilter, paginator: TransactionAdminPaginator) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactions([]);

      const res = await getQueryTransaction({
        startDate: filter.startDate,
        endDate: filter.endDate,
        isPacking: filter.isPacking,
        isDelivering: filter.isDelivering,
        isHold: filter.isHold,
        isComplete: filter.isComplete,
        isFail: filter.isFail,
        skip: (paginator.selectingPage - 1) * paginator.transactionPerPage,
        take: paginator.transactionPerPage,
        ...(filter.isHold ? { sortBy: "updatedAt" } : {}),
      });
      if (res instanceof Error) {
        setLoading(false);
        return setError(res);
      }

      setTransactions(res);

      setLoading(false);
    })();
  }, [filter, paginator]);

  return { transactions, loading, error };
};

export const useGetTransaction = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transaction, setTransaction] = useState<Transaction>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransaction(undefined);

      if (id) {
        const res = await getTransaction(id);

        if (res instanceof Error) {
          setLoading(false);
          return setError(res);
        }
        setTransaction(res);
      }
      setLoading(false);
    })();
  }, [id]);

  return { transaction, loading, error };
};

export const useGetTransactionAmount = (filter: TransactionAdminFilter) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionAmount, setTransactionsAmount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactionsAmount(0);

      const res = await getTransactionAmount({
        startDate: filter.startDate,
        endDate: filter.endDate,
        isPacking: filter.isPacking,
        isDelivering: filter.isDelivering,
        isHold: filter.isHold,
        isComplete: filter.isComplete,
        isFail: filter.isFail,
      });
      if (res instanceof Error) {
        setLoading(false);
        return setError(res);
      }

      setTransactionsAmount(res);

      setLoading(false);
    })();
  }, [filter]);

  return { transactionAmount, loading, error };
};

export const useGetTransactionCount = (filter: TransactionAdminFilter) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionCount, setTransactionsCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactionsCount(0);

      const res = await getTransactionCount({
        startDate: filter.startDate,
        endDate: filter.endDate,
        isPacking: filter.isPacking,
        isDelivering: filter.isDelivering,
        isHold: filter.isHold,
        isComplete: filter.isComplete,
        isFail: filter.isFail,
      });
      if (res instanceof Error) {
        setLoading(false);
        return setError(res);
      }

      setTransactionsCount(res);

      setLoading(false);
    })();
  }, [filter]);

  return { transactionCount, loading, error };
};
