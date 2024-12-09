import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/tokenUtil";
import { UserRole } from "./app/types/userRole";

export function middleware(req: NextRequest) {
  console.log("Middleware is running for:", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return Promise.resolve(verifyToken(req))
    .then((user) => {
      if (!user) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      console.log("middleware - user:", user);

      const pathname = req.nextUrl.pathname;
      const userRole = user.role; // Type is now inferred correctly

      // Role-based access control
      if (pathname.startsWith("/pages/protected") && userRole < UserRole.authorized) {
        return NextResponse.redirect(new URL("/pages/waiting", req.url));
      }

      if (pathname.startsWith("/pages/protected/user") && userRole !== UserRole.authorized) {
        return NextResponse.redirect(
          new URL("/pages/protected/publicTasks", req.url)
        );
      }

      if (pathname.startsWith("/pages/protected/admin") && userRole !== UserRole.admin) {
        return NextResponse.redirect(
          new URL("/pages/protected/publicTasks", req.url)
        );
      }

      return NextResponse.next();
    })
    .catch((error) => {
      console.error("Error in middleware:", error);
      return NextResponse.redirect(new URL("/", req.url));
    });
}

export const config = {
  matcher: ['/pages/protected/:path*'],
};
