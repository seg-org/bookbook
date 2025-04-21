"use client";

import { ReactNode, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

import BookList from "./BookList";

export function BookSearch({ children }: { children: ReactNode }) {
  const titleInput = useRef<HTMLInputElement>(null);
  const [queryTitle, setQueryTitle] = useState("");

  function handleSearchButton() {
    if (titleInput.current) {
      setQueryTitle(titleInput.current.value);
    }
  }

  return (
    <>
      <div className="flex gap-4">
        <input ref={titleInput} className="rounded-lg p-2" type="text" placeholder="ใส่ชื่อหนังสือ" />

        <Button onClick={handleSearchButton}>ค้นหา</Button>
      </div>

      {children}

      <BookList query={{ title: queryTitle, verifiedStatus: "APPROVED" }} />
    </>
  );
}
