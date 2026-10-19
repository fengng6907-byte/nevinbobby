import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nevinbobby.vercel.app"),
  title: { default: "ENCORE — Find Your Music. Find Your Night.", template: "%s · ENCORE" },
  description: "Discover the best live bands, bars and music venues across Malaysia and Singapore.",
  openGraph: { title: "ENCORE — Find Your Music. Find Your Night.", description: "A live-music discovery and entertainment marketplace for Malaysia and Singapore.", type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
