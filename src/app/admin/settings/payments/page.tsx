function envOk(key: string) {
  const v = process.env[key];
  return typeof v === "string" && v.trim().length > 0;
}

export default function AdminPaymentsSettingsPage() {
  const rows = [
    { label: "Supabase URL (public)", key: "NEXT_PUBLIC_SUPABASE_URL" },
    { label: "Supabase anon key (public)", key: "NEXT_PUBLIC_SUPABASE_ANON_KEY" },
    { label: "Database URL (server)", key: "DATABASE_URL" },
  ] as const;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
        <p className="text-sm text-gray-500 mt-1">
          Checkout currently supports COD and cart totals. Payment gateway keys belong in server env (never
          <code className="mx-1">NEXT_PUBLIC_</code>).
        </p>
      </div>

      <div className="rounded-xl border border-[#eadfd5] bg-white divide-y divide-[#eadfd5] text-sm">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-medium text-gray-900">{row.label}</p>
              <p className="text-xs font-mono text-gray-500">{row.key}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                envOk(row.key) ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"
              }`}
            >
              {envOk(row.key) ? "Present" : "Missing"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
