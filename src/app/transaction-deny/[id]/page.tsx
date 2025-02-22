"use client";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { useGetTransaction } from "@/hooks/useGetTransactions";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

function TransactionDenyPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [files, setFiles] = useState<File[]>([]);
  const [details, setDetails] = useState("");
  const [detailNotProvided, setDetailNotProvided] = useState("");
  const { transaction, loading, error } = useGetTransaction(id);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...Array.from(event.target.files)]);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const validateInput = () => {
    if (details === "") setDetailNotProvided("Please provide some details.");
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return console.log(error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">แจ้งยกเลิกการซื้อ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image
            className="m-2.5 mt-0 h-80 w-auto rounded-lg"
            src={transaction?.post.book.coverImageUrl || ""}
            alt="Book Cover"
            height={2040}
            width={1305}
          ></Image>
          <div className="mt-2 flex w-full flex-row justify-start space-x-1">
            <label className="font-extrabold">ชื่อโพสต์ : </label>
            <label className="flex-1 truncate">{transaction?.post.title}</label>
          </div>
          <div className="flex w-full flex-row justify-start space-x-1">
            <label className="font-extrabold">ชื่อหนังสือ : </label>
            <label className="flex-1 truncate">{transaction?.post.book.title}</label>
          </div>
          <div className="flex w-full flex-row justify-start space-x-1">
            <label className="font-extrabold">ผู้ขาย : </label>
            <label className="flex-1 truncate">
              {transaction?.seller.firstName + " " + transaction?.seller.lastName}
            </label>
          </div>
          <div className="flex w-full flex-row justify-start space-x-1">
            <label className="font-extrabold">วันที่สร้าง : </label>
            <label className="flex-1 truncate">
              {transaction?.createdAt.getDay().toString() +
                "/" +
                transaction?.createdAt.getMonth().toString() +
                "/" +
                transaction?.createdAt.getFullYear().toString()}
            </label>
          </div>
          <div className="flex w-full flex-row justify-start space-x-1">
            <label className="font-extrabold">วันที่จ่าย : </label>
            <label className="flex-1 truncate">
              {transaction?.paidOn.getDay().toString() +
                "/" +
                transaction?.paidOn.getMonth().toString() +
                "/" +
                transaction?.paidOn.getFullYear().toString()}
            </label>
          </div>
          <div className="flex w-full flex-row justify-start space-x-1">
            <label className="font-extrabold">ราคา : </label>
            <label className="flex-1 truncate">{transaction?.amount + ".-"}</label>
          </div>

          <textarea
            className="mt-2 w-full max-w-md resize-none rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="รายละเอียด"
            onChange={(e) => {
              setDetails(e.target.value);
              setDetailNotProvided("");
            }}
            rows={5}
          />
          {detailNotProvided && <p className="text-sm text-red-500">{detailNotProvided}</p>}
          <Input
            id="file"
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-600"
          />
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card
                key={index}
                className="mt-1 flex items-center justify-between rounded-lg border border-gray-200 px-2 py-1 shadow-sm"
              >
                <CardContent className="flex w-full items-center space-x-4 p-1 pt-1">
                  <span className="flex-1 truncate text-sm text-gray-700">{file.name}</span>
                  <Button
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                    onClick={() => removeFile(index)}
                  >
                    -
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            onClick={() => {
              validateInput();
            }}
            className="mt-4 w-full"
          >
            ส่ง
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default TransactionDenyPage;
