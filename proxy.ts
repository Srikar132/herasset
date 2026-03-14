import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-in-production"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Paths that never need protection ──
  const isLoginPage = pathname === "/login";
  const isLoginApi  = pathname === "/api/login";
  const isLogoutApi = pathname === "/api/logout";

  if (isLoginPage || isLoginApi || isLogoutApi) {
    return NextResponse.next();
  }

  // ── Verify JWT from cookie ──
  const token = request.cookies.get("auth-token")?.value;

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      // Token valid → allow through
      return NextResponse.next();
    } catch {
      // Token invalid / expired → fall through to redirect
    }
  }

  // ── Not authenticated → redirect to /login ──
  const loginUrl = new URL("/login", request.url);
  // Optionally preserve the intended destination for post-login redirect:
  // loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match ALL paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (Next.js image optimisation)
     *  - favicon.ico
     *  - public assets (png, jpg, gif, webp, mp3, mp4, svg, ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|mp3|mp4|svg|ico)$).*)",
  ],
};