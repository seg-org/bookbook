import { useEffect, useState } from "react";

import { getChatMessagesByRoom } from "@/data/chat";
import { ChatMessage } from "@/data/dto/chat.dto";

// TODO: get top n messages/from last n days
export const useGetChatMessages = (roomId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getChatMessagesByRoom(roomId);
      if (res instanceof Error) {
        return setError(res);
      }

      setChatMessages(res);
      setLoading(false);
    })();
  }, [roomId]);

  return { chatMessages, loading, error };
};
