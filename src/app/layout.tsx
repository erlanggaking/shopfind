import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopfind - Agency Command Center",
  description: "All-in-One Agency Command Center for Shopee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        <LayoutWrapper>
           {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
