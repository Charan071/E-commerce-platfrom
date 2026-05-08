import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

function pageHref(basePath: string, params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  const query = next.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function AdminPagination({
  basePath,
  page,
  totalPages,
  params,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params: URLSearchParams;
}) {
  const pages = Array.from(new Set([1, page, page + 1, page + 2, totalPages]))
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pageHref(basePath, params, Math.max(1, page - 1))}
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-md border border-[#eadfd5] bg-white text-gray-700",
          page === 1 && "pointer-events-none opacity-50"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Link>
      {pages.map((item, index) => (
        <div key={item} className="flex items-center gap-2">
          {index > 0 && item - pages[index - 1] > 1 && (
            <span className="px-1 text-sm text-gray-500">...</span>
          )}
          <Link
            href={pageHref(basePath, params, item)}
            className={clsx(
              "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium",
              item === page
                ? "border-[var(--admin-primary)] bg-[var(--admin-primary)] text-white"
                : "border-[#eadfd5] bg-white text-gray-700 hover:text-[var(--admin-primary)]"
            )}
          >
            {item}
          </Link>
        </div>
      ))}
      <Link
        href={pageHref(basePath, params, Math.min(totalPages, page + 1))}
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-md border border-[#eadfd5] bg-white text-gray-700",
          page >= totalPages && "pointer-events-none opacity-50"
        )}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
