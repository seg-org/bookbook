"use client";

import { FilterType } from "@/app/transaction-history-page/components/FilterBar";
import { Transaction } from "@/data/dto/transaction.dto";
import { getTransaction, getTransactionCount } from "@/data/transaction";
import { useEffect, useState } from "react";

export const useGetTransaction = (filter: FilterType, userId: string, skip?: number, take?: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      if(userId !== "---") {
        const res = await getTransaction(filter, userId, skip || -1, take || -1);
        if (res instanceof Error) {
          return setError(res);
        }
        
        setTransactions(res);
      }
      setLoading(false);
    })();
  }, [filter, userId, skip, take]);

  return { transactions, loading, error };
};

export const useGetTransactionCount = (filter: FilterType, userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionCount, setTransactionsCount] = useState(0);

  useEffect(() => {
    (async () => {
      if(userId !== "---") {
        const res = await getTransactionCount(filter, userId);
        if (res instanceof Error) {
          return setError(res);
        }

        setTransactionsCount(res);
      }
      setLoading(false);
    })();
  }, [filter, userId]);

  return { transactionCount, loading, error };
};
