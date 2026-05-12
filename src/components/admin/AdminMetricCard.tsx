import type { LucideIcon } from "lucide-react";

export function AdminMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone: _tone,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-black">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
          <p className="mt-1 text-2xl font-light text-black leading-none">{value}</p>
          {detail && <p className="mt-1.5 text-[11px] text-neutral-400">{detail}</p>}
        </div>
      </div>
    </div>
  );
}
