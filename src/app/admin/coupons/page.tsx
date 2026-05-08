import Link from "next/link";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Coupons &amp; discounts</h2>
        <p className="text-sm text-gray-500 mt-1">
          Per-product sale pricing is live today via price, original price, and discount label fields on each
          product.
        </p>
      </div>
      <div className="rounded-xl border border-[#eadfd5] bg-white p-5 text-sm text-gray-700 space-y-3">
        <p>
          Cart-level promo codes are not enabled in this build. To ship them, add a <code className="text-xs bg-gray-100 px-1">Coupon</code> model, validate codes in checkout, and pass the discount into{" "}
          <code className="text-xs bg-gray-100 px-1">POST /api/orders</code>.
        </p>
        <Link href="/admin/products" className="text-[var(--admin-primary)] font-medium hover:underline">
          Manage product pricing →
        </Link>
      </div>
    </div>
  );
}
