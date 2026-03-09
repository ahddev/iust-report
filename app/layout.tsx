import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers'


const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "نظام الإبلاغ عن المشاكل - الجامعة الدولية للعلوم والتكنولوجيا",
  description: "نظام الإبلاغ عن المشاكل - الجامعة الدولية للعلوم والتكنولوجيا",
  icons: {
    icon: "/iust-logo.webp",
    shortcut: "/iust-logo.webp",
    apple: "/iust-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
     <body className={`${cairo.variable} font-cairo antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}