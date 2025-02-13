import { ChatMessage } from "@prisma/client";
import { AxiosResponse } from "axios";
import { apiClient } from "./axios";

export const getChatMessagesByRoom = async (roomId: string) => {
  try {
    const res: AxiosResponse<ChatMessage[]> = await apiClient.get(`/chat/${roomId}/messages`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get ChatMessages with roomId ${roomId}`, error);
    return Error(`Failed to get ChatMessages with roomId ${roomId}`);
  }
};
