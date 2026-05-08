"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUser } from "@/lib/user-sync";

type AuthActionState = { error?: string } | null;
type PasswordResetState = { error?: string; success?: string } | null;
type UpdatePasswordState = { error?: string; success?: string } | null;

function normalizeRedirectTo(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function login(prevState: AuthActionState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = normalizeRedirectTo(formData.get("redirectTo"));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("invalid login credentials")) {
      return { error: "Invalid email or password." };
    }
    if (message.includes("email not confirmed")) {
      return {
        error:
          "Email not confirmed yet. Please confirm from your inbox, then sign in.",
      };
    }
    if (message.includes("rate limit")) {
      return {
        error:
          "Too many attempts. Please wait a few minutes and try again.",
      };
    }
    return { error: error.message };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (userData.user) {
    await ensureAppUser(userData.user);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(prevState: AuthActionState, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string | null)?.trim() || "";

  if (!fullName || fullName.length < 2) {
    return { error: "Please enter your full name (at least 2 characters)." };
  }
  if (fullName.length > 120) {
    return { error: "Full name is too long (max 120 characters)." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, name: fullName },
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("rate limit")) {
      return {
        error:
          "Email rate limit exceeded. Please wait a few minutes before trying again, or contact support.",
      };
    }
    if (message.includes("already registered")) {
      return { error: "An account already exists for this email. Please sign in." };
    }
    return { error: error.message };
  }

  if (data.user) {
    await ensureAppUser(data.user);
  }

  revalidatePath("/", "layout");

  // If Supabase email confirmation is enabled, no session is created immediately.
  if (!data.session) {
    redirect("/login?signup=check-email");
  }

  redirect("/login?signup=success");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  prevState: PasswordResetState,
  formData: FormData
) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirectTo=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for this email, a password reset link has been sent.",
  };
}

export async function updatePassword(
  prevState: UpdatePasswordState,
  formData: FormData
) {
  const supabase = await createClient();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?password=reset");
}
