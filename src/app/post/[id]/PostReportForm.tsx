"use client";

import clsx from "clsx";
import { useActionState } from "react";

import { submitPostReport } from "./reportAction";

type FormProps = {
  postId: string;
};

export default function PostReportForm({ postId }: FormProps) {
  const [state, formAction] = useActionState(submitPostReport, { success: false, message: "" });

  return (
    <>
      <form action={formAction} className="flex w-full flex-col items-center gap-4 p-4">
        <input type="text" name="postId" value={postId} hidden readOnly />

        <textarea
          name="reason"
          id="reason"
          placeholder="อธิบายปัญหาของโพสต์ดังกล่าว"
          rows={3}
          className="w-full rounded-lg border border-black p-4 shadow"
        />

        {state.message && <p className={clsx(state.success ? "text-green-500" : "text-red-500")}>{state.message}</p>}

        <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
          ส่งรายงานปัญหา
        </button>
      </form>
    </>
  );
}
