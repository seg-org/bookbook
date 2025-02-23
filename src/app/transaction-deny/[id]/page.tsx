"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useState } from "react";
import StatusPopup from "../components/StatusPopup";
import TransactionDenyInput from "../components/TransactionDenyInput";
import TransactionDetails from "../components/TransactionDetails";

function TransactionDenyPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [sendingStatus, setSendingStatus] = useState("");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">แจ้งยกเลิกการซื้อ</CardTitle>
        </CardHeader>
        <CardContent className="relative flex flex-col items-center">
          <TransactionDetails id={id} />
          <TransactionDenyInput id={id} setSendingStatus={setSendingStatus} />
        </CardContent>
      </Card>
      <StatusPopup sendingStatus={sendingStatus} setSendingStatus={setSendingStatus} />
    </main>
  );
}

export default TransactionDenyPage;
