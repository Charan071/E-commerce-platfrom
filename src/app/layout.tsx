import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getAuthContext } from "@/lib/auth";
import { getCatalogNavCategories } from "@/lib/catalog";
import { getBrandKitContent, getNavPromoBlocks } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "AnavaSilks — Luxury Silk Sarees",
    template: "%s · AnavaSilks",
  },
  description:
    "Heritage weaving and modern elegance — curated silk sarees rooted in craft and timeless grace.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "AnavaSilks",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [auth, brandKit, navPromos, navCategories] = await Promise.all([
    getAuthContext(),
    getBrandKitContent(),
    getNavPromoBlocks(),
    getCatalogNavCategories(),
  ]);
  const navUser = auth?.email
    ? { email: auth.email, name: auth.name ?? null, isAdmin: auth.isAdmin }
    : null;

  const brandVars = {
    "--color-text": brandKit.primaryColor,
    "--color-background": brandKit.secondaryColor,
    "--color-accent": brandKit.accentColor,
    "--color-surface": brandKit.surfaceColor,
    "--color-text-muted": brandKit.mutedTextColor,
    "--nav-letter-spacing": brandKit.navLetterSpacing,
    "--brand-heading-font": brandKit.headingFont,
    "--brand-body-font": brandKit.bodyFont,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      style={brandVars}
    >
      <body className="flex flex-col min-h-screen antialiased">
        <SiteChrome
          user={navUser}
          brandName={brandKit.brandName}
          navPromos={navPromos}
          navCategories={navCategories}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
