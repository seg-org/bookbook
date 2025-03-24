"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useGetTransaction } from "@/hooks/useGetTransactions";
import StatusPopup from "../components/StatusPopup";
import TransactionDenyInput from "../components/TransactionDenyInput";
import TransactionDetails from "../components/TransactionDetails";

function TransactionDenyPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [sendingStatus, setSendingStatus] = useState("");
  const { transaction, loading, error } = useGetTransaction(id);

  if (loading) {
    return <LoadingAnimation />;
  } else if (error) {
    return <label className="text-5xl font-extrabold text-red-600">เกิดข้อผิดพลาด</label>;
  } else {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="flex flex-col">
          <CardHeader className="p-6">
            <CardTitle className="text-center text-2xl text-red-700">แจ้งยกเลิกการซื้อ</CardTitle>
          </CardHeader>
          <CardContent className="relative flex flex-col items-center space-y-2">
            <TransactionDetails transaction={transaction} />
            <TransactionDenyInput transaction={transaction} setSendingStatus={setSendingStatus} />
          </CardContent>
        </Card>
        <StatusPopup sendingStatus={sendingStatus} setSendingStatus={setSendingStatus} />
      </main>
    );
  }
}

export default TransactionDenyPage;
