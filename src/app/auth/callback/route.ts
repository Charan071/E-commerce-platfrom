import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/user-sync";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * Supabase Auth Callback handler.
 * Supabase redirects here after email confirmation / OAuth login.
 * Exchange the `code` for a session and redirect the user.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectRaw = searchParams.get("redirectTo") ?? "/";
  const redirectTo =
    redirectRaw.startsWith("/") && !redirectRaw.startsWith("//") ? redirectRaw : "/";
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await ensureAppUser(data.user);
      }
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Something went wrong — redirect to error page
  return NextResponse.redirect(`${origin}/auth/error`);
}
