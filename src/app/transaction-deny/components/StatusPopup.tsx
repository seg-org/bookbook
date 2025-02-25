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
          <CardContent className="flex flex-col justify-center">
            <p className="w-full justify-center text-center text-3xl text-red-600">เกิดปัญหาขณะส่งใบแจ้ง</p>
            <p className="w-full justify-center text-center text-xl text-gray-600">กรุณาลองใหม่อีกรอบ</p>
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
          <CardContent className="flex flex-col justify-center">
            <p className="w-full justify-center text-center text-3xl text-green-600">แจ้งสำเร็จ</p>
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
              onClick={() => {
                router.replace("/");
              }}
            >
              ปิด
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <></>;
};

export default StatusPopup;
