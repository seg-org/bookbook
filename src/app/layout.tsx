import Header from "@/components/Header";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { AuthProvider } from "@/providers/auth-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <Suspense fallback={<LoadingAnimation />}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
