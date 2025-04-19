"use client";
import { TransactionFailType } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { reportEvidenceFolderName } from "@/constants/s3FolderName";
import { Transaction } from "@/data/dto/transaction.dto";
import { putObjectsAsZip } from "@/data/object";
import { updateTransaction } from "@/data/transaction";

interface Props {
  transaction: Transaction | undefined;
  setSendingStatus: (val: string) => void;
}

const cap_overflow_string = (str: string, cap: number) => {
  if (str.length >= cap) return str.substring(0, cap) + "...";
  else return str;
};

const TransactionDenyInput = ({ transaction, setSendingStatus }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [details, setDetails] = useState("");
  const [failType, setFailType] = useState("");
  const [detailNotProvided, setDetailNotProvided] = useState("");
  const [failTypeNotProvided, setFailTypeNotProvided] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFiles([...files, ...Array.from(event.target.files)]);
    event.target.value = "";
  };

  const validateInput = (): boolean => {
    let valid = true;
    if (!details) {
      setDetailNotProvided("กรุณาใส่รายละเอียด");
      valid = false;
    }
    if (!failType) {
      setFailTypeNotProvided("กรุณาใส่ประเภทของการยกเลิก");
      valid = false;
    }
    return valid;
  };

  const handleSubmitClick = async () => {
    if (!validateInput()) return;

    if (!window.confirm("คุณต้องการยกเลิกการซื้อนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) {
      return;
    }

    setSendingStatus("sending");

    try {
      const uploadFolder = reportEvidenceFolderName;
      const uploadFiles = await putObjectsAsZip(files, uploadFolder);

      if (uploadFiles instanceof Error) {
        throw new Error("Failed to upload files");
      }

      if (transaction === undefined) {
        throw new Error("Failed to upload files");
      }
      await updateTransaction({
        id: transaction.id,
        status: "FAIL",
        detail: [details],
        evidenceURL: [uploadFiles.key],
        failType: failType.toUpperCase(),
      });
      setSendingStatus("success");
    } catch (error) {
      console.error(error);
      setSendingStatus("error");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <textarea
        className="w-full resize-none rounded-md border border-gray-300 p-3 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="รายละเอียด"
        onChange={(e) => {
          setDetails(e.target.value);
          setDetailNotProvided("");
        }}
        rows={5}
      />
      {detailNotProvided && (
        <div className="w-full justify-start">
          <p className="w-full text-sm text-red-500">{detailNotProvided}</p>
        </div>
      )}
      <div className="flex w-full flex-row justify-between">
        <input
          id="file"
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-600"
        />
        <select
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => {
            if (e.target.value == "[Fail Type]") {
              setFailType("");
            } else {
              setFailType(e.target.value);
            }
            setFailTypeNotProvided("");
          }}
        >
          <option>[Fail Type]</option>
          {Object.values(TransactionFailType).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      {failTypeNotProvided && (
        <div className="w-full justify-start">
          <p className="w-full text-sm text-red-500">{failTypeNotProvided}</p>
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-2 w-full space-y-2">
          {files.map((file, index) => (
            <Card
              key={index}
              className="mt-0 flex w-full items-center justify-between rounded-lg border border-gray-200 px-2 py-1 shadow-sm"
            >
              <div className="flex w-full items-center space-x-4 p-1 pt-2">
                <span className="w-full flex-1 truncate text-sm text-gray-700">
                  {cap_overflow_string(file.name, 50)}
                </span>
                <Button
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                  onClick={() => removeFile(index)}
                >
                  -
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Button
        onClick={() => {
          handleSubmitClick();
        }}
        className="mt-4 w-full bg-red-500 hover:bg-red-600"
      >
        ยกเลิกการซื้อ
      </Button>
    </>
  );
};

export default TransactionDenyInput;
