import { verifyAdmin } from "@/lib/authorization";
import TransactionDenyPage from "../components/TransactionDenyPage";

async function TransactionDenyPageEntry() {
  await verifyAdmin();

  return <TransactionDenyPage />;
}

export default TransactionDenyPageEntry;
