import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Supabase Auth Callback handler.
 * Supabase redirects here after email confirmation / OAuth login.
 * Exchange the `code` for a session and redirect the user.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Something went wrong — redirect to error page
  return NextResponse.redirect(`${origin}/auth/error`);
}
