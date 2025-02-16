import { ChatMessage, ChatRoom } from "@/data/dto/chat.dto";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface ChatContext {
  currentChatRoom: ChatRoom | undefined;
  setCurrentChatRoom: Dispatch<SetStateAction<ChatRoom | undefined>>;
  chatRooms: ChatRoom[];
  setChatRooms: Dispatch<SetStateAction<ChatRoom[]>>;
  loading: boolean;
  error: Error | null;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContext>({
  currentChatRoom: undefined,
  setCurrentChatRoom: () => {},
  chatRooms: [],
  setChatRooms: () => {},
  loading: false,
  error: null,
  messages: [],
  setMessages: () => {},
});

export const useChatContext = () => {
  return useContext(ChatContext);
};
