import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Define a custom interface that extends JwtPayload to include the role property
interface CustomJwtPayload extends JwtPayload {
  role?: string;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token && req.nextUrl.pathname.startsWith("/users")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check for doctor role and restrict access
  if (token) {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token.value);

      if (decoded && decoded.role === "DOCTOR") {
        // Allow access only to patient and calendar pages
        const allowedPaths = [
          "/doctor_appointments",
          "/doctor_schedule",
          "/login",
          "/logout"
        ];

        const currentPath = req.nextUrl.pathname;
        const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));

        if (!isAllowedPath) {
          // Redirect to doctor appointments page if trying to access restricted page
          return NextResponse.redirect(new URL("/doctor_appointments", req.url));
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
