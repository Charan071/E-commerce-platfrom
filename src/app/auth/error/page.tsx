import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-extrabold text-primary font-serif">Authentication Error</h1>
        <p className="text-sm text-text/80">
          We could not complete your authentication request. Please try signing in again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md border border-[#eadfd5] px-4 text-sm font-medium text-text hover:bg-[#fffaf6]"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
