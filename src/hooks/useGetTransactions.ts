"use client";

import { FilterType } from "@/app/transaction-history-page/components/FilterBar";
import { Transaction } from "@/data/dto/transaction.dto";
import { getQueryTransaction, getTransaction, getTransactionCount } from "@/data/transaction";
import { useEffect, useState } from "react";
import { TranscriptContextImpl } from "twilio/lib/rest/intelligence/v2/transcript";

export const useGetQueryTransaction = (filter: FilterType, userId: string, skip?: number, take?: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      if(userId !== "---") {
        const res = await getQueryTransaction(filter, userId, skip || -1, take || -1);
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

export const useGetTransaction = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transaction, setTransaction] = useState<Transaction>();
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const res = await getTransaction(id);

      if (res instanceof Error) {
        return setError(res);
      }
      
      setTransaction(res);
      setLoading(false);
    })();
  }, [id]);

  return { transaction, loading, error };
}

export const useGetTransactionCount = (filter: FilterType, userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactionCount, setTransactionsCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
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
