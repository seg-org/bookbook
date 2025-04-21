"use client";

import { useEffect, useState } from "react";

import { getAllReport } from "@/data/report";

type ReportType = {
  id: string;
  reporterId: string;
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

export const useGetAllReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reports, setReports] = useState<ReportType[]>([]);
  useEffect(() => {
    (async () => {
      const res = await getAllReport();
      if (res instanceof Error) {
        return setError(res);
      }

      setReports(res);
      setLoading(false);
    })();
  }, []);

  return { reports, loading, error };
};
