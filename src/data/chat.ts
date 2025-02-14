import { ChatMessage } from "@prisma/client";
import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { ChatRoom, CreateChatRoom } from "./dto/chat.dto";

export const createChatRoom = async (dto: CreateChatRoom) => {
  try {
    // only creates a new chat room if not exist
    const res: AxiosResponse<ChatRoom> = await apiClient.post(`/chat`, dto);

    return res.data;
  } catch (error) {
    console.error(`Failed to get ChatRoom with dto ${dto}`, error);
    return Error(`Failed to get ChatMessages with dto ${dto}`);
  }
};

export const getChatMessagesByRoom = async (roomId: string) => {
  try {
    const res: AxiosResponse<ChatMessage[]> = await apiClient.get(`/chat/${roomId}/messages`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get ChatMessages with roomId ${roomId}`, error);
    return Error(`Failed to get ChatMessages with roomId ${roomId}`);
  }
};

export const sendMessage = async (roomId: string, message: string) => {
  try {
    const res: AxiosResponse<ChatMessage> = await apiClient.post(`/chat/${roomId}/messages`, { message, roomId });
    // socketio

    return res.data;
  } catch (error) {
    console.error("Failed to send message", error);
    return Error("Failed to send message");
  }
};
