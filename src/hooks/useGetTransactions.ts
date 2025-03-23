"use client";

import { useEffect, useState } from "react";

import { TransactionFilter, TransactionPaginator } from "@/context/transactionContext";
import { Transaction } from "@/data/dto/transaction.dto";
import { getQueryTransaction, getTransaction, getTransactionAmount, getTransactionCount } from "@/data/transaction";

export const useGetQueryTransaction = (userId: string, filter: TransactionFilter, paginator: TransactionPaginator) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactions([]);

      if (userId) {
        const res = await getQueryTransaction({
          userId: userId,
          startDate: filter.startDate,
          endDate: filter.endDate,
          asBuyer: filter.asBuyer,
          asSeller: filter.asSeller,
          skip: (paginator.selectingPage - 1) * paginator.transactionPerPage,
          take: paginator.transactionPerPage,
        });
        if (res instanceof Error) {
          setLoading(false);
          return setError(res);
        }

        setTransactions(res);
      }

      setLoading(false);
    })();
  }, [userId, filter, paginator]);

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

export const useGetTransactionBuyAmount = (userId: string, filter: TransactionFilter) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionBuyAmount, setTransactionsAmount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactionsAmount(0);

      if (userId) {
        const res = await getTransactionAmount({
          userId: userId,
          startDate: filter.startDate,
          endDate: filter.endDate,
          asBuyer: filter.asBuyer,
          asSeller: false,
        });
        if (res instanceof Error) {
          setLoading(false);
          return setError(res);
        }

        setTransactionsAmount(res);
      }

      setLoading(false);
    })();
  }, [userId, filter]);

  return { transactionBuyAmount, loading, error };
};

export const useGetTransactionSellAmount = (userId: string, filter: TransactionFilter) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionSellAmount, setTransactionsAmount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactionsAmount(0);

      if (userId) {
        const res = await getTransactionAmount({
          userId: userId,
          startDate: filter.startDate,
          endDate: filter.endDate,
          asBuyer: false,
          asSeller: filter.asSeller,
        });
        if (res instanceof Error) {
          setLoading(false);
          return setError(res);
        }

        setTransactionsAmount(res);
      }

      setLoading(false);
    })();
  }, [userId, filter]);

  return { transactionSellAmount, loading, error };
};

export const useGetTransactionCount = (userId: string, filter: TransactionFilter) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionCount, setTransactionsCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setTransactionsCount(0);

      if (userId) {
        const res = await getTransactionCount({
          userId: userId,
          startDate: filter.startDate,
          endDate: filter.endDate,
          asBuyer: filter.asBuyer,
          asSeller: filter.asSeller,
        });
        if (res instanceof Error) {
          setLoading(false);
          return setError(res);
        }

        setTransactionsCount(res);
      }

      setLoading(false);
    })();
  }, [userId, filter]);

  return { transactionCount, loading, error };
};
