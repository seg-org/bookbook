import { Transaction } from "@/data/dto/transaction.dto";
import { getTransaction } from "@/data/transaction";
import { FilterType } from "@/app/transaction-history-page/components/FilterBar";
import { useEffect, useState } from "react";

export const useGetTransaction = (filter: FilterType, userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, settransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getTransaction(filter, userId);
      if (res instanceof Error) {
        return setError(res);
      }

      settransactions(res);
      setLoading(false);
    })();
  }, [filter]);

  return { transactions, loading, error };
};
