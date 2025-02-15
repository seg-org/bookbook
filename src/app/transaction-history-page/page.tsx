"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import FilterBar, { FilterType } from "./components/FilterBar";
import TransactionList from "./components/TransactionList";
import Paginator from "./components/Paginator";

// Note 1: Currently using header and filter in local components.

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

function TransactionPage() {
  const { data: session, status } = useSession();
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
      <FilterBar filter={filter} setFilter={setFilter} totalBuy={totalBuy} totalSell={totalSell} />
      <TransactionList filter={filter} userId={session?.user?.id || "---"} setTotalBuy={setTotalBuy} setTotalSell={setTotalSell} />
      <Paginator maxPageNumber={10} selectingPage={selectingPage} setSelectingPage={setSelectingPage}/>
    </>
  );
}

export default TransactionPage;
