import { format } from "date-fns";

import { Button } from "@/components/ui/Button";

type ReportType = {
  id: string;
  createdAt: Date;
  reason: string;
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

const banUser = (id: string) => {};

const ReportCard = ({ report, handleShowChat }: ReportCardProps) => {
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
        <Button className="mx-1 bg-red-500 hover:bg-red-600">แบนผู้ใช้</Button>
      </div>
    </div>
  );
};

export default ReportCard;
