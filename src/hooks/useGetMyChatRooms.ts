import { getMyChatRooms } from "@/data/chat";
import { ChatRoom } from "@/data/dto/chat.dto";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useGetMyChatRooms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    (async () => {
      if (!isAuthenticated || !session?.user) {
        setLoading(false);
        setChatRooms([]);
        return;
      }

      const res = await getMyChatRooms();
      if (res instanceof Error) {
        return setError(res);
      }

      setChatRooms(res);
      setLoading(false);
    })();
  }, [isAuthenticated, session]);

  return { chatRooms, setChatRooms, loading, error };
};
