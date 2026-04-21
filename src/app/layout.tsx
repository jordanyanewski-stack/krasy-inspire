import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Krasy Inspire",
    template: "%s · Krasy Inspire",
  },
  description:
    "Свещено пространство за женска енергия, духовен растеж и вдъхновен живот.",
  openGraph: {
    siteName: "Krasy Inspire",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--parchment)] text-[var(--ink)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
