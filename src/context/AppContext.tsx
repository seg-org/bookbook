import { FC, PropsWithChildren } from "react";
import { ChatProvider } from "./ChatProvider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return <ChatProvider>{children}</ChatProvider>;
};
