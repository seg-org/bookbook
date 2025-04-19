import { useRouter } from "next/navigation";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  sendingStatus: string;
  setSendingStatus: (val: string) => void;
}

const StatusPopup = ({ sendingStatus, setSendingStatus }: Props) => {
  const router = useRouter();

  if (sendingStatus == "sending") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <LoadingAnimation />
      </div>
    );
  }

  if (sendingStatus == "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <Card>
          <CardContent className="flex flex-col justify-center space-y-2 p-4">
            <p className="w-full justify-center text-center text-3xl font-bold text-red-600">เกิดปัญหาขณะส่งใบแจ้ง</p>
            <p className="text-md w-full justify-center text-center font-bold text-gray-400">กรุณาลองใหม่อีกรอบ</p>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
              onClick={() => {
                setSendingStatus("");
              }}
            >
              ปิด
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sendingStatus == "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <Card>
          <CardContent className="flex flex-col justify-center space-y-2 p-4">
            <p className="w-full justify-center text-center text-3xl font-bold text-green-600">ยกเลิกสำเร็จ</p>
            <p className="text-md w-full justify-center text-center font-bold text-gray-400">
              ข้อมูลการยกเลิกได้ถูกบันทึกเรียบร้อย
            </p>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
              onClick={() => {
                router.replace("/admin-transaction-history");
              }}
            >
              กลับ
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <></>;
};

export default StatusPopup;
