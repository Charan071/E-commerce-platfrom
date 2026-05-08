"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { addAddress } from "@/app/account/actions";

export function AddressForm() {
  const [state, formAction, isPending] = useActionState(addAddress, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="fullName" label="Full Name" required placeholder="Recipient name" />
        <Field name="phone" label="Phone" required type="tel" placeholder="+91 9876543210" />
      </div>

      <Field name="line1" label="Address Line 1" required placeholder="House / flat / street" />
      <Field name="line2" label="Address Line 2" placeholder="Area / landmark (optional)" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field name="city" label="City" required />
        <Field name="state" label="State" required />
        <Field name="pincode" label="Pincode" required />
      </div>

      <label className="flex items-center gap-2 text-sm text-text">
        <input type="checkbox" name="isDefault" className="h-4 w-4 rounded border-[#d9c7b8]" />
        Set as default shipping address
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Address"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium uppercase tracking-wide text-text/60">
        {label}
        {required ? "" : " (optional)"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border border-[#eadfd5] bg-white px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
