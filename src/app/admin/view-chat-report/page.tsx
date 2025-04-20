"use client";

import { useState } from "react";

import { useGetAllReports } from "@/hooks/useGetAllReport";
import { useGetChatMessages } from "@/hooks/useGetChatMessages";

import ChatCard from "./ChatCard";
import ReportCard from "./ReportCard";

export default function ChatReportsPage() {
  const { reports, loading, error } = useGetAllReports();
  const [clickedChat, setClickedChat] = useState(false);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { chatMessages, loading: chatLoading } = useGetChatMessages(selectedRoomId || "");
  const selectedUser = chatMessages.at(0)?.senderId;

  const handleShowChat = (roomId: string) => {
    setClickedChat(true);
    setSelectedRoomId(roomId);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Chat Reports</h1>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error.message || "Failed to load reports"}</p>}
      {!loading && !error && reports.length === 0 && <p>No reports found.</p>}

      {!loading && !error && reports.length > 0 && (
        <div className="flex space-x-6">
          {/* Left Panel - Reports */}
          <div className="max-h-[80vh] w-1/2 space-y-4 overflow-y-auto pr-2">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} handleShowChat={handleShowChat} />
            ))}
          </div>

          {/* Right Panel - Chat */}
          <div className="max-h-[80vh] w-1/2 overflow-y-auto rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">Chat Messages</h2>
            {!clickedChat ? (
              <p>please select report</p>
            ) : (
              <div>
                {chatLoading ? (
                  <p>Loading chat messages...</p>
                ) : chatMessages && chatMessages.length > 0 ? (
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <ChatCard msg={msg} left={selectedUser} key={msg.id} />
                    ))}
                  </div>
                ) : (
                  <p>No messages found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
