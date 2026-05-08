import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const auth = await getAuthContext();
  if (!auth) redirect("/login?redirectTo=/account");

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { name: true, phone: true, email: true },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl text-text">Profile</h2>
        <p className="mt-1 text-sm text-text/60">
          Keep your personal information up to date for faster checkout and better recommendations.
        </p>

        <div className="mt-5">
          <ProfileForm
            email={auth.email ?? user?.email ?? ""}
            defaultName={user?.name ?? ""}
            defaultPhone={user?.phone ?? ""}
          />
        </div>
      </section>
    </div>
  );
}
