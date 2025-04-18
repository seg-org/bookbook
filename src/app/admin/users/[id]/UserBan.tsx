"use client";

import { User } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

import { banUser } from "./actions";
import styles from "./styles.module.scss";

type Props = {
  user: User;
};

export default function UserBan({ user }: Props) {
  const isBanned = user.bannedUntil && new Date(user.bannedUntil) > new Date();

  const [showBanMenu, setShowBanMenu] = useState(false);

  return (
    <div className="mt-4 flex w-full flex-col items-center gap-4 p-4">
      <Button variant="destructive" size="lg" onClick={() => setShowBanMenu(!showBanMenu)} className="w-fit">
        {showBanMenu ? "ซ่อนเมนูแบน" : "จัดการการแบน"}
      </Button>

      {isBanned && user.bannedUntil && (
        <p className="text-red-500">
          ผู้ใช้ถูกแบนจนถึง {new Date(user.bannedUntil).toLocaleString("th-TH")} ด้วยเหตุผล: {user.banReason}
        </p>
      )}

      {showBanMenu && (
        <form action={banUser} className={styles.userManageForm}>
          <input type="text" name="userId" id="userId" value={user.id} readOnly hidden required />

          <div>
            <label htmlFor="banUntil">แบนจนถึง</label>
            <input
              type="datetime-local"
              name="banUntil"
              id="banUntil"
              defaultValue={isBanned && user.bannedUntil ? new Date(user.bannedUntil).toISOString().slice(0, 16) : ""}
              required
            />
          </div>

          <div>
            <label htmlFor="banReason">เหตุผลการแบน</label>
            <textarea name="banReason" id="banReason" defaultValue={user.banReason ?? ""} rows={5} required />
          </div>

          <button type="submit">บันทึกการแบน</button>
        </form>
      )}
    </div>
  );
}
