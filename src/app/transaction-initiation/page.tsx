import TransactionForm from "./components/TransactionForm";

export default function TransactionInitiationPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Initiate Transaction</h1>
      <TransactionForm bookId="12345" /> {/* Replace with actual book ID */}
    </div>
  );
}