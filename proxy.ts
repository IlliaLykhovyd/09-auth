import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  let isAuthenticated = !!accessToken;

  let newTokens: {
    accessToken?: string;
    refreshToken?: string;
  } | null = null;

  if (!accessToken && refreshToken) {
    try {
      const data = await checkSession();

      if (data?.data) {
        isAuthenticated = true;

        newTokens = {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        };
      }
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (!isAuthenticated && isPrivateRoute) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  }

  else if (isAuthenticated && isPublicRoute) {
    response = NextResponse.redirect(new URL("/", request.url));
  }

  else {
    response = NextResponse.next();
  }

  if (newTokens) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    if (newTokens.accessToken) {
      response.cookies.set("accessToken", newTokens.accessToken, cookieOptions);
    }

    if (newTokens.refreshToken) {
      response.cookies.set(
        "refreshToken",
        newTokens.refreshToken,
        cookieOptions,
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
