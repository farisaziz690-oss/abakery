import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import { CartProvider } from "@/components/providers/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A'Bakery - Roti & Pastry Premium Pre-Order | Surabaya",
  description: "Nikmati kelezatan roti dan kue buatan tangan segar setiap hari dari A'Bakery Surabaya. Dibuat premium menggunakan bahan berkualitas tinggi berdasarkan pesanan (Pre-Order H-1).",
  keywords: ["bakery surabaya", "roti surabaya", "pastry surabaya", "pre-order roti", "roti premium", "abakery"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
