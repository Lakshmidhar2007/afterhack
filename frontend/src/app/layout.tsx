import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/common/Toast";
import AIChatWidget from "@/components/ai/AIChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AfterHack - Where Hackathon Projects Meet Real Opportunities",
  description: "Connect student builders with founders and recruiters. Turn your hackathon code into careers. Get your projects discovered by people who matter.",
  keywords: ["hackathon", "student projects", "startup", "recruiting", "founders", "builders"],
  openGraph: {
    title: "AfterHack - Where Hackathon Projects Meet Real Opportunities",
    description: "Connect student builders with founders and recruiters. Turn your hackathon code into careers.",
    type: "website",
    locale: "en_US",
    siteName: "AfterHack",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfterHack - Post-Hackathon Deal Room",
    description: "Connect student builders with founders and recruiters.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
            <AIChatWidget />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
