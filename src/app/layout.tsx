import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import IntelligenceNavigation from "@/components/navigation/IntelligenceNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CS Intelligence Platform - Cybersecurity Investment Intelligence",
  description: "Advanced cybersecurity investment intelligence platform with AI-powered analysis, startup detection, and comprehensive data management.",
  keywords: ["cybersecurity", "investment intelligence", "AI analysis", "startup detection", "venture capital", "threat intelligence", "portfolio management"],
  authors: [{ name: "Ballistic Ventures" }],
  openGraph: {
    title: "CS Intelligence Platform",
    description: "Cybersecurity investment intelligence with AI-powered analysis",
    url: "http://localhost:3000",
    siteName: "CS Intelligence Platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CS Intelligence Platform",
    description: "Cybersecurity investment intelligence with AI-powered analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <IntelligenceNavigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
