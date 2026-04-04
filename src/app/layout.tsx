import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlycemicGPT - Open Source Diabetes Management Platform",
  description:
    "Because no one should manage diabetes alone. Real-time glucose monitoring, AI-powered analysis, caregiver alerts, and Wear OS support. Self-hosted, privacy-first, open source.",
  openGraph: {
    title: "GlycemicGPT - Open Source Diabetes Management Platform",
    description:
      "Because no one should manage diabetes alone. Real-time glucose monitoring, AI-powered analysis, caregiver alerts, and Wear OS support.",
    url: "https://glycemicgpt.org",
    siteName: "GlycemicGPT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
