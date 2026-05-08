"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-text-muted mb-4">Something went wrong</p>
      <h1 className="font-serif text-3xl md:text-4xl text-text mb-3">A quiet interruption</h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        Please try again. If the problem continues, contact us and we&apos;ll help.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={reset}
          className="text-xs uppercase tracking-[0.2em] border border-[var(--color-text)] px-5 py-2.5 text-text hover:bg-[var(--color-text)] hover:text-[var(--color-surface)] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] border-b border-[var(--color-text)] pb-1 text-text self-center"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
