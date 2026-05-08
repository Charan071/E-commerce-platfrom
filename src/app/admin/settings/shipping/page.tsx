export default function AdminShippingSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Shipping</h2>
        <p className="text-sm text-gray-500 mt-1">
          Storefront messaging promotes free shipping above ₹5,000. Shipping amounts on orders are set at
          checkout from the cart flow.
        </p>
      </div>
      <div className="rounded-xl border border-[#eadfd5] bg-white p-5 text-sm text-gray-700 leading-relaxed">
        <p>
          To make rates dynamic per pincode or carrier, add a shipping rules model and admin editor, then
          read those rules in <code className="text-xs bg-gray-100 px-1">/checkout</code> and{" "}
          <code className="text-xs bg-gray-100 px-1">POST /api/orders</code>.
        </p>
      </div>
    </div>
  );
}
