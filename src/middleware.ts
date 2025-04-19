import type { MiddlewareConfig, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { SessionUser } from "@/lib/auth"; // Import the SessionUser type

export async function middleware(request: NextRequest) {
  const token = (await getToken({ req: request })) as SessionUser | null;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isVerificationPage = request.nextUrl.pathname.startsWith("/verify");

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    let callbackUrl = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      callbackUrl += request.nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, request.url));
  }

  if (token) {
    if (!token.emailVerified && !isVerificationPage && request.nextUrl.pathname !== "/pdpa-consent") {
      return NextResponse.redirect(new URL("/verify/email", request.url));
    }

    if (
      token.emailVerified &&
      !token.phoneVerified &&
      request.nextUrl.pathname !== "/verify/phone" &&
      request.nextUrl.pathname !== "/pdpa-consent"
    ) {
      return NextResponse.redirect(new URL("/verify/phone", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/seller-registration/:path*", "/login", "/register", "/verify/:path*", "/pdpa-consent", "/admin/:path*"],
} satisfies MiddlewareConfig;
