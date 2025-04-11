"use client";

import clsx from "clsx";
import { useActionState } from "react";

import { submitGeneralReport } from "./reportAction";

export default function GeneralReportForm() {
  const [state, formAction] = useActionState(submitGeneralReport, { success: false, message: "" });

  return (
    <>
      {state.message && <p className={clsx(state.success ? "text-green-500" : "text-red-500")}>{state.message}</p>}

      <form action={formAction} className="flex w-full flex-col items-center gap-4 p-4">
        <textarea
          name="problem"
          id="problem"
          placeholder="อธิบายปัญหาการใช้งานที่พบ"
          rows={5}
          className="w-full rounded-lg border border-black p-4 shadow"
        />

        <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
          ส่งรายงานปัญหา
        </button>
      </form>
    </>
  );
}
