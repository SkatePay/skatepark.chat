import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  const unixTimestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("ws_session", unixTimestamp.toString(), {
    // httpOnly: true, // Keep it secure in production
    secure: isProduction, // Use Secure cookies only in production
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week expiration
  });

  return response;
}
