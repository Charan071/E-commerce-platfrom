"use server";

import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/email-validation";

export type NewsletterState = { ok?: boolean; error?: string };

function readSource(raw: FormDataEntryValue | null) {
  const value = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return value === "home" || value === "footer" ? value : "website";
}

export async function subscribeNewsletter(
  _prev: NewsletterState | undefined,
  formData: FormData
): Promise<NewsletterState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!email || !isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  const source = readSource(formData.get("source"));

  try {
    await prisma.newsletterSubscription.upsert({
      where: { email },
      create: { email, source },
      update: { source },
    });
  } catch (error) {
    console.error("[newsletter]", error);
    return { error: "We couldn’t save your email. Please try again." };
  }

  return { ok: true };
}
