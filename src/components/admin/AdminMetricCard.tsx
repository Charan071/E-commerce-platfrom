import type { LucideIcon } from "lucide-react";

type Tone = "brand" | "amber" | "green" | "blue" | "purple";

const toneStyles: Record<Tone, { icon: string; text: string }> = {
  brand: { icon: "bg-neutral-100 text-[var(--admin-primary)]", text: "text-[var(--admin-primary)]" },
  amber: { icon: "bg-amber-50 text-amber-700", text: "text-amber-700" },
  green: { icon: "bg-green-50 text-green-700", text: "text-green-700" },
  blue: { icon: "bg-blue-50 text-blue-700", text: "text-blue-700" },
  purple: { icon: "bg-purple-50 text-purple-700", text: "text-purple-700" },
};

export function AdminMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  const styles = toneStyles[tone];

  return (
    <div className="min-h-[118px] rounded-lg border border-[#eadfd5] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles.icon}`}>
          <Icon size={25} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-1 font-serif text-2xl leading-none text-gray-950 2xl:text-3xl">{value}</p>
          {detail && <p className={`mt-2 text-xs font-medium ${styles.text}`}>{detail}</p>}
        </div>
      </div>
    </div>
  );
}
