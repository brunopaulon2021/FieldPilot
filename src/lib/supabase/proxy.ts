import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const protectedPrefixes = ["/app", "/onboarding"];
const authPaths = new Set(["/login", "/signup", "/forgot-password"]);

function matchesRoutePrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function updateSession(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const isProtected = protectedPrefixes.some((prefix) => matchesRoutePrefix(request.nextUrl.pathname, prefix));

  if (!config) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login?error=configuration", request.url));
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authPaths.has(request.nextUrl.pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return response;
}
