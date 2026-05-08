"use client";

import { useActionState } from "react";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";

const initialState: NewsletterState = {};

type NewsletterSignupFormProps = {
  variant: "footer" | "home";
  className?: string;
};

export function NewsletterSignupForm({ variant, className }: NewsletterSignupFormProps) {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  const inputClass =
    variant === "footer"
      ? "w-full border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-text)]/20"
      : "w-full border border-neutral-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[var(--color-text)]/20";

  const buttonClass =
    variant === "footer"
      ? "shrink-0 border border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-surface)] px-4 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
      : "shrink-0 bg-[var(--color-text)] text-[var(--color-surface)] px-6 py-3 text-sm uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-60";

  if (state.ok) {
    return (
      <p className={`text-sm text-text-muted ${className ?? ""}`} role="status">
        Thank you — you&apos;re on the list.
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-2 w-full ${className ?? ""}`}>
      <form action={formAction} className="flex flex-col sm:flex-row gap-2 w-full">
        <input type="hidden" name="source" value={variant} />
        <label className="sr-only" htmlFor={variant === "footer" ? "footer-newsletter-email" : "home-newsletter-email"}>
          Email address
        </label>
        <input
          id={variant === "footer" ? "footer-newsletter-email" : "home-newsletter-email"}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Your email"
          className={inputClass}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? `${variant}-newsletter-error` : undefined}
        />
        <button type="submit" className={buttonClass} disabled={pending}>
          {pending ? "…" : "Join"}
        </button>
      </form>
      {state.error ? (
        <p id={`${variant}-newsletter-error`} className="text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
