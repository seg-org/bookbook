import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Transaction {
  id: string;
  status: "PACKING" | "DELIVERING" | "COMPLETE" | "HOLD" | "FAIL";
  postTitle: string;
  coverImageUrl: string; // Include cover image URL for notifications
}

export default function Notifications() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { data: session } = useSession(); // Get the session from NextAuth

  useEffect(() => {
    async function fetchTransactions() {
      if (!session?.user?.id) return; // Ensure the user is logged in

      const response = await fetch(
        `/api/transaction?forNotifications=true&userId=${session.user.id}&asBuyer=true`
      ); // Only fetch transactions where the user is a buyer
      const data: Transaction[] = await response.json();
      setTransactions(data);
    }

    fetchTransactions();
  }, [session]);

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction.id} className="mb-4 flex items-center">
              <img
                src={transaction.coverImageUrl}
                alt={transaction.postTitle}
                className="mr-4 h-12 w-12 rounded object-cover"
              />
              <div>
                <div className="font-medium">{transaction.postTitle}</div>
                <div className="text-sm text-gray-600">
                  Status:{" "}
                  {transaction.status === "COMPLETE"
                    ? "Completed"
                    : transaction.status === "FAIL"
                    ? "Failed"
                    : transaction.status === "PACKING"
                    ? "Packing"
                    : transaction.status === "DELIVERING"
                    ? "Delivering"
                    : "On Hold"}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No transactions found</li>
        )}
      </ul>
    </div>
  );
}