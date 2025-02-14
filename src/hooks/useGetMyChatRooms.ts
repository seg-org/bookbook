import { getMyChatRooms } from "@/data/chat";
import { ChatRoom } from "@/data/dto/chat.dto";
import { useEffect, useState } from "react";

export const useGetMyChatRooms = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getMyChatRooms();
      if (res instanceof Error) {
        return setError(res);
      }

      setChatRooms(res);
      setLoading(false);
    })();
  }, []);

  return { chatRooms, loading, error };
};
