"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { ChatProvider } from "./ChatProvider";
import { PostProvider } from "./PostProvider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <PostProvider>
        <ChatProvider>{children}</ChatProvider>
      </PostProvider>
    </SessionProvider>
  );
};
