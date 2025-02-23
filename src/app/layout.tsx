import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import { Suspense } from "react";

import Header from "@/components/Header";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const KanitFont = Kanit({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "BookBook",
  description: "A Marketplace for second-handed books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${KanitFont.className} antialiased`}>
        <AppProvider>
          <Header />
          <Suspense fallback={<LoadingAnimation />}>{children}</Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
