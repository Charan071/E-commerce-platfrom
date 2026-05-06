import { clsx } from "clsx";

const styles: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-700",
  PROCESSING: "border-blue-200 bg-blue-50 text-blue-700",
  SHIPPED: "border-purple-200 bg-purple-50 text-purple-700",
  DELIVERED: "border-green-200 bg-green-50 text-green-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
  REFUNDED: "border-gray-200 bg-gray-100 text-gray-700",
  UNPAID: "border-amber-200 bg-amber-50 text-amber-700",
  PAID: "border-green-200 bg-green-50 text-green-700",
  PARTIALLY_REFUNDED: "border-purple-200 bg-purple-50 text-purple-700",
  FAILED: "border-red-200 bg-red-50 text-red-700",
  IN_STOCK: "border-green-200 bg-green-50 text-green-700",
  LOW_STOCK: "border-orange-200 bg-orange-50 text-orange-700",
  OUT_OF_STOCK: "border-red-200 bg-red-50 text-red-700",
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
        "inline-flex min-w-[76px] items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium",
        styles[value] ?? "border-gray-200 bg-gray-50 text-gray-700"
      )}
    >
      {humanize(value)}
    </span>
  );
}
