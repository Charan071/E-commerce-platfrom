import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressForm } from "./AddressForm";
import { DeleteAddressButton } from "./DeleteAddressButton";

export const dynamic = "force-dynamic";

export default async function AccountAddressesPage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/login?redirectTo=/account/addresses");

  let addresses: Array<{
    id: string;
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  }> = [];

  try {
    addresses = await prisma.address.findMany({
      where: { userId: auth.userId },
      orderBy: [{ isDefault: "desc" }, { id: "asc" }],
    });
  } catch {
    addresses = [];
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-text">Saved Addresses</h2>
        <p className="mt-1 text-sm text-text/60">
          Manage your shipping addresses for faster checkout.
        </p>

        {addresses.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#eadfd5] py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin size={20} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-text">No addresses yet</h3>
            <p className="mt-1 text-sm text-text/60">Add your first address below.</p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-xl border border-[#eadfd5] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-text">{address.fullName}</p>
                  {address.isDefault && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-text/70">{address.phone}</p>
                <p className="mt-2 text-sm text-text">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p className="text-sm text-text">
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="text-sm text-text/60">{address.country}</p>

                <div className="mt-3 flex justify-end">
                  <DeleteAddressButton addressId={address.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl text-text">Add a New Address</h2>
        <div className="mt-4">
          <AddressForm />
        </div>
      </section>
    </div>
  );
}
