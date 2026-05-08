import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthContext();

  if (!auth) {
    redirect("/login?redirectTo=/account");
  }

  return (
    <div className="bg-surface min-h-[calc(100vh-200px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-primary">My Account</h1>
          <p className="mt-1 text-sm text-text/70">
            Manage your profile, orders, addresses, and wishlist.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <AccountSidebar email={auth.email ?? ""} name={auth.name ?? null} />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
