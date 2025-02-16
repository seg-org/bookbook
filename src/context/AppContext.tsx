"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { ChatProvider } from "./ChatProvider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <ChatProvider>{children}</ChatProvider>;
    </SessionProvider>
  );
};
