import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { OrderStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/auth";
import { getBrandKitContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Panel - AnavaSilks",
  description: "AnavaSilks store administration",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/?admin=forbidden");
  }
  const brandKit = await getBrandKitContent();

  let pendingOrdersCount = 0;
  try {
    pendingOrdersCount = await prisma.order.count({
      where: { status: OrderStatus.PENDING },
    });
  } catch {
    pendingOrdersCount = 0;
  }

  const adminEmail = admin.email ?? "";
  const adminName = admin.name ?? "";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={
        {
          backgroundColor: brandKit.secondaryColor,
          "--admin-primary": brandKit.primaryColor,
          "--admin-accent": brandKit.accentColor,
          "--admin-surface": brandKit.secondaryColor,
        } as CSSProperties
      }
    >
      <AdminSidebar
        pendingOrdersCount={pendingOrdersCount}
        adminEmail={adminEmail}
        adminName={adminName}
        brandName={brandKit.brandName}
        brandTagline={brandKit.tagline}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader
          pendingOrdersCount={pendingOrdersCount}
          adminEmail={admin.email}
          adminName={admin.name}
          brandName={brandKit.brandName}
        />
        <main className="flex-1 overflow-y-auto bg-[#f5f0ea] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
