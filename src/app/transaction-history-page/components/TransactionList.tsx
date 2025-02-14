"user client"

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useGetTransaction } from "@/hooks/useGetTransactions";
import { useState, useMemo, useEffect } from "react";
import { FilterType } from "./FilterBar";
import LineSeparator from "./LineSperator";
import TransactionBox from "./TransactionBox";
import { Transaction } from "@/data/dto/transaction.dto";

interface TransactionListProps {
  filter: FilterType;
  userId: string;
  setTotalBuy: (totalBuy: number) => void;
  setTotalSell: (totalBuy: number) => void;
}

function PutComponents( child_components:React.JSX.Element[],
                        userId:string,
                        it:number,
                        dateScope:Date,
                        sort_transactions:Transaction[],
                        displayString:string ) {
  if (it < sort_transactions.length && sort_transactions[it].createdAt >= dateScope)
    child_components.push(<LineSeparator key={displayString} text={displayString} />);
  while (it < sort_transactions.length && sort_transactions[it].createdAt >= dateScope) {
    const ts = sort_transactions[it];
    child_components.push(
      <TransactionBox key={ts.id} transaction={ts} type={userId == ts.sellerId ? "sell" : "buy"} />
    );
    ++it;
  }
  return it
}

const TransactionList = ({ filter, userId, setTotalBuy, setTotalSell }: TransactionListProps) => {
  const { transactions, loading, error } = useGetTransaction(filter, userId);
  const [ child_components, setChildComponent ] = useState<React.JSX.Element[]>([])
  const [ newTotalBuy, newTotalSell ] = useMemo(() => {
    let newTotalBuy = 0;
    let newTotalSell = 0;
    transactions.map((ts) => {
      if (ts.buyerId == userId) newTotalBuy += ts.amount;
      if (ts.sellerId == userId) newTotalSell += ts.amount;
    });
    return [ newTotalBuy, newTotalSell ]
  }, [ filter, userId, transactions.length ]);

  useEffect(() => {
    setTotalBuy(newTotalBuy);
    setTotalSell(newTotalSell);
  }, [ newTotalBuy, newTotalSell ]);

  useEffect(() => {
    const newChildComponents: React.JSX.Element[] = []
    const sort_transactions = transactions.sort((a, b) => -(a.createdAt.getTime() - b.createdAt.getTime()));

    const first_date = new Date();
          first_date.setHours(0, 0, 0, 0);
    const second_date = new Date(first_date);
          second_date.setDate(second_date.getDate() - 1);
    const previous_month = new Date(first_date);
          previous_month.setMonth(previous_month.getMonth() - 1);
    const this_year = new Date(first_date.getFullYear(), 0, 1, 0, 0, 0, 0);

    let it = 0;

    it = PutComponents(newChildComponents,userId,it,first_date,sort_transactions,"Today")
    it = PutComponents(newChildComponents,userId,it,second_date,sort_transactions,"Yesterday")
    it = PutComponents(newChildComponents,userId,it,previous_month,sort_transactions,"This Month")
    it = PutComponents(newChildComponents,userId,it,previous_month,sort_transactions,"This Year")

    const year = new Date(this_year);
    while (it < sort_transactions.length) {
      year.setFullYear(new Date(sort_transactions[it].createdAt).getFullYear());
      it = PutComponents(newChildComponents,userId,it,year,sort_transactions,year.getFullYear().toString())
    }

    setChildComponent(newChildComponents)
  }, [transactions]);

  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return (
      <div className="v-screen grid h-screen place-items-center text-4xl font-bold text-gray-400">
        Failed to get transactions
      </div>
    );
  }
  if (transactions.length == 0) {
    return (
      <div className="v-screen grid h-screen place-items-center text-4xl font-bold text-gray-400">
        No transaction found
      </div>
    );
  }

  
  return (
    <div className="5xl:grid-cols_5 grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
      {child_components}
    </div>
  );
};

export default TransactionList;
