"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FilterBar, { FilterType } from "./components/FilterBar";
import TransactionList from "./components/TransactionList";
import Paginator from "./components/Paginator";
import { useGetTransactionCount } from "@/hooks/useGetTransactions";

// Note 1: Currently using header and filter in local components.

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");
const transactionPerPage = 5;

function TransactionPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || "---"
  
  const [filter, setFilter] = useState<FilterType>({
    startDate: beginningOfTime,
    endDate: endOfTime,
    asBuyer: true,
    asSeller: true,
  });
  const [totalBuy, setTotalBuy] = useState(0);
  const [totalSell, setTotalSell] = useState(0);
  const [selectingPage, setSelectingPage] = useState(1);

  return (
    <>
      <FilterBar filter={filter}
                 setFilter={setFilter}
                 totalBuy={totalBuy}
                 totalSell={totalSell} />
      <TransactionList filter={filter}
                       userId={userId}
                       transactionPerPage={transactionPerPage}
                       selectingPage={selectingPage}
                       setTotalBuy={setTotalBuy}
                       setTotalSell={setTotalSell} />
      <Paginator filter={filter}
                 userId={userId}
                 selectingPage={selectingPage}
                 setSelectingPage={setSelectingPage}
                 transactionPerPage={transactionPerPage}/>
    </>
  );
}

export default TransactionPage;
