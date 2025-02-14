import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ secret: authOptions.secret, raw: true, req });

  return NextResponse.json(token);
}
