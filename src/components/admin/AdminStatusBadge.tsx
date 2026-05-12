import { clsx } from "clsx";

const styles: Record<string, string> = {
  DELIVERED:           "bg-black text-white border-black",
  PAID:                "bg-black text-white border-black",
  IN_STOCK:            "bg-black text-white border-black",
  PENDING:             "bg-white text-neutral-700 border-neutral-300",
  CONFIRMED:           "bg-white text-neutral-700 border-neutral-300",
  PROCESSING:          "bg-white text-neutral-700 border-neutral-300",
  SHIPPED:             "bg-white text-neutral-700 border-neutral-300",
  UNPAID:              "bg-white text-neutral-700 border-neutral-300",
  LOW_STOCK:           "bg-white text-neutral-700 border-neutral-300",
  CANCELLED:           "bg-neutral-100 text-neutral-400 border-neutral-200",
  REFUNDED:            "bg-neutral-100 text-neutral-400 border-neutral-200",
  PARTIALLY_REFUNDED:  "bg-neutral-100 text-neutral-400 border-neutral-200",
  FAILED:              "bg-neutral-100 text-neutral-400 border-neutral-200",
  OUT_OF_STOCK:        "bg-neutral-100 text-neutral-400 border-neutral-200",
};

function humanize(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function AdminStatusBadge({ value }: { value: string }) {
  return (
    <span
      className={clsx(
        "inline-flex min-w-[76px] items-center justify-center rounded border px-2.5 py-1 text-xs font-medium",
        styles[value] ?? "bg-neutral-100 text-neutral-500 border-neutral-200"
      )}
    >
      {humanize(value)}
    </span>
  );
}
