"use client";

import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { PostProvider } from "./PostProvider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <PostProvider>{children}</PostProvider>
    </SessionProvider>
  );
};
