import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Digital Product Marketplace — Produk Digital Premium",
    template: "%s · Digital Product Marketplace",
  },
  description:
    "Marketplace produk digital premium: template website, source code, ebook, asset, dan prompt AI. Beli, bayar otomatis, download instan.",
  keywords: ["produk digital", "template website", "source code", "ebook", "prompt ai", "marketplace"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Digital Product Marketplace",
    title: "Digital Product Marketplace — Produk Digital Premium",
    description: "Beli produk digital premium dengan pembayaran otomatis dan download instan.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
