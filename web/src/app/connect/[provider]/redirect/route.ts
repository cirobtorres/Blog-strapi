import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  params: { params: { provider: string } }
) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("access_token");
  const redirectTo = searchParams.get("redirect") ?? "/";

  if (!token) return NextResponse.redirect(new URL(redirectTo, request.url));

  const provider = (await params.params).provider;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_IP ?? "http://127.0.0.1:1337";

  const path = `/api/auth/${provider}/callback`;

  const url = new URL(backendUrl + path);
  url.searchParams.append("access_token", token);

  const res = await fetch(url.href);
  const data = await res.json();

  (await cookies()).set("jwt", data.jwt, config);

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
