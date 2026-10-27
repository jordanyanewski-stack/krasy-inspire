import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://krasyinspire.com"),
  title: {
    default: "Krasy Inspire",
    template: "%s · Krasy Inspire",
  },
  description:
    "Свещено пространство за женска енергия, духовен растеж и вдъхновен живот.",
  twitter: {card:"summary_large_image",images:["/krasy.jpg"]},
  openGraph: {
    siteName: "Krasy Inspire",
    type: "website",
    locale: "bg_BG",
    title: "Krasy Inspire",
    description: "Свещено пространство за женска енергия, духовен растеж и вдъхновен живот.",
    images: [{url:"/krasy.jpg",alt:"Краси — Krasy Inspire"}],
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
