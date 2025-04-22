import { format } from "date-fns";
import { useRouter } from "next/navigation"; // for App Router

import { Button } from "@/components/ui/Button";
import { useGetChatMessages } from "@/hooks/useGetChatMessages";

type ReportType = {
  id: string;
  createdAt: Date;
  reason: string;
  reporterId: string;
  reporter: {
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    postId: string;
    id: string;
  };
  roomId: string;
};

type ReportCardProps = {
  report: ReportType;
  handleShowChat: (roomId: string) => void;
};

const ReportCard = ({ report, handleShowChat }: ReportCardProps) => {
  const router = useRouter();
  const { chatMessages } = useGetChatMessages(report.roomId || "");
  let reportedUserId = "";

  for (const msg of chatMessages) {
    if (msg.senderId !== report.reporterId) {
      reportedUserId = msg.senderId;
      break;
    }
  }

  const banUser = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  return (
    <div key={report.id} className="rounded-lg border border-gray-300 p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2">
        <span className="text-sm font-medium text-gray-500">Reported by:</span>{" "}
        <span className="font-semibold">{`${report.reporter.firstName} ${report.reporter.lastName}`}</span>{" "}
        <span className="text-sm text-gray-500">({report.reporter.email})</span>
      </div>
      <div className="mb-1">
        <span className="font-medium">Reason:</span> {report.reason}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <p>Room ID: {report.roomId}</p>
        <p>Post ID: {report.room.postId}</p>
        <p>Reported on: {format(new Date(report.createdAt), "PPPpp")}</p>
      </div>
      <div>
        <Button className="mx-1" onClick={() => handleShowChat(report.room.id)}>
          แสดงแชท
        </Button>
        <Button className="mx-1 bg-red-500 hover:bg-red-600" onClick={() => banUser(reportedUserId)}>
          แบนผู้ใช้
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;
