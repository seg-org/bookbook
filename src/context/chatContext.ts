import { ChatRoom } from "@/data/dto/chat.dto";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type alert = string | null;

interface ChatContext {
  currentChatRoom: ChatRoom | null;
  setCurrentChatRoom?: Dispatch<SetStateAction<ChatRoom | null>>;
}

export const ChatContext = createContext<ChatContext>({
  currentChatRoom: null,
  setCurrentChatRoom: () => {},
});

export const useChatContext = () => {
  return useContext(ChatContext);
};
