import { TransactionAdminProvider } from "@/context/transactionAdminProvider";

import FilterBar from "./components/FilterBar";
import Paginator from "./components/Paginator";
import TransactionDetailPopUp from "./components/TransactionDetailPopUp";
import TransactionList from "./components/TransactionList";
import { forbidden } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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
