import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AccountWishlistPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/login?redirectTo=/account/wishlist");

  let items: Array<{
    id: string;
    product: {
      id: string;
      title: string;
      price: unknown;
      images: Array<{ url: string }>;
    };
  }> = [];

  try {
    items = await prisma.wishlistItem.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
    });
  } catch {
    items = [];
  }

  return (
    <section className="rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-text">Wishlist</h2>
        <Link href="/shop" className="text-sm font-medium text-primary hover:text-primary/80">
          Browse more
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#eadfd5] py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart size={22} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-text">Your wishlist is empty</h3>
          <p className="mt-1 max-w-sm text-sm text-text/60">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const image = item.product.images[0]?.url;
            return (
              <Link
                key={item.id}
                href={`/product/${item.product.id}`}
                className="group rounded-xl border border-[#eadfd5] p-3 transition-shadow hover:shadow-sm"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface">
                  {image && (
                    <Image
                      src={image}
                      alt={item.product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-3 truncate text-sm font-medium text-text">{item.product.title}</p>
                <p className="text-sm text-primary">{formatCurrency(Number(item.product.price))}</p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
