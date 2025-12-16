import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userType = req.auth?.user?.type;

  // Public routes (no auth required)
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Dashboard routes
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDoctorRoute = nextUrl.pathname.startsWith("/doctor");
  const isPatientRoute = nextUrl.pathname.startsWith("/patient");

  // Handle legacy /user route - redirect to /patient or /login
  if (nextUrl.pathname === "/user" || nextUrl.pathname.startsWith("/user/")) {
    if (isLoggedIn && userType) {
      return NextResponse.redirect(new URL(`/${userType}`, nextUrl));
    }
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Allow public routes
  if (isPublicRoute) {
    // Redirect logged in users away from login page to their dashboard
    if (isLoggedIn && userType && nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL(`/${userType}`, nextUrl));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userType !== "admin") {
      return NextResponse.redirect(new URL(`/${userType}`, nextUrl));
    }
    return NextResponse.next();
  }

  // Protect doctor routes
  if (isDoctorRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userType !== "doctor") {
      return NextResponse.redirect(new URL(`/${userType}`, nextUrl));
    }
    return NextResponse.next();
  }

  // Protect patient routes
  if (isPatientRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userType !== "patient") {
      return NextResponse.redirect(new URL(`/${userType}`, nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
