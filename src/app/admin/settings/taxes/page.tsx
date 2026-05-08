export default function AdminTaxesSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Taxes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Product detail pages state that listed prices are inclusive of taxes. Order totals snapshot what the
          customer agreed to at checkout.
        </p>
      </div>
      <div className="rounded-xl border border-[#eadfd5] bg-white p-5 text-sm text-gray-700 leading-relaxed">
        <p>
          For GST breakdowns or multi-region tax tables, extend the order schema with tax lines and validate
          against your accounting workflow before launch.
        </p>
      </div>
    </div>
  );
}
