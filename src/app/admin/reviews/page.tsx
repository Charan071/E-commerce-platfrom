import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await (async () => {
    try {
      return await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: {
          product: { select: { id: true, title: true, slug: true } },
          user: { select: { email: true, name: true } },
        },
      });
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[#1e140d]">Reviews</h2>
        <p className="text-sm text-[#7c6652] mt-1">Customer ratings and comments tied to catalog products.</p>
      </div>

      <div className="rounded-xl border border-[#eadfd5] bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f8f5f2] text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eadfd5]">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No reviews yet. They appear when customers submit ratings for products.
                </td>
              </tr>
            ) : (
              reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#fdf8f4] align-top">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {rev.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/product/${rev.product.id}`}
                      className="font-medium text-[var(--admin-primary)] hover:underline"
                      target="_blank"
                    >
                      {rev.product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>{rev.user.name ?? "—"}</div>
                    <div className="text-xs text-gray-500">{rev.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{rev.rating} / 5</td>
                  <td className="px-4 py-3 text-gray-600 max-w-md">{rev.comment ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
