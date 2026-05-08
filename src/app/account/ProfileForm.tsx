"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/app/account/actions";

type ProfileFormProps = {
  defaultName: string;
  defaultPhone: string;
  email: string;
};

export function ProfileForm({ defaultName, defaultPhone, email }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-text/60">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          readOnly
          className="mt-1 block w-full rounded-md border border-[#eadfd5] bg-surface px-3 py-2.5 text-sm text-text/70"
        />
        <p className="mt-1 text-xs text-text/50">
          Email is managed via Supabase Auth and cannot be changed here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-text/60">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={defaultName}
            placeholder="Your name"
            className="mt-1 block w-full rounded-md border border-[#eadfd5] bg-white px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wide text-text/60">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultPhone}
            placeholder="+91 9876543210"
            className="mt-1 block w-full rounded-md border border-[#eadfd5] bg-white px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
