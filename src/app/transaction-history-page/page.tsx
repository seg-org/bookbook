"use client";

import { TransactionProvider } from "@/context/TransactionProvider";

import FilterBar from "./components/FilterBar";
import Paginator from "./components/Paginator";
import TransactionDetailPopUp from "./components/TransactionDetailPopUp";
import TransactionList from "./components/TransactionList";

function TransactionPage() {
  return (
    <TransactionProvider>
      <FilterBar />
      <TransactionList />
      <Paginator />
      <TransactionDetailPopUp />
    </TransactionProvider>
  );
}

export default TransactionPage;
