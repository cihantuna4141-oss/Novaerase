import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/admin-dashboard/signin")) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/admin-dashboard/signin",
    },
  }
);

export const config = {
  matcher: ["/admin-dashboard", "/admin-dashboard/:path*"],
};
