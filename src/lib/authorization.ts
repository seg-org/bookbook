import { forbidden } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "./auth";

export async function verifyAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    forbidden();
  }
}
