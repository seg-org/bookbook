import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isUserBanned } from "@/lib/ban";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getServerSession(authOptions);

  if (!user) {
    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pUser = await prisma.user.findUnique({
    where: {
      id: user.user.id,
    },
  });

  if (!pUser) {
    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isBanned = isUserBanned(pUser);

  if (isBanned) {
    return new Response(
      JSON.stringify({ status: "BANNED", bannedUntil: pUser.bannedUntil, banReason: pUser.banReason }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
