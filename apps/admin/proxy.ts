import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimized proxy route protection.
 * Quickly checks session cookie existence without performing heavy database role queries on every route request.
 * Role verification occurs in server actions/layouts during operational tasks.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access strictly to login, reset password, and static resources
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Quickly check session existence in cookies
  const adminSession =
    request.cookies.get("admin-session")?.value ||
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.getAll().some((c) => c.name.includes("-auth-token"));

  const userRole = request.cookies.get("user-role")?.value;
  const allowedRoles = ["ADMIN", "MANAGER", "STAFF", "DELIVERY"];

  if (!adminSession || !userRole || !allowedRoles.includes(userRole)) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
