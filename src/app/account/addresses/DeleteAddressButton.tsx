"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteAddress } from "@/app/account/actions";

export function DeleteAddressButton({ addressId }: { addressId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteAddress(addressId);
        })
      }
      className="inline-flex items-center gap-1.5 rounded-md border border-[#eadfd5] px-3 py-1.5 text-xs font-medium text-text/70 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Delete
    </button>
  );
}
