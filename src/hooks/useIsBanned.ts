"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useIsBanned() {
  const { status } = useSession();

  const [isBanned, setIsBanned] = useState(false);
  const [bannedUntil, setBannedUntil] = useState<Date>();
  const [banReason, setBanReason] = useState<string>();

  async function fetchBanStatus() {
    const response = await fetch("/api/auth/account-status");

    if (!response.ok) {
      console.error("Failed to fetch ban status");
      return;
    }

    const data = await response.json();
    if (data.status === "BANNED") {
      setIsBanned(true);
      setBannedUntil(new Date(data.bannedUntil));
      setBanReason(data.banReason);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchBanStatus();
    } else {
      setIsBanned(false);
      setBannedUntil(undefined);
      setBanReason(undefined);
    }
  }, [status]);

  return { isBanned, bannedUntil, banReason };
}
