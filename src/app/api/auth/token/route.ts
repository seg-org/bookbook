import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = await getToken({ secret: authOptions.secret, raw: true, req });

  return NextResponse.json({ token: token });
}
