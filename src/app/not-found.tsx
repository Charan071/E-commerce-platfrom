import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-text-muted mb-4">404</p>
      <h1 className="font-serif text-3xl md:text-4xl text-text mb-3">This page isn&apos;t here</h1>
      <p className="text-sm text-text-muted max-w-md mb-8 leading-relaxed">
        The link may be outdated, or the piece may have moved. Let&apos;s take you back to the collection.
      </p>
      <Link
        href="/"
        className="text-xs uppercase tracking-[0.2em] border-b border-[var(--color-text)] pb-1 text-text hover:opacity-80 transition-opacity"
      >
        Return home
      </Link>
    </div>
  );
}
