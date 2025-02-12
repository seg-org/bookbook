"use client"
import FilterBar from "./components/FilterBar";
import TransactionList from "./components/TransactionList";
import { useEffect, useState } from "react";
import { FilterType } from "./components/FilterBar";
import { TransactionBoxProps } from "./components/TransactionBox";
import { useFormState } from "react-dom";

// Note 1: Currently using header and filter in local components.

const beginningOfTime = new Date('0000-01-01T00:00:00Z');
const endOfTime = new Date('9999-12-31T23:59:59Z');


function TransactionPage() {
  const [ filter, setFilter ] = useState<FilterType>({
    startDate: beginningOfTime,
    endDate: endOfTime,
    asBuyer: true,
    asSeller: true
  });

  return (
    <>
      <FilterBar filter={filter} setFilter={setFilter}/>
      <TransactionList filter={filter} userId="user_3"/>
    </>
  );
}

export default TransactionPage;