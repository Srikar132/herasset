
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-in-production"
);

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || password !== process.env.SITE_PASSWORD) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 401 }
      );
    }

    // Sign a JWT — expires in 7 days
    const token = await new SignJWT({ authorized: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    const res = NextResponse.json({ ok: true });

    // Set httpOnly cookie — inaccessible to JS, secure in production
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}