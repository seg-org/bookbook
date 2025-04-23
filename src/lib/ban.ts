import { User } from "@prisma/client";

export function isUserBanned(user: Pick<User, "bannedUntil" | "banReason">) {
  return user.bannedUntil && user.bannedUntil > new Date();
}
