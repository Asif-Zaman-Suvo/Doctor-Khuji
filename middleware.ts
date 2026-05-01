import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session;
  const role = session?.user?.role;

  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";
  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin");
  const isDoctorRoute = nextUrl.pathname.startsWith("/dashboard/doctor");
  const isPatientRoute = nextUrl.pathname.startsWith("/dashboard/patient");
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isLoggedIn && isAuthPage) {
    const redirectMap: Record<string, string> = {
      ADMIN: "/dashboard/admin",
      DOCTOR: "/dashboard/doctor",
      PATIENT: "/dashboard/patient",
    };
    const dest = redirectMap[role as string] ?? "/dashboard";
    return NextResponse.redirect(new URL(dest, nextUrl));
  }

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  if (isDoctorRoute && role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  if (isPatientRoute && role !== "PATIENT") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
