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

export const getMyChatRooms = async () => {
  try {
    const res: AxiosResponse<ChatRoom[]> = await apiClient.get(`/chat/my-rooms`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get my ChatRooms`, error);
    return Error(`Failed to get my ChatRooms`);
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

    return res.data;
  } catch (error) {
    console.error("Failed to send message", error);
    return Error("Failed to send message");
  }
};

export const readMessages = async (roomId: string, userId: string) => {
  try {
    const res: AxiosResponse<ChatRoom> = await apiClient.patch(`/chat/${roomId}/messages/read`, { userId });

    return res.data;
  } catch (error) {
    console.error(`Failed to read messages with roomId ${roomId}`, error);
    return Error(`Failed to read messages with roomId ${roomId}`);
  }
};
