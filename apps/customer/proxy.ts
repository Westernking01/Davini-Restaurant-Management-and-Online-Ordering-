import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected customer routes requiring CUSTOMER role
  const protectedRoutes = ["/account", "/orders", "/profile", "/reservations"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    // Quickly check for customer session cookie existence
    const sessionCookie =
      request.cookies.get("sb-access-token")?.value ||
      request.cookies.get("customer-session")?.value ||
      request.cookies.getAll().some((c) => c.name.includes("-auth-token"));

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
