import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Issue PR Dashboard - Manage Issues and Pull Requests",
  description: "A comprehensive dashboard for tracking, filtering, and managing GitHub issues and pull requests. Streamline your development workflow with real-time insights and analytics.",
  keywords: ["GitHub", "issues", "pull requests", "dashboard", "development", "project management"],
  authors: [{ name: "GitHub Issue PR Dashboard Team" }],
  robots: "index, follow",
  openGraph: {
    images: "/og-image.png",
    url: "https://github-issue-pr-dashboard.vercel.app",
    type: "website",
    siteName: "GitHub Issue PR Dashboard",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://github-issue-pr-dashboard.vercel.app",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
