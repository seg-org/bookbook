"use client";

import { TransactionAdminProvider } from "@/context/transactionAdminProvider";

import FilterBar from "./components/FilterBar";
import Paginator from "./components/Paginator";
import TransactionDetailPopUp from "./components/TransactionDetailPopUp";
import TransactionList from "./components/TransactionList";

function TransactionPage() {
  return (
    <TransactionAdminProvider>
      <FilterBar />
      <TransactionList />
      <Paginator />
      <TransactionDetailPopUp />
    </TransactionAdminProvider>
  );
}

export default TransactionPage;
