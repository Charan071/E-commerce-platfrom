"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary font-serif">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-text/70">
            Save your orders and checkout faster
          </p>
        </div>

        <form className="mt-8 space-y-5" action={formAction}>
          {state?.error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="full-name" className="block text-xs font-medium uppercase tracking-wide text-text/60">
              Full name
            </label>
            <input
              id="full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 text-sm text-text placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Anu Sharma"
            />
          </div>

          <div>
            <label htmlFor="email-address" className="block text-xs font-medium uppercase tracking-wide text-text/60">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 text-sm text-text placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-text/60">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-3 pr-11 text-sm text-text placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 px-3 text-text/60 hover:text-text"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-all duration-200"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
          </button>
        </form>

        <div className="text-center text-sm text-text/80 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
