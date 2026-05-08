import Link from "next/link";
import { ArrowUpRight, Wrench } from "lucide-react";

type AdminFeaturePageProps = {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function AdminFeaturePage({
  title,
  description,
  ctaHref = "/admin",
  ctaLabel = "Back to Dashboard",
}: AdminFeaturePageProps) {
  return (
    <section className="rounded-lg border border-[#eadfd5] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#8b1a1a]/10 text-[#8b1a1a]">
          <Wrench size={20} />
        </div>

        <div className="min-w-0">
          <h2 className="font-serif text-2xl text-gray-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">{description}</p>
          <Link
            href={ctaHref}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#b80012]"
          >
            {ctaLabel}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
