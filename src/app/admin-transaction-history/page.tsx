import { forbidden } from "next/navigation";
import { getServerSession } from "next-auth";

import { TransactionAdminProvider } from "@/context/transactionAdminProvider";
import { authOptions } from "@/lib/auth";

import FilterBar from "./components/FilterBar";
import Paginator from "./components/Paginator";
import TransactionDetailPopUp from "./components/TransactionDetailPopUp";
import TransactionList from "./components/TransactionList";

export default async function TransactionPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    forbidden();
  }

  return (
    <TransactionAdminProvider>
      <FilterBar />
      <TransactionList />
      <Paginator />
      <TransactionDetailPopUp />
    </TransactionAdminProvider>
  );
}
